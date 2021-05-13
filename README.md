# WhiteSource Unified Agent Wrapper
A wrapper module around WhiteSource Unified Agent https://whitesource.atlassian.net/wiki/spaces/WD/pages/804814917/Unified+Agent+Overview \
This module was create to expose the WhiteSource Unified Agent for programmatic TypeScript/Javascript usage (in nodejs processes).

## Important notice
This module is developed and maintained by [mceSystems](https://github.com/mceSystems). It is __not__ an official WhiteSource module. \
If you find nay issues with this module, use the [Issues](https://github.com/mceSystems/whitesource-unified-agent-wrapper/issues) page of th repo.\ 

## Installation
``` sh
npm i @mcesystems/whitesource-unified-agent-wrapper
```

## Usage
``` ts
import runAgent, { RunAgentOptions } from "@mcesystems/whitesource-unified-agent-wrapper";

const options: RunAgentOptions = {
	...
};
...
await runAgent(options);
```

#### runAgent(options: RunAgentOptions) => Promise<void>
- `options` - settings for running the Unified Agent (see the `RunAgentOptions` documentation below)

Returns a `Promise<void>` that resolves if the Unified Agent process completed with exit code 0, and rejects otherwise

#### RunAgentOptions
|Key|Type|Optional|Description|
|---|----|--------|-----------|
|agentConfig|`WhiteSourceAgentConfiguration`|No|A TypeScript representation of the WhiteSource Agent Configuration - see documentation [here](https://whitesource.atlassian.net/wiki/spaces/WD/pages/1544880156/Unified+Agent+Configuration+Parameters)|
|dirs|`string[]`|Yes|Directories to scan. If not passed, will run on current directory|
|agentVersion|`string`|Yes|Version of the agent to run. Will download the file if not available locally. Defaults to `"latest"` but keep in mind that this will always trigger a download, regardless to the locally available files|
|onLogLine|`(line: string) => void`|Yes|Callback to be invoked on each log line during the scan|



#### WhiteSourceAgentConfiguration
As mentioned above, this is an interface representing the [Unified Agent Configuration Parameters](https://whitesource.atlassian.net/wiki/spaces/WD/pages/1544880156/Unified+Agent+Configuration+Parameters).\
Each configuration parameter is represented by a field in this interface, and period (`.`) delimited configuration keys are represented by sub hierarchy deeper levels of the interface. \
For example, if the Unified Agent Configuration Parameters doc states the `docker.pull.maxImages ` configuration parameter, the corresponding object representation is
``` ts
const agentOptions: WhiteSourceAgentConfiguration = {
	...
	docker: {
		pull: {
			maxImages : 10,
		},
	},
	...
}
```

##### A word on this interface
It was generated automatically, so some of the types may seem a bit too generic.\
We have done some work on making some parameters more accurate (like turning the type of `log.files.level` from a simple `string` to the more explicit `"trace" | "debug" | "info" | "warn" | "error" | "off"` union), and making sure optional/non-optional parameters are delcared as they should.\
That said, there is more work on making this interface more accurate and descriptive, and any help doing this, in the form of pull-request will be much appreciated.


## License
[MIT](./LICENSE)
