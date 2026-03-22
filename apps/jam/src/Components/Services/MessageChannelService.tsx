import { getStore } from '@/Support/Stores/PrimaryStore';
import { useQuery } from '@tanstack/react-query';
import { LogError, LogInfo } from '@/Support/Utilities/Logger';
import { Messages } from '@/Support/Services/MessageQueue';
import { PeerOperationMode } from "@/Support/Stores/Types";
import { MessageBusActionType } from '@/Types/MessageBus';
import { BroadcastMessage } from '@/Support/Stores/MessageBus';

const MessageChannelService = () => {
	useQuery({
		queryKey: ['my.messages'],
		queryFn: async () => {
			const store = getStore();
			if (!store || !store.user || store.peerMode === PeerOperationMode.Solo) {
				LogError('MessageChannelService: No store|user|invalid peer mode');
				return;
			}

			const response = await Messages.getMessages();
			if (response.messages.length > 0) {
				LogInfo(`MessageChannelService: Rx'd ${response.messages.length} new messages`);
				BroadcastMessage({data: {type: MessageBusActionType.MESSAGE, message: response.messages}})
			}
			return response;
		},
		refetchInterval: 1000,
		staleTime: 0,
		// TODO ??? cacheTime: 0,
		retry: 0,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		enabled: true,
		refetchIntervalInBackground: true,
	});

	return (
		<></>
	)
}

export default MessageChannelService;
