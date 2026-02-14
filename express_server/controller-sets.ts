import core, { Express, Request, Response, json } from 'express';
import { readFile } from 'fs';

function fileHandler(file:string, mime:string, res: Response ) {
	readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log(`Failed reading ${file}`);
			res.sendStatus(404);
		} else {
			res.contentType(mime);
			res.send(data);
		}
		res.end();
	});
}

export function useSets(app: core.Express) {
	app.get('/sets', (req, res) => {
		fileHandler('./data/SetOverviewList.json', 'application/json', res);
	});

	app.get('/sets/:setId/:songId', (req, res) => {
		fileHandler(`./data/${req.params.setId}/${req.params.songId}/detail.json`, 'application/json', res);
	});

	app.get('/sets/:setId/:songId/:trackId', (req, res) => {
		let mime = 'application/octet-stream';
		if (req.params.trackId.endsWith('lrc')) {
			mime = 'application/lrc';
		} else if (req.params.trackId.endsWith('json')) {
			mime = 'application/json';
		}
		console.log(mime);
		fileHandler(`./data/${req.params.setId}/${req.params.songId}/${req.params.trackId}`, mime, res);
	});

	app.get('/lyrics/:name', (req, res) => {
		fileHandler(`./data/${req.params.name}.lrc`, 'application/lrc', res);
	});
}
