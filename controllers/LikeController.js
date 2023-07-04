import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';

class LikeController {
    static async like(req, res) {
	
	if (!req.body.postId) {
	    res.status(401).send({"error": "post id this comment belongs to must beprovided"});
	}
	const uid = req.body.postId
	try {
	    const dbid = new ObjectId(uid);
	    if (await dbClient.getPost({ _id: dbid }) === null) {
		res.status(401).send({"error": "this post does not exist"});
		return
	    }
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return;
	}
	const ob = {
	    postId: req.body.postId
	}
	const { ops } = await dbClient.like(ob);
	console.log(ops);
	res.send({
	    id: ops[0]._id
	});
    }

    static async unlike(req, res) {
	try {
	    const postId = ObjectId(req.body.postId);
	    const valp = await dbClient.getPost({_id: postId});
	    if (valp === null) {
		res.status(401).send({"error": "post id does not exit"});
		return
	    }
	    const likeId = ObjectId(req.body.likeId);
	    if (await dbClient.getLike({_id: likeId}) === null) {
		res.status(401).send({"error": "this like object does not exist"});
		return;
	    }
	    const val = await dbClient.unlike({_id: likeId});
	    res.send({"success": "unkliked successfully"});
	} catch (e) {
	    console.log(e);
	    res.status(401).send({"error": "invalid id"});
	    return
	}
    }
}

export default LikeController;
