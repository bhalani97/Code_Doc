import React from 'react'

const  acorn =  require('acorn')
const fs = require('fs-react')

const Converter = (props) =>{
    const appPath = "D:/node/note";
    const data = acorn.parse(fs.readFile(appPath + "/app.js").toString());

    return (
        <div>
        <p>Divyesh</p>
        </div>
    )
}

export default Converter
