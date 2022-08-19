const db = require('../core/dbconn')
const config = require('config')

class Chat{

    _id
    _title
    _users
    _updatedAt
    _lastMessage


    constructor(id, title, users, updatedAt, lastMessage){
        this._id = id
        this._title = title
        this._users = users
        this._updatedAt = updatedAt
        this._lastMessage = lastMessage
    }

    static async create(title, users){
        try{
            updatedAt = new Date.now()
            const res = await db.query(`INSERT INTO chat (title, updated_at) VALUES ('${title}', ${updatedAt})`)
            const insertID = res[0].insertId
            users.forEach(el => {
                await db.query(`INSERT INTO members (chat_id, member_id) VALUES (${insertID}, ${el})`)
            })
        }catch(e){
            return new Error(`MySQL Error: ${e.message}`)
        }   
    }

    async update($fieldsArr){
        //TODO:
        //update method with array of data to update
    }
}

module.exports = Chat