const express = require('express')
const cors = require('cors')
const http = require('http')
const db = require('./core/dbconn')
const User = require('./src/User')

const app = express()
const server = http.createServer(app)


app.use(cors())

server.listen(8000, async ()=>{
    try{
        const user = await User.getUser(1)
        console.log(user)
        const test = await User.login("test@locald.ru", "Bwe@12041996")
        console.log(test)
    }catch(err){
        console.log(err)
    }
})