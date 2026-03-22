import { Outlet } from 'react-router-dom';
import { dispatch, pickStore } from '@/Support/Stores/PrimaryStore';
import TopNavBar from '@/Components/Header/TopNavBar';
import LoginForm from '@/Components/Login/Login';
import { ActionType, PeerOperationMode } from '@/Support/Stores/Types';
import { Log, LogVerbose } from '@/Support/Utilities/Logger';
import BandLeaderService from '@/Components/Services/Host/BandLeader';
import MessageChannelService from '@/Components/Services/MessageChannelService';
import { useQuery } from '@tanstack/react-query';

const Layout = () => {
	const { user, peerMode } = pickStore<'user'|'peerMode'>();
	LogVerbose('Render Layout');

	const { isLoading } = useQuery(['login.state'], async () => {
		Log('verbose', 'Checking login state...');
		const data = await fetch(`/api/user/auth/loggedin`, { method: "GET", headers: { "Content-Type": "application/json" }});
		Log('verbose', `Checking login state... ${data}`);
		if (data.status !== 200) {
			return {};
		}
		const json = await data.json();
		dispatch({type: ActionType.UPDATE, update: { user: { username: json.username, displayName: json.username } }});
		return json;
	},
	{
		staleTime: Infinity,
		refetchInterval: 0,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		enabled: !user
	});

	if (isLoading) {
		return <></>
	}

	return (
		<div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'clip'}}>
			<TopNavBar/>
			{user && peerMode === PeerOperationMode.Host && (<BandLeaderService/>)}
			{user && peerMode !== PeerOperationMode.Solo && (<MessageChannelService/>)}
			
			{!user && <LoginForm />}

			{user && (<Outlet />)}
		</div>
	)
}

export default Layout
