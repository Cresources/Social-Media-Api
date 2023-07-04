import chai from 'chai';
import chaiHttp from 'chai-http';

import { MongoClient } from 'mongodb';

chai.use(chaiHttp);

describe('GET /users', function () {
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

	    await testClientDb.collection('users').deleteMany({})

	    done();
	});
    });

    afterEach(() => {
    });

    it('GET /users creates a new user in DB (when pass correct parameters)', (done) => {
	const userParam = {
	    email: `${fctRandomString()}@me.com`,
	    password: `${fctRandomString()}`
	}
	chai.request('http://localhost:5000')
	    .post('/users')
	    .send(userParam)
	    .end((err, res) => {
		chai.expect(err).to.be.null;
		chai.expect(res).to.have.status(201);
		const resUserId = res.body.id
		const resUserEmail = res.body.email
		chai.expect(resUserEmail).to.equal(userParam.email);

		testClientDb.collection('users')
		    .find({})
		    .toArray((err, docs) => {
			chai.expect(err).to.be.null;
			chai.expect(docs.length).to.equal(1);
			chai.expect(docs[0]._id.toString()).to.equal(resUserId);
			chai.expect(docs[0].email).to.equal(resUserEmail);
			done();
		    })
	    });
    }).timeout(30000);
});
