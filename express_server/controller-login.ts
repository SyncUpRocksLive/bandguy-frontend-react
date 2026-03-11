import core, { Request, Response, NextFunction } from 'express';

const USERS: string[] = (process.env.USERS || "john,jane,phil,fox,mario").split(",").map((s) => s.trim()).filter((s): s is string => !!s);

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const user = req.signedCookies?.user;

    // 1. Check if the signed cookie exists and hasn't been tampered with
    // 2. Verify the user is still in your allowed USERS list
    if (user && typeof user === 'string' && USERS.includes(user)) {
        // If everything is good, proceed to the next function
		(req as any).currentUser = user;
        return next();
    }

    // Otherwise, block the request
    console.log(`Unauthorized access attempt from cookie: ${user}`);
    res.sendStatus(401);
}

// setup a simple login/cookie
export function useLogin(app: core.Express) {
	app.get('/user/loggedin', (req, res) => {
		const user = req.signedCookies?.user;

		// Check if user exists, is not false (tamper check), and is allowed
		if (user && typeof user === 'string' && USERS.includes(user)) {
			return res.send({ username: user });
		}

		if (user) {
			console.log(`User tampering detected or user '${user}' no longer allowed.`);
		}

		res.sendStatus(401);
	});

	app.post('/user/login', (req, res) => {
		if (req.body.username && req.body.username.length > 0 && USERS.includes(req.body.username)) {
			console.log(`User '${req.body.username}' Logged In`);
			var hour = 3600000;
			res.cookie('user', req.body.username, {
				signed: true,     // This is the "encryption" (signing)
				httpOnly: true,
				sameSite: 'strict',
				maxAge:  14 * 24 * hour, // 10 days
				path: '/'
			});
			res.sendStatus(200);
		}
		else {
			console.log(`Failed login attempt for user '${req.body.username}' - allowed users are: ${USERS.join(", ")}`);
			res.sendStatus(401);
		}
	});

	app.get('/user/logout', (req, res) => {
		res.clearCookie('user', { path: '/' });
		res.redirect(302, '/');
	});
}
