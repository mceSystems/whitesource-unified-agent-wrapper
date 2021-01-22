import os from "os";
import path from "path";
import { promises as fs } from "fs";
import { exec } from "child_process";
import createDebug from "debug";
import { RunAgentOptions, WhiteSourceAgentConfiguration } from "./types";

const debug = createDebug("whitesource-ua-wrapper");

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

function objectToEntries(prefix: string, obj: Record<string, any>) {
	return Object.entries(obj).map(([key, value]) => {
		const nextPrefix = prefix ? `${prefix}.${key}` : key;
		if ("object" === typeof value) {
			return objectToEntries(nextPrefix, value);
		}
		return [nextPrefix, value];
	})
}

/**
 * Build a temporary configuration file and returns the path
 *
 * @param {WhiteSourceAgentConfiguration} config
 * @returns {string}
 */
async function buildConfigurationFile(config: WhiteSourceAgentConfiguration): Promise<string> {
	const logFilePath = path.resolve(os.tmpdir(), `wss-unified-agent.${Date.now()}.${Math.round(Math.random() * 10000)}.config`);
	const configEntires = objectToEntries("", config);

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

export default async function runAgent(options: RunAgentOptions): Promise<void> {
	await verifyJavaInPath();
	const configurationFilePath = await buildConfigurationFile(options.agentConfig);
	debug(`Configuration file created in ${configurationFilePath}`);

	// TODO: everything else :)

	await fs.unlink(configurationFilePath);
	debug(`Configuration file deleted ${configurationFilePath}`);

}