import core from 'express';

interface UserMessageQueue {
	[user:string]:any[];
}

export const message_queue: UserMessageQueue = {}

function getMessageQueue(user:string) {
    let q = message_queue[user];
    if (!q) {
        q = [];
        message_queue[user] = q;
    }

    return q;
}

export function useMessages(app: core.Express) {
	app.post('/message/read', (req, res) => {
		const name = (req as any).currentUser
		const response = {
			messages: getMessageQueue(name),
			date: 'hi!'
		}
		message_queue[name] = []
		res.send(response);
	});

	app.post('/message/send/:to', (req, res) => {
		const q = getMessageQueue(req.params.to);
		q.push(req.body);
		res.send({});
	});
}
