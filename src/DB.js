const mysql = require('mysql2/promise')
const config = require('config')
const util = require('util');

class DB{
    //variable to controll count of connections
    static #instances = 0
    static #MAX_INSTANCES = 1
    #host
    #user
    #db
    #pass
    _conn

    constructor(){
        //realization of singleton pattern
        DB.#instances++
        if(DB.#instances <= DB.#MAX_INSTANCES){
            this.#host = config.get('host')
            this.#user = config.get('user')
            this.#db = config.get('db')
            this.#pass = config.get('pass')


        }else{
            throw new Error('Возможно создавать только один экземпляр класса')
        }
        
    }

    async connect(){
        this._conn = await mysql.createConnection({
            host: this.#host,
            user: this.#user,
            database: this.#db,
            password: this.#pass
        })
    }

    async query(queryStr){
        await this.connect()
        const result = await this._conn.query(queryStr)
        await this._conn.end()
        return result
    }
}

module.exports = DB