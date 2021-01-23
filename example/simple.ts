import runAgent from "../lib";

runAgent({
	agentConfig: {
		apiKey: "my key",
		includes: ["**/*.cpp"],
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