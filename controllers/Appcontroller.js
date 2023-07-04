// controller to return the status of the redis and db clients
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class Appcontroller {

    static status(req, res) {
	res.send({
	    "db": dbClient.isAlive(),
	    "redis": redisClient.isAlive()
	})
    }
}

export default Appcontroller;
