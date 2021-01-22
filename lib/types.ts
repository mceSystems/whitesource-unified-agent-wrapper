

export interface WhiteSourceAgentConfiguration {
	wss?: {
		url?: string;
	};
	projectTag?: number;
	projectName?: string;
	productName?: string;
	includes?: string;
	excludes?: string;
	configFilePath?: string;
	apiKey?: string;
	whiteSourceFolderPath?: string;
	userKey?: number;
	updateType?: string;
	updateInventory?: boolean;
	updateEmptyProject?: boolean;
	scanReportTimeoutMinutes?: number;
	scanReportFilenameFormat?: string;
	scanPackageManager?: boolean;
	scanComment?: number;
	resolveAllDependencies?: boolean;
	requireKnownSha1?: boolean;
	requesterEmail?: number;
	recommendationDetector?: boolean;
	projectVersion?: number;
	projectToken?: number;
	projectPerFolderIncludes?: string;
	projectPerFolderExcludes?: number;
	projectPerFolder?: boolean;
	productVersion?: number;
	productToken?: number;
	offline?: boolean;
	log?: {
		level?: string;
	};
	ignoreSourceFiles?: boolean;
	iaLanguage?: number;
	generateScanReport?: boolean;
	generateProjectDetailsJson?: boolean;
	forceUpdate?: boolean;
	forceCheckAllDependencies?: boolean;
	failErrorLevel?: string;
	excludeDependenciesFromNodes?: number;
	euaVul?: string;
	euaRes?: string;
	euaOffline?: number;
	euaDep?: string;
	enableImpactAnalysis?: boolean;
	docker?: {
		scanContainers?: boolean;
		scanTarFiles?: boolean;
		scanImages?: boolean;
		scan?: {
			maxImages?: number;
		};
		pull?: {
			tags?: number;
			maxImages?: number;
			images?: number;
			force?: boolean;
			enable?: boolean;
			digest?: number;
		};
		projectNameFormat?: string;
		login?: {
			sudo?: boolean;
		};
		layers?: boolean;
		includes?: string;
		includeSingleScan?: number;
		excludes?: number;
		excludeBaseImage?: boolean;
		dockerfilePath?: number;
		delete?: {
			force?: boolean;
		};
		containerIncludes?: string;
		containerExcludes?: string;
		artifactory?: {
			userPassword?: number;
			userName?: number;
			url?: number;
			repositoriesNames?: number;
			pullUrl?: number;
			enable?: boolean;
			dockerAccessMethod?: string;
		};
		aws?: {
			registryIds?: number;
			region?: string;
			enable?: string;
		};
		azure?: {
			userPassword?: number;
			userName?: number;
			registryNames?: number;
			registryAuthenticationParameters?: number;
			enable?: boolean;
			authenticationType?: string;
		};
		gcr?: {
			repositories?: number;
			enable?: boolean;
			account?: string;
		};
		hub?: {
			userPassword?: number;
			userName?: number;
			organizationsNames?: number;
			enabled?: boolean;
			accessToken?: string;
		}
	};
	checkPolicies?: boolean;
	appPath?: number;
	analyzeMultiModule?: number;
	analyzeFrameworksReference?: string;
	analyzeFrameworks?: string;
	ignoreEuaNotices?: string;
	ant?: {
		resolveDependencies?: boolean;
		pathIdIncludes?: number;
		external?: {
			parameters?: string;
		}
	};
	archiveIncludes?: number;
	archiveExtractionDepth?: number;
	archiveExcludes?: string;
	artifactory?: {
		userPassword?: number;
		userName?: number;
		url?: number;
		repoKeys?: number;
		includes?: string;
		excludes?: number;
		enableScan?: boolean;
		accessToken?: string;
	};
	bazel?: {
		runPreStep?: boolean;
		resolveDependencies?: string;
	};
	bower?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoreSourceFiles?: string;
	};
	haskell?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoreSourceFiles?: boolean;
		ignorePreStepErrors?: string;
	};
	cargo?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoreSourceFiles?: string;
	};
	cocoapods?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoreSourceFiles?: string;
	};
	followSymbolicLinks?: boolean;
	case?: {
		sensitive?: {
			glob?: string;
		}
	};
	go?: {
		resolveDependencies?: boolean;
		ignoreSourceFiles?: boolean;
		gogradle?: {
			enableTaskAlias?: boolean;
		};
		glide?: {
			ignoreTestPackages?: boolean;
		};
		dependencyManager?: number;
		collectDependenciesAtRuntime?: string;
	};
	gradle?: {
		wrapperPath?: number;
		runPreStep?: boolean;
		runAssembleCommand?: boolean;
		resolveDependencies?: boolean;
		preferredEnvironment?: string;
		multiModule?: {
			applyProjectVersion?: boolean;
		};
		localRepositoryPath?: number;
		includedScopes?: number;
		includedConfigurations?: number;
		includeModules?: number;
		ignoredScopes?: number;
		ignoredConfigurations?: number;
		ignoreSourceFiles?: boolean;
		excludeModules?: number;
		downloadMissingDependencies?: boolean;
		aggregateModules?: boolean;
		additionalArguments?: string;
	};
	hex?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoreSourceFiles?: boolean;
		aggregateModules?: string;
	};
	html?: {
		resolveDependencies?: string;
	};
	maven?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		projectNameFromDependencyFile?: boolean;
		multiModule?: {
			applyProjectVersion?: boolean;
		};
		maxCacheFolderSize?: number;
		m2RepositoryPath?: number;
		ignoredScopes?: string;
		ignoreSourceFiles?: boolean;
		ignorePomModules?: boolean;
		ignoreMvnTreeErrors?: boolean;
		environmentPath?: number;
		downloadMissingDependencies?: boolean;
		aggregateModules?: boolean;
		additionalArguments?: string;
	};
	npm?: {
		resolveLockFile?: boolean;
		ignoreNpmLsErrors?: boolean;
		accessToken?: string;
		yarnProject?: boolean;
		yarn?: {
			frozenLockfile?: boolean;
		};
		timeoutDependenciesCollectorInSeconds?: number;
		runPreStep?: boolean;
		resolveMainPackageJsonOnly?: boolean;
		resolveGlobalPackages?: boolean;
		resolveDependencies?: boolean;
		resolveAdditionalDependencies?: boolean;
		removeDuplicateDependencies?: boolean;
		projectNameFromDependencyFile?: boolean;
		includeDevDependencies?: boolean;
		ignoreSourceFiles?: boolean;
		ignoreScripts?: boolean;
		ignoreJavaScriptFiles?: boolean;
		ignoreDirectoryPatterns?: string;
		identifyByNameAndVersion?: boolean;
		failOnNpmLsErrors?: string;
	};
	nuget?: {
		runPreStep?: boolean;
		restoreDependencies?: boolean;
		resolvePackagesConfigFiles?: boolean;
		resolveNuspecFiles?: boolean;
		resolveDependencies?: boolean;
		resolveCsProjFiles?: boolean;
		resolveAssetsFiles?: boolean;
		preferredEnvironment?: number;
		packagesDirectory?: number;
		ignoreSourceFiles?: string;
	};
	ocaml?: {
		switchName?: number;
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoredScopes?: string;
		ignoreSourceFiles?: boolean;
		aggregateModules?: string;
	};
	paket?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		ignoredGroups?: number;
		ignoreSourceFiles?: boolean;
		exePath?: string;
	};
	php?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		removeDuplicateDependencies?: boolean;
		includeDevDependencies?: boolean;
		ignoreSourceFiles?: string;
	};
	python?: {
		runPoetryPreStep?: boolean;
		runPipenvPreStep?: boolean;
		resolveSetupPyFiles?: boolean;
		resolvePipEditablePackages?: boolean;
		resolveHierarchyTree?: boolean;
		resolveGlobalPackages?: boolean;
		resolveDependencies?: boolean;
		requirementsFileIncludes?: number;
		pipenvDevDependencies?: boolean;
		pipPath?: string;
		path?: string;
		localPackagePathsToInstall?: number;
		isEmptyEnvironment?: boolean;
		installVirtualenv?: boolean;
		indexUrl?: number;
		includePoetryDevDependencies?: boolean;
		ignoreSourceFiles?: boolean;
		ignorePipInstallErrors?: boolean;
		IgnorePipenvInstallErrors?: string;
	};
	r?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		packageManager?: string;
		ignoreSourceFiles?: boolean;
		cranMirrorUrl?: string;
	};
	ruby?: {
		runBundleInstall?: boolean;
		resolveDependencies?: boolean;
		overwriteGemFile?: boolean;
		installMissingGems?: boolean;
		ignoreSourceFiles?: string;
	};
	sbt?: {
		runPreStep?: boolean;
		resolveDependencies?: boolean;
		includedScopes?: string;
		ignoreSourceFiles?: boolean;
		aggregateModules?: string;
	};
	scm?: {
		user?: number;
		url?: number;
		tag?: number;
		repositoriesFile?: number;
		ppk?: number;
		pass?: number;
		branch?: string;
	};
	serverless?: {
		scanFunctions?: boolean;
		region?: number;
		provider?: string;
		maxFunctions?: number;
		includes?: number;
		excludes?: number;
	};
};


export interface RunAgentOptions {
	/**
	 * WhiteSource Agent Configuration - see documentation here https://whitesource.atlassian.net/wiki/spaces/WD/pages/1544880156/Unified+Agent+Configuration+Parameters
	 *
	 * @type {WhiteSourceAgentConfiguration}
	 * @memberof RunAgentOptions
	 */
	agentConfig: WhiteSourceAgentConfiguration;
	/**
	 * Working directory to scan
	 * If not passed, will run on current directory
	 *
	 * @type {string}
	 * @memberof RunAgentOptions
	 */
	dir?: string;
	/**
	 * Callback to be invoked on each log line during the scan
	 *
	 * @memberof RunAgentOptions
	 */
	onLogLine?: (line: string) => void;
}