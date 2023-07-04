import app from './routes/index.js';
import './integrate.js';

const port = 5000
const host = '0.0.0.0'

app.listen(port, host, () => console.log('this app is listening on port 5000'));

export default app;
