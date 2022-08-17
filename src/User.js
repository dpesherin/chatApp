const db = require('../core/dbconn')
const bcrypt = require('bcryptjs')
const config = require('config')
const passSalt = config.get('passSalt')
const jwt = require('jsonwebtoken')
const jwtSecret = config.get('secret')

class User{
    _id
    _nickname
    _avatar
    _email

    constructor(id, nickname, avatar, email){
        this._id = id
        this._nickname = nickname
        this._avatar = avatar
        this._email = email
    }

    /**
     * Return User object
     * 
     * @param id (int) - user ID 
     */

    static async getUser(id){
        try{
            const res = await db.query(`SELECT * FROM user WHERE id = ${id}`)
            if(res[0][0]){
                return new this(res[0][0].id, res[0][0].nickname, res[0][0].avatar, res[0][0].email)
            }else{
                return {status : "error", error_message: "User wasn't found"}
            }
        }catch(e){
            return {status : "error", error_message: `Server error: ${e.message}`}
        }
        
    }

        /**
     * Return JWT 
     * 
     * @param email (string) - user email
     * @param pass (string) - user password 
     */

    static async login(email, pass){
        try{
            const userFromDb = await db.query(`SELECT * FROM user WHERE email = '${email}'`)
            if(userFromDb[0][0]){
                const isCompare = bcrypt.compareSync(pass, userFromDb[0][0].pass)
                if(isCompare){
                    const payload = {id: userFromDb[0][0].id, nickname: userFromDb[0][0].nickname, avatar: userFromDb[0][0].avatar}
                    return jwt.sign(payload, jwtSecret) 
                }else{
                    return {status : "error", error_message: "Wrong password"}
                }
            }else{
                return {status : "error", error_message: "User wasn't found"}
            }
        }catch(e){
            return {status : "error", error_message: `Server error: ${e.message}`}
        }
    }

    /**
     * Return json 
     * 
     * @param email (string) - user email
     * @param pass (string) - user password 
     */

    static async registration(email, pass){
        try{
            const userFromDb = await db.query(`SELECT * FROM user WHERE email = '${email}'`)
            if(userFromDb[0][0]){
                return {status : "error", error_message: `User with email ${email} already exists`}
            }else{
                const passHash = bcrypt.hashSync(pass, passSalt)
                try{
                    await db.query(`INSERT INTO user (email, pass) VALUES ('${email}', '${passHash}')`)
                    return {status: "succes", message: "User was created"}
                }catch(e){
                    return {status : "error", error_message: `MySQL error: ${e.message}`}
                }
            }
        }catch(e){
            return {status : "error", error_message: `Server error: ${e.message}`}
        }
    }

    //TODO: File class

    /**
     * Return json 
     * 
     * @param file (object) - object File
     */

    async setAvatar(file){
        if(!file.id){
            return {status : "error", error_message: `Error: error with file object`}
        }
        
        try{
            const file = await db.query(`SELECT * FROM files WHERE id = '${file.id}' AND created_by = ${this._id}`)
            if(!file[0][0]){
                return {status : "error", error_message: `Error: No file in DB.`}
            }
            await db.query(`UPDATE user SET avatar = ${file.id} WHERE id = ${this._id}`)
            return {status: "succes", message: "Avatar was changed"}
        }catch (e){
            return {status : "error", error_message: `MySQL error: ${e.message}`}
        }
    }
}

module.exports = User