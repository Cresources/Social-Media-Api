import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
	this.host = '127.0.0.1';
	this.port = '27017';
	this.db = 'media';  
	this.alive = false;
	if (process.env.DB_HOST) this.host = process.env.DB_HOST;
	if (process.env.DB_PORT) this.port = process.env.DB_PORT;
	if (process.env.DB_DATABASE) this.db = process.env.DB_DATABASE;
	this.client = new MongoClient(`mongodb://${this.host}:${this.port}/${this.db}`, {
	    useUnifiedTopology: true,
	});

	this.client.connect(() => {
	    console.log('connected');
	    this.alive = true;
	})
    }

    isAlive() {
	return this.alive;
    }

    async nbUsers() {
	const db = this.client.db('media');
	return db.collection('users').countDocuments();
    }

    async nbFiles() {
	const db = this.client.db('media');
	return db.collection('files').countDocuments();
    }

    async insertUser(object) {
	const db = this.client.db('media');
	return db.collection('users').insertOne(object);
    }

    // db operations for posts
    
    async insertPost(object) {
	const db = this.client.db('media');
	return db.collection('posts').insertOne(object);
    }

    async getPosts() {
	const db = this.client.db('media');
	return db.collection('posts').find({});
    }
    
    async getPost(ob) {
	const db = this.client.db('media');
	return db.collection('posts').findOne(ob);
    }

    async editPost(ob) {
	const db = this.client.db('media');
	return db.collection('posts').updateOne(
	    {_id: ob.postId},
	    {$set: {"content": ob.content}}
	);
    }

    async delPost(ob) {
	const db = this.client.db('media');
	return db.collection('posts').deleteOne(ob);
    }

    // db operations for comments

    async createComment(object) {
	const db = this.client.db('media');
	return db.collection('comments').insertOne(object);
    }

    async getComments(ob) {
	const db = this.client.db('media');
	return db.collection('comments').find(ob);
    }

    async getComment(ob) {
	const db = this.client.db('media');
	return db.collection('comments').findOne(ob);
    }

    async editComment(ob) {
	const db = this.client.db('media');
	return db.collection('comments').updateOne(
	    {_id: ob.commentId},
	    {$set: {"comment": ob.comment}}
	)
    }

    async delComment(ob) {
	const db = this.client.db('media');
	return db.collection('comments').deleteOne(ob);
    }

    // operations on liking a post
    async like(object) {
	const db = this.client.db('media');
	return db.collection('likes').insertOne(object);
    }

    async getLike(ob) {
	const db = this.client.db('media');
	return db.collection('likes').findOne(ob);
    }

    async unlike(ob) {
	const db = this.client.db('media');
	return db.collection('likes').deleteOne(ob);
    }
    
    async findUser(object) {
	const db = this.client.db('media');
	return db.collection('users').countDocuments(object);
    }

    async getUser(object) {
	const db = this.client.db('media');
	return db.collection('users').findOne(object);
    }

    async delUser(object) {
	const db = this.client.db('media');
	return db.collection('users').deleteOne(object);
    }
}

const dbClient = new DBClient();
export default dbClient;
