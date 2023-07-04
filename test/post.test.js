import chai from 'chai';
import chaiHttp from 'chai-http';

import { MongoClient } from 'mongodb';

chai.use(chaiHttp);

describe('POST /newPost', function () {
    this.timeout(20000);
    let testClientDb = null;
    const fctRandomString = () => {
	return Math.random().toString(36).substring(2, 15);
    }

    beforeEach((done) => {
	const dbInfo = {
	    host: process.env.DB_HOST || 'localhost',
	    port: process.env.DB_PORT || '27017',
	    database: process.env.DB_DATABASE || 'media'
	};
	const client = new MongoClient(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, { useUnifiedTopology: true })

	client.connect(async () => {
	    testClientDb = client.db(dbInfo.database);

	    await testClientDb.collection('users').deleteMany({});
	    await testClientDb.collection('posts').deleteMany({});
	    done();
	})
    });

    afterEach(() => {
    });

    it('POST /newPost creates a post in DB for created user (when pass correct parameters)', (done) => {
	const userParam = {
	    email: `${fctRandomString()}@me.com`,
	    password: `${fctRandomString()}`
	}
	chai.request('http://localhost:5000')
	    .post('/users')
	    .send(userParam)
	    .end((err, res) => {
		chai.expect(err).to.be.null;
		const resUserId = res.body.id
		const resUserEmail = res.body.email
		const postParam = {
		    userId: resUserId,
		    content: "I enjoy chocolates",
		}
		chai.request('http://localhost:5000')
		    .post('/newPost')
		    .send(postParam)
		    .end((err, res) => {
			chai.expect(err).to.be.null;
			chai.expect(res).to.have.status(200);
			testClientDb.collection('posts')
			    .find({})
			    .toArray((err, docs) => {
				chai.expect(err).to.be.null;
				const pid = res.body.id;
				chai.expect(docs.length).to.equal(1);
				chai.expect(docs[0]._id.toString()).to.equal(pid);
				done();
			    })
		    });
	    });
    });
})
