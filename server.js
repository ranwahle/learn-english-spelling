import express from 'express';
import getArguments from 'get-arguments-lib';

const args = getArguments(process.argv);
const portArg = args.port;

const port = process.env.PORT || portArg;

const app = express();

app.use('/node_modules', express.static('node_modules'))

app.use('/', express.static('client'));
app.use('/spell-backoffice', express.static('client'));

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
