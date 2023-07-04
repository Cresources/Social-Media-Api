// integrate a third-party api to populate the database and showcase functionality

import dbClient from './utils/db.js';
import axios from 'axios';

let i = 0;
const repeatFct = async () => {
    await setTimeout(() => {
	i += 1;
	if (i >= 5) {
	    console.log('done');
	}
	else if(!dbClient.isAlive()) {
	    repeatFct()
	}
	else {
	    axios.get('https://random-data-api.com/api/v2/users?size=15')
		.then((results) => {
		    const data = results['data'];
		    data.forEach(async (d) => {
			const ob = { email: d.email, password: d.password}
			const { ops } = await dbClient.insertUser(ob);
			console.log({ id: ops[0]._id, email: ops[0].email});
		    })
		});
	}
    }, 1000);
}
repeatFct();
