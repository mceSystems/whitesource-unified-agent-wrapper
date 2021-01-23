import os from "os";
import path from "path";
import fs from "fs-extra";
import readline from "readline";
import { exec } from "child_process";
import { pipeline } from "stream";
import { promisify } from "util";
import createDebug from "debug";
import fetch from "node-fetch";
import { Tail } from "tail";
import { RunAgentOptions, WhiteSourceAgentConfiguration } from "./types";

export * from "./types";

const AGENT_DOWNLOAD_DIR = path.resolve(__dirname, "agent");

const debug = createDebug("whitesource-ua-wrapper");
const streamPipeline = promisify(pipeline);

function nowWithRandom(): string {
	return `${Date.now()}.${Math.round(Math.random() * 10000)}`;
}

function verifyJavaInPath(): Promise<void> {
	return new Promise((resolve, reject) => {
		exec("java -version", (err) => {
			if (err) {
				debug("Error running 'java -version' (is java installed and in path?)");
				reject(new Error("JDK must be installed and 'java' must be in the path"));
				return;
			}
			resolve();
		})
	});
}

function verifyOptions({ agentConfig }: RunAgentOptions): void {
	if (!agentConfig) {
		throw new Error("Option 'agentConfig' is missing");
	}
}

function objectToEntries(prefix: string, obj: Record<string, any>) {
	return Object.entries(obj).map(([key, value]) => {
		const nextPrefix = prefix ? `${prefix}.${key}` : key;
		if ("object" === typeof value) {
			return objectToEntries(nextPrefix, value);
		}
		return [nextPrefix, value];
	})
}

function modifyConfigurationSpecialFields(config: WhiteSourceAgentConfiguration): Record<string, any> {
	const configCopy = JSON.parse(JSON.stringify(config));
	if (configCopy.includes) configCopy.includes = configCopy.includes.join(";");
	if (configCopy.excludes) configCopy.excludes = configCopy.excludes.join(";");
	return configCopy;
}

/**
 * Build a temporary configuration file and returns the path
 *
 * @param {WhiteSourceAgentConfiguration} config
 * @returns {string}
 */
async function buildConfigurationFile(config: WhiteSourceAgentConfiguration): Promise<string> {
	const logFilePath = path.resolve(os.tmpdir(), `wss-unified-agent.${Date.now()}.${Math.round(Math.random() * 10000)}.config`);
	const modifiedConfig = modifyConfigurationSpecialFields(config);
	const configEntires = objectToEntries("", modifiedConfig);

	// flatten entries multi-hierarchy arrays to a flat pairs array
	let toIterate = [configEntires];
	const configPairs = [];
	for (let i = 0; i < toIterate.length; i++) {
		if (2 === toIterate[i].length && "string" === typeof toIterate[i][0] && "string" === typeof toIterate[i][1]) {
			configPairs.push(toIterate[i]);
			continue;
		}
		toIterate.push(...toIterate[i]);
	}

	await fs.writeFile(logFilePath, configPairs.map(entry => entry.join("=")).join("\n"));
	return logFilePath;
}

/**
 * Verifies the agent, given the require version, exists locally.
 * If not, it downloads it
 * Returns the full path of the local file
 *
 * @returns {string}
 */
async function ensureAgent(version: string): Promise<string> {
	const agentPath = path.resolve(AGENT_DOWNLOAD_DIR, `wss-unified-agent.${version}.jar`);
	await fs.ensureDir(AGENT_DOWNLOAD_DIR);
	const alreadyExists = await fs.pathExists(agentPath);
	if ("latest" !== version && alreadyExists) {
		return agentPath;
	}
	await fs.emptyDir(AGENT_DOWNLOAD_DIR);
	const fileStream = fs.createWriteStream(agentPath);
	const agentFileUrl = "latest" === version
		? "https://github.com/whitesource/unified-agent-distribution/releases/latest/download/wss-unified-agent.jar"
		: `https://github.com/whitesource/unified-agent-distribution/releases/download/v${version}/wss-unified-agent.jar`;
	debug(`Downloading agent from ${agentFileUrl}`);
	const response = await fetch(agentFileUrl);
	if (!response.ok) {
		throw new Error(`Failed to download agent: ${response.statusText}`);
	}
	await streamPipeline(response.body, fileStream);

	return agentPath;
}

/**
 * Execute the agent java command and returns the exit code
 *
 * @param {string} command
 * @returns {Promise<number>}
 */
function executeAgentCommand(command: string): Promise<number> {
	return new Promise<number>((res) => {
		exec(command, {
			maxBuffer: 100 * 1024 * 1024 * 1024
		}, (err) => {
			res(err?.code || 0);
		});
	})
}


/**
 * Handles log files and watches them for changes
 * If user provided config.log.files.path, log files will be kept
 * Otherwise will be delete after session is done
 *
 * @param {WhiteSourceAgentConfiguration} config
 */
async function handleLogFiles({ agentConfig: config, onLogLine }: RunAgentOptions): Promise<{ shouldDelete: boolean; logsPath: string, stopWatching: () => void }> {
	if (!onLogLine) {
		throw new Error("handleLogFiles will only work if onLogLine is set")
	}
	const shouldDelete = !config.log?.files.path;
	const logsPath = config.log?.files.path || path.resolve(__dirname, "logs", `${nowWithRandom()}.log`);
	if (!config.log) {
		config.log = {
			files: {}
		};
	}
	if (!config.log.files) {
		config.log.files = {};
	}
	config.log.files.path = logsPath;
	await fs.ensureDir(logsPath);

	let logFilesWatcher: fs.FSWatcher | null = null;
	let currentFileTail: Tail | null = null;
	const topLevelWatcher = fs.watch(logsPath, (topEvent: string, topFilename: string) => {
		if ("rename" == topEvent) {
			const internalFolderToWatch = path.resolve(logsPath, topFilename);
			topLevelWatcher.close();

			const newLineReader = async (logFile) => {
				const fullLogFilePath = path.resolve(internalFolderToWatch, logFile)
				debug("New log watcher for", logFile);
				if (currentFileTail) {
					currentFileTail.unwatch();
					currentFileTail = null;
				}
				currentFileTail = new Tail(fullLogFilePath);
				currentFileTail.on("line", onLogLine);
			};
			logFilesWatcher = fs.watch(internalFolderToWatch, (event: string, filename: string) => {
				if ("rename" === event) {
					newLineReader(filename);
				}
			});
			// reading synchronously to prevent a watcher event to arrive before first dir read.
			// assuming by now we have only one file at most
			const currentLogFile = fs.readdirSync(internalFolderToWatch)[0] || "";
			if (currentLogFile) {
				newLineReader(currentLogFile);
			}
		}
	});

	const stopWatching = () => {
		if (logFilesWatcher) {
			logFilesWatcher.close();
		}
		if (currentFileTail) {
			currentFileTail.unwatch();
		}
	}

	return {
		shouldDelete,
		stopWatching,
		logsPath,
	}
}

export default async function runAgent(options: RunAgentOptions): Promise<void> {
	await verifyJavaInPath();
	verifyOptions(options);
	const {
		agentConfig,
		agentVersion = "latest",
		dirs = [process.cwd()],
		onLogLine
	} = options;

	let shouldDeleteLogDir = false;
	let stopWatchingLogs = () => { };
	let logsPath = "";
	if (onLogLine) {
		({ logsPath, shouldDelete: shouldDeleteLogDir, stopWatching: stopWatchingLogs } = await handleLogFiles(options));
		debug("Log files path:", logsPath);
		debug("Will logs be delete?", shouldDeleteLogDir);
	} else {
		debug("Not watching logs");
	}


	const configurationFilePath = await buildConfigurationFile(agentConfig);
	debug(`Configuration file created in ${configurationFilePath}`);

	debug(`Making sure we have agent version ${agentVersion}`);
	const jarPath = await ensureAgent(agentVersion);
	const dirsToScan = dirs.join(",");
	debug(`Scanning directories ${dirsToScan}`);
	const command = `java -jar ${jarPath} -c ${configurationFilePath} -d ${dirsToScan} -logLevel off`;
	debug(`Full command: ${command}`);

	const exitCode = await executeAgentCommand(command);
	debug(`Agent process exit code: ${exitCode}`);
	stopWatchingLogs();

	await fs.remove(configurationFilePath);
	debug(`Configuration file deleted ${configurationFilePath}`);

	if (shouldDeleteLogDir) {
		await fs.remove(logsPath);
		debug(`Log files dir deleted ${logsPath}`);
	}

	if (0 !== exitCode) {
		throw new Error(`Agent process ended with non-zero code: ${exitCode}`);
	}
}