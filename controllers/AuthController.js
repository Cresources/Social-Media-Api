import crypto from 'crypto';
import { v4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
/* global atob */

class AuthController {
    static async getConnect(req, res) {
	if (!req.body.email) {
	    res.status(400).send(
		{ error: 'Missing email' },
	    );
	}
	else if (!req.body.password) res.status(400).send({ error: 'Missing password'});
	const email = req.body.email;
	const hash = crypto.createHash('sha1');
	const pass = hash.update(req.body.password).digest('hex');
	if (await dbClient.findUser({ email, password: pass }) === 0) {
	    res.status(401).send({ error: 'Unauthorized' });
	} else {
	    const token = v4();
	    const thisUsr = await dbClient.getUser({ email, password: pass });
	    const key = `auth_${token}`;
	    await redisClient.set(key, thisUsr._id.toHexString(), 60 * 60 * 24);
	    res.send({
		token,
	    });
	}
    }

    static async getDisconnect(req, res) {
	const token = req.headers['x-token'];
	const key = `auth_${token}`;
	const getUserId = await redisClient.get(key);
	if (getUserId === null) {
	    res.status(401).send({
		error: 'Unauthorized',
	    });
	} else {
	    await redisClient.del(key);
	    res.status(204).send();
	}
    }
}

export default AuthController;
