const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const converter = require('./converter')
const PORT = 8000
const app = express();
app.use(bodyParser.json());
app.use((_, res, next) => {

    res.set({ Tk: '!' });
    next();
});

//For Admin
// app.use('/admin', cors(corsOptions), admin)  
// getFacData()
// listen for requests
app.use(cors())
app.post('/data',converter)



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


module.exports = app;
