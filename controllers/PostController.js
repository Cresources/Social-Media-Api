import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';

class PostController {
    static async newPost(req, res) {
	if (!req.body.userId) {
	    res.status(401).send({"error": "userid of this post must be provided"});
	    return
	}

	if (!req.body.content) {
	    res.status(401).send({"error": "the content of this post cannot be null"});
	    return
	}
	const uid = req.body.userId
	try {
	    const dbid = new ObjectId(uid);
	    if (await dbClient.getUser({ _id: dbid }) === null) {
		res.status(401).send({"error": "the id of this post does not exist"});
		return
	    }
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return;
	}
	const ob = {
	    content: req.body.content,
	    userId: req.body.userId,
	}
	const { ops } = await dbClient.insertPost(ob);
	console.log(ops);
	res.send({
	    id: ops[0]._id
	});
    }

    static async allPosts(req, res) {
	const posts = await dbClient.getPosts();
	const allposts = [];
	await posts.forEach((p) => {
	    const pp = p
	    pp.postId = p._id,
	    delete pp._id
	    allposts.push(pp)
	});
	res.send(allposts);
    }

    static async editPost(req, res) {
	const new_post_ob = req.body;
	try {
	    new_post_ob.postId = new ObjectId(new_post_ob.postId);
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return
	}
	const valp = await dbClient.getPost({_id: new_post_ob.postId});
	if (valp === null) {
	    res.status(401).send({"error": "post id does not exit"});
	    return
	}

	const val = await dbClient.editPost(new_post_ob);
	res.send({"sucess": "updated successfully"});
    }
    
    static async getPost(req, res) {
	try {
	    const postId = ObjectId(req.query['id']);
	    const val = await dbClient.getPost({_id: postId});
	    if (val === null) {
		res.status(401).send({"error": "post id does not exit"});
		return
	    }
	    console.log(val);
	    res.send({
		postId: val._id,
		content: val.content,
		userId: val.userId,
	    })
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return
	}
    }

    static async delPost(req, res) {
	try {
	    const postId = ObjectId(req.query.id);
	    const valp = await dbClient.getPost({_id: postId});
	    if (valp === null) {
		res.status(401).send({"error": "post id does not exit"});
		return
	    }
	    const val = await dbClient.delPost({_id: postId});
	    res.send({"success": "post deleted successfully"});
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return
	}
    }
}

export default PostController;
