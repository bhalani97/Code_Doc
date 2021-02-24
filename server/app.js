const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {converter} = require('./converter');
const info = require('./info');
const PORT = 8000
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use((_, res, next) => {

    res.set({ Tk: '!' });
    next();
});

//For Admin
// app.use('/admin', cors(corsOptions), admin)  
// getFacData()
// listen for requests
app.post('/data',converter)

app.post('/getInfo',info)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


module.exports = app;
