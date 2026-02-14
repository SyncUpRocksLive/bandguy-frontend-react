import core from 'express';

// setup a simple login/cookie
export function useLogin(app: core.Express) {
	app.get('/user/loggedin', (req, res) => {
		const cookies = req.cookies;
		if (cookies && 'user' in cookies) {
			res.send({ username: cookies['user'] });
			return;
		}

		res.sendStatus(401);
	});

	app.post('/user/login', (req, res) => {
		if (req.body.username && req.body.username.length > 0) {
			console.log('User Logged In')
			var hour = 3600000;
			res.cookie('user', req.body.username, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge:  14 * 24 * hour // 10 days
			});
			res.sendStatus(200);
		}
		else {
			res.sendStatus(401);
		}
	});

	app.get('/user/logout', (req, res) => {
		res.clearCookie('user');
		res.redirect(302, '/');
	});
}
