import { Messages } from "@/Support/Services/MessageQueue";
import { IMessageBusHandler, RemoveMessageHandler, SubscribeMessageHandler } from "@/Support/Stores/MessageBus";
import { dispatch, getStore } from "@/Support/Stores/PrimaryStore";
import { ActionType, ConnectedUser } from "@/Support/Stores/Types";
import { Log, LogError, LogInfo } from "@/Support/Utilities/Logger";
import { Client, ConnectState } from "@/Types/Client";
import { MessageDataType } from "@/Types/Message";
import { MessageBusActionType, MessageBusEvent } from "@/Types/MessageBus";
import { createClientSignallingChannel, deleteClientSignallingChannel } from "./SignalChannelHandler";
import { createClientRealtimChannel, deleteClientRealtimChannel } from "./RealtimeHandler";
import { JProtocolAction, JProtocolMessage, RProtocolAction, RProtocolMessageType } from "@/Types/JProtocol/Types";

export interface IHostConnectionFlow {
	Listen:() => void;
	Stop:() => void;
}

export class ServerFlow implements IHostConnectionFlow, IMessageBusHandler {
	_listening: boolean;
	_clients: Client[];
	_sequence: number = 0;

	constructor() {
		this._listening = false;
		this._clients = [];
	}

	private async createClient(name: string, offer: RTCSessionDescription) {
		LogInfo(`HOST: Creating new peer client ${name}`);
		const client: Client = {
			state: ConnectState.OFFER,
			name: name,
			peerConnection: new RTCPeerConnection({'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}),
		};
		this._clients.push(client);

		//client.peerConnection!.oniceconnectionstatechange = () => { LogInfo(`oniceconnectionstatechange ${client.peerConnection!.iceConnectionState}`); }
		//client.peerConnection!.ontrack = (e) => { LogInfo(`ontrack ${JSON.stringify(e)}`); }
		//client.peerConnection!.ondatachannel = (e) => { LogInfo(`ondatachannel channelId: ${e.channel.label}:${e.channel.id} ${e.channel.binaryType}} ${e.channel.negotiated}`); }
		//client.peerConnection!.onicecandidateerror = (e) => { LogInfo(`onicecandidateerror ${JSON.stringify(e)}`); }
		//client.peerConnection!.onicegatheringstatechange = () => { LogInfo(`onicegatheringstatechange ${client.peerConnection!.iceGatheringState}`); }
		//client.peerConnection!.onnegotiationneeded = async () => { LogInfo(`onnegotiationneeded ${client.peerConnection!.iceGatheringState}`); };
		//client.peerConnection!.onsignalingstatechange = () => { LogInfo(`onsignalingstatechange ${client.peerConnection!.signalingState}`); }
		client.peerConnection!.onicecandidate = (e) => {
			// TODO: Verify state and instance...
			if (e.candidate) {
				Log('verbose', `HOST.onicecandidate: ${JSON.stringify(e.candidate)}`);
				// TODO: Do we need this... probably no
				const _store = getStore();
				if (!_store.user) {
					LogInfo('HOST.onicecandidate: No user. ignoring messages');
					return;
				}

				Log('verbose', `Forwarding onicecandidate ${_store.user!.username} -> ${client.name}`);
				Messages.sendMessage(client.name, _store.user!.username, {
					type: MessageDataType.RTCIceCandidate,
					value: e.candidate!
				}) // TODO error handling
				.catch((e) => LogError(JSON.stringify(e)));
			}
		};

		createClientRealtimChannel(client);
		createClientSignallingChannel(client);

		client.peerConnection!.setRemoteDescription(offer);

		client.state = ConnectState.ANSWER;
		const answer = await client.peerConnection!.createAnswer();
		// TODO: Check state
		if (!client.peerConnection || !this._listening) {
			return;
		}

		await client.peerConnection!.setLocalDescription(answer);
		// TODO: Check state
		const _store = getStore();
		if (!client.peerConnection || !_store.user || !this._listening) {
			return;
		}

		LogInfo('HOST: Sending Answer');
		Messages.sendMessage(name, _store.user.username, {
			type: MessageDataType.RTCSessionDescription,
			value: {
				sdp: answer.sdp!,
				type: answer.type,
				toJSON: function () { return {sdp: this.sdp, type: this.type } }
			}
		})
		.then(() => {
			client.state = ConnectState.PEERING;
		}) // TODO: Error handler
		.catch((e) => LogError(JSON.stringify(e)));
	}

	messageBusEvent(event: MessageBusEvent): void {
		//LogInfo(`HOST: Processing message bus message... ${event.data.type}`);

		switch(event.data.type) {
			case MessageBusActionType.MESSAGE: {
				event.data.message.forEach((m) => {
					const existingClient = this._clients.find((x) => x.name === m.from);

					if (m.messageData.type === MessageDataType.RTCSessionDescription) {
						LogInfo(`${m.from} -> ${m.to} Message Type: ${m.messageData.value.type}`);

						if (m.messageData.value.type === 'offer') {
							if (!existingClient) {
								LogInfo(`Got offer from new client ${m.from}`);
								this.createClient(m.from, m.messageData.value);
							} else {
								LogInfo(`Got offer from known client ${m.from}??? Ignroing.`);
							}
						}
					} else if (existingClient && m.messageData.type === MessageDataType.RTCIceCandidate) {
						LogInfo(`${m.from} -> ${m.to} RTCIceCandidate`);
						existingClient.peerConnection!.addIceCandidate(m.messageData.value);
					}
				});

				break;
			}
			case MessageBusActionType.PEER_CLOSED: {
				const client = event.data.client;
				// Cleanup our local clients list
				this._clients = this._clients.reduce((acc: Client[], c) => {
					if (c !== client) {
						acc.push(c);
					} else {
						if (c.peerConnection) {
							c.peerConnection.close();
							deleteClientRealtimChannel(c);
							deleteClientSignallingChannel(c);
							c.peerConnection = undefined;
						}
					}
					return acc;
				}, []);

				// Update store
				const store = getStore();
				if (store.connectedUsers.find((x) => x.username === client.name)) {
					const prunedUsers = store.connectedUsers.reduce((acc:ConnectedUser[], u) => {
						if (u.client !== client) acc.push(u);
						return acc;
					}, []);

					dispatch({type: ActionType.UPDATE, update: {connectedUsers: prunedUsers}});
				}
				break;
			}
			case MessageBusActionType.KICKOUT: {
				const userName = event.data.username;
				// TODO: Lookup instanceid
				const existingClient = this._clients.find((x) => x.name === userName);
				if (existingClient) {
					// TODO: Cleanup connections
					existingClient.peerConnection!.close();
				}

				break;
			}
			case MessageBusActionType.STATE_UPDATE: {
				const state = event.data.state;
				this._clients.forEach((c) => {
					if (c.peerChannelSignalling) {
						const message: JProtocolMessage = {
							data: { version: 1, type: JProtocolAction.StateUpdatePush, state: state }
						};
						c.peerChannelSignalling.send(JSON.stringify(message));
					}
				});
				break;
			}
			case MessageBusActionType.PLAY_CLOCK_TICK: {
				// TODO: Look into using binary/ArrayBuffer payload for speed/size...
				const message: RProtocolMessageType = {
					ver: 1, typ: RProtocolAction.HostPlayClockTick, tick: event.data.tick, seq: this._sequence
				};
				//console.log(`Sending tick: ${message.tick}`);
				const msg = JSON.stringify(message);
				this._clients.forEach((c) => {
					if (c.peerChannelRealtime) {
						c.peerChannelRealtime.send(msg);
					}
				});

				// TODO: Handle wrap around
				this._sequence += 1;
				break;
			}
			default:
				break;
		}
	}

	Listen(): void {
		if (this._listening) {
			return;
		}

		Log('info', `HOST: Listen for band mates...`);
		this._listening = true;
		SubscribeMessageHandler(this);
	}

	Stop(): void {
		if (!this._listening && this._clients.length === 0) {
			return;
		}

		Log('verbose', `HOST: Cancelling/Cleaning up`);
		this._listening = false;
		RemoveMessageHandler(this);

		// disconnect clients & cleanup
		this._clients.forEach((c) => {
			LogInfo(`HOST: Disconnecting peer ${c.name}`);
			if (c.peerConnection) {
				c.peerConnection.close();
				deleteClientRealtimChannel(c);
				deleteClientSignallingChannel(c);
				c.peerConnection = undefined;
			}
		});

		this._clients = [];
		dispatch({type: ActionType.UPDATE, update: {connectedUsers: []}});
	}
}
