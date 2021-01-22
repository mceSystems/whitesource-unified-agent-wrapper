import runAgent from "../lib";

runAgent({
	agentConfig: {
		apiKey: "my key",
		case: {
			sensitive: {
				glob: "**/*.js",
			}
		},
		npm: {
			accessToken: "my access token",

		}
	}
})