import runAgent from "../lib";

(async () => {
	// prepare stuff
	await runAgent({
		
		agentConfig: {
			apiKey: "my key",
			includes: ["**/*.cpp"],
			case: {
				sensitive: {
					glob: false,
				}
			},
			npm: {
				accessToken: "my access token",
	
			}
		}
	});
	// do other stuff
})();
