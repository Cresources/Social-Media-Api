import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';

class CommentController {
    static async newComment(req, res) {
	if (!req.body.userId) {
	    res.status(401).send({"error": "userid of this comment must be provided"});
	    return
	}

	if (!req.body.comment) {
	    res.status(401).send({"error": "the content of this comment cannot be null"});
	    return
	}
	if (!req.body.postId) {
	    res.status(401).send({"error": "post id this comment belongs to must beprovided"});
	}
	const uid = req.body.userId
	try {
	    const dbid = new ObjectId(uid);
	    if (await dbClient.getUser({ _id: dbid }) === null) {
		res.status(401).send({"error": "the userid of this comment does not exist"});
		return
	    }
	    const pid = new ObjectId(req.body.postId);
	    if (await dbClient.getPost({ _id: pid }) === null) {
		res.status(401).send({"error": "the id of the post does not exist"})
		return;
	    }
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return;
	}
	const ob = {
	    comment: req.body.comment,
	    userId: req.body.userId,
	    postId: req.body.postId
	}
	const { ops } = await dbClient.createComment(ob);
	console.log(ops);
	res.send({
	    id: ops[0]._id
	});
    }

    static async allComments(req, res) {
	try {
	    const postId = new ObjectId(req.query.id);
	    if (await dbClient.getPost({_id: postId}) === null) {
		res.status(401).send('no post exists for this post id');
		return;
	    }
	    const comments = await dbClient.getComments({postId: req.query.id});
	    const allcomments = [];
	    await comments.forEach((p) => {
		const pp = p
		pp.commentId = p._id,
		delete pp._id
		allcomments.push(pp)
	    });
	    res.send(allcomments);
	} catch (e) {
	    console.log(e)
	    res.status(401).send({"error": "invalid id"});
	    return;
	}
    }

    static async editComment(req, res) {
	const new_comment_ob = req.body;
	let coId = req.body.commentId;
	try {
	    new_comment_ob.postId = new ObjectId(new_comment_ob.postId);
	    coId = new ObjectId(coId);
	} catch (e) {
	    console.log(e);
	    res.status(401).send({"error": "invalid id"});
	    return
	}
	const valp = await dbClient.getPost({_id: new_comment_ob.postId});
	if (valp === null) {
	    res.status(401).send({"error": "post id does not exit"});
	    return
	}
	const coval = await dbClient.getComment({_id: coId});
	if (!req.body.comment) {
	    res.status(401).send({"error": "new comment must be provided"})
	}
	if (coval === null) {
	    res.status(401).send({"error": "comment id does not exist"});
	    return
	}
	new_comment_ob.commentId = coId;
	const val = await dbClient.editComment(new_comment_ob);
	console.log(val);
	res.send({"sucess": "comment edited successfully"});
    }
    
    static async getComment(req, res) {
	try {
	    const commentId = ObjectId(req.query['id']);
	    const val = await dbClient.getComment({_id: commentId});
	    if (val === null) {
		res.status(401).send({"error": "comment id does not exit"});
		return
	    }
	    console.log(val);
	    res.send({
		commentId: val._id,
		comment: val.comment,
		userId: val.userId,
		postId: val.postId
	    })
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return
	}
    }

    static async delComment(req, res) {
	try {
	    const postId = ObjectId(req.body.postId);
	    const valp = await dbClient.getPost({_id: postId});
	    if (valp === null) {
		res.status(401).send({"error": "post id does not exit"});
		return
	    }
	    const coId = ObjectId(req.body.commentId);
	    if (await dbClient.getComment({_id: coId}) === null) {
		res.status(401).send({"error": "comment id does not exist"});
	    }
	    const val = await dbClient.delComment({_id: coId});
	    res.send({"success": "comment deleted successfully"});
	} catch (e) {
	    res.status(401).send({"error": "invalid id"});
	    return
	}
    }
}

export default CommentController;
