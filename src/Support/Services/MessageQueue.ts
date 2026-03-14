import { Message, MessageData } from '@/Types/Message';
import { getUnixTime } from 'date-fns'

export interface MessageResponse {
	messages: Message[];
}

export class Messages {
	static async getMessages() {
		const data = await fetch(`/api/message/read`, { method: "POST", headers: { "Content-Type": "application/json" }});
		const json: MessageResponse = await data.json()
		return json;
	}

	static async sendMessage(to:string, from:string, data: MessageData) {
		const msg: Message = {
			to,
			from,
			sentUtc: getUnixTime(new Date()),
			messageData: data
		};
		await fetch(`/api/message/send/${to}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(msg)});
	}
}
