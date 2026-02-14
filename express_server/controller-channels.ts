import core from 'express';

interface JamChannelDetail {
	hostUser: string;
	identifier: string;
	friendlyName: string;
	timestamp: number;
}

interface UserChannels {
	[user:string]:JamChannelDetail[];
}

export const channels:UserChannels = {}

function getChannelList(user:string) {
    let c = channels[user];
    if (!c) {
        c = [];
        channels[user] = c;
    }

    return c;
}

export function useChannels(app: core.Express) {
	app.post('/channel/create/:name', (req, res) => {
		const userChannels = getChannelList(req.params.name);
		const existingChannel = userChannels.find((c) => c.identifier === req.body.identifier);
		if (existingChannel) {
			// TODO: Support friendly name
			//console.log(`Update channel ${req.params.name}:${req.body.identifier}`);
		} else {
			userChannels.push({...req.body, timestamp: Date.now()});
			//console.log(`New channel added ${req.params.name}:${req.body.identifier}`);
		}
		
		res.send({created: 'ok'});
	});
	app.delete('/channel/delete/:name/:identifier', (req, res) => {
		const userChannels = getChannelList(req.params.name);
		const existingChannel = userChannels.findIndex((c) => c.identifier === req.params.identifier);
		if (existingChannel >= 0) {
			//console.log(`Deleting channel ${req.params.name}:${req.params.identifier}`);
			userChannels.splice(existingChannel, 1);
		} else {
			//console.log(`Channel doesn't exist ${req.params.name}:${req.params.identifier}`);
		}
		
		res.send({deleted: 'ok'});
	});
	
	app.get('/channel/', (req, res) => {
		res.send(channels);
	});
}
