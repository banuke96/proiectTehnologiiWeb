const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3000;

const router = require('./routes/routes');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cors({origin: true, credentials: true}));
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
})
