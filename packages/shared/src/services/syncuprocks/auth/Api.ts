import { Log } from "@shared/services/Logger";
import { ApiResponseBase } from "@shared/services/syncuprocks/Types";
import { LoggedInStatus } from "./Types";

// FUTURE: Handle slide (keeping web server session alive with periodic pings)
export const GetAuthState = async (slide: boolean = false) : Promise<LoggedInStatus | null> =>  {
	Log('verbose', 'Checking login state...', 'GetAuthState()');
	const data = await fetch(`/api/auth/loggedin`, { method: "GET", headers: { "Content-Type": "application/json" }});
	const response: ApiResponseBase<LoggedInStatus> = await data.json();
	Log('verbose', `status=${data.status}`, 'GetAuthState()');
	if (data.status === 401 || !response.data || response.data.isLoggedIn === false || !response.data.userId || !response.data.username) {
		Log('verbose', 'Unauthorized', 'GetAuthState()');
		return null;
	}
	else if (!response.success) {
		Log('error', `unknown failure ${response.errorMessage}`, 'GetAuthState()');
		return null;
	}

	return response.data;
}
