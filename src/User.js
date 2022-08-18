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
     * @param {number} id user ID 
     */

    static async getUser(id){
        try{
            const res = await db.query(`SELECT * FROM user WHERE id = ${id}`)
            if(res[0][0]){
                return new this(res[0][0].id, res[0][0].nickname, res[0][0].avatar, res[0][0].email)
            }else{
                return new Error("User wasn't found")
            }
        }catch(e){
            return new Error(`Server error: ${e.message}`)
        }
        
    }

        /**
     * Return JWT 
     * 
     * @param {string} email user email
     * @param {string} pass user password 
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
                    return new Error("Wrong password")
                }
            }else{
                return new Error("User wasn't found")
            }
        }catch(e){
            return new Error(`Server error: ${e.message}`)
        }
    }

    /**
     * Return json 
     * 
     * @param {string} email user email
     * @param {string} pass user password 
     */

    static async registration(email, pass){
        try{
            const userFromDb = await db.query(`SELECT * FROM user WHERE email = '${email}'`)
            if(userFromDb[0][0]){
                return new Error(`User with email ${email} already exists`)
            }else{
                const passHash = bcrypt.hashSync(pass, passSalt)
                try{
                    await db.query(`INSERT INTO user (email, pass) VALUES ('${email}', '${passHash}')`)
                    return {status: "succes", message: "User was created"}
                }catch(e){
                    return new Error(`MySQL error: ${e.message}`)
                }
            }
        }catch(e){
            return new Error(`Server error: ${e.message}`)
        }
    }

    //TODO: File class

    /**
     * Return json 
     * 
     * @param {File} file object File class
     */

    async setAvatar(file){
        try{
            await db.query(`UPDATE user SET avatar = ${file.id} WHERE id = ${this._id}`)
            return {status: "succes", message: "Avatar was changed"}
        }catch (e){
            return new Error(`MySQL error: ${e.message}`)
        }
    }
}

module.exports = User