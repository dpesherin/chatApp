const db = require('../core/dbconn')
const config = require('config')
const root = config.get('root')

class File{
    _id
    _type
    _path
    _originalName
    _createdBy

    constructor(id, type, path, originalName, createdBy){
        this._id = id
        this._type = type
        this._path = path
        this._originalName = originalName
        this._createdBy = createdBy
    }

    /**
     * 
     * @param {object} file Object file from form
     * @param {int} userID User ID 
     * 
     */

    static async saveFile(file, userID){

        let path
        let type

        switch(file.mimetype){
            case "text":
                path = '/uploads/docs'
                type = "file"
            break
            case "image":
                path = '/uploads/img'
                type = "img"
            break
            case "audio":
                path = '/uploads/audio'
                type = "audio"
            break
            case "video":
                path = '/uploads/video'
                type = "video"
            break
            default:
                return {status: "error", error_msg: "Unsupported file type"}
        }
            tempName = `${new Date.now()}_${file.name}`
            const savePath = `${root}${path}${tempName}`
            file.mv(savePath)
            try{
                const res = await db.query(`INSERT INTO files (type, path, original_name, created_by) VALUES ('${type}', '${savePath}', '${file.name}', ${userID})`)
                const insertID = res[0].insertId
                return new this(insertID, type, savePath, file.name, userID)       
            }catch(e){
                return new Error(`Server error: ${e.message}`)
            }
            
            
    }

    async delete(){
        try{
            await db.query(`DELETE FROM files * WHERE id = ${this._id}`);
            return {status: "success", msg: "file was deleted"}
        }catch(e){
            return new Error(`MySQL Error: ${e.message}`)
        }
    }



}

module.exports = File