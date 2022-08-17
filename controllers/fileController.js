// const fileService = require('../services/fileService')
const config = require('../config')
const fs = require('fs')
const File = require('../models/File')
const { response } = require('express');
const UserAuth = require('../models/UserAuth');
const UserProfile = require('../models/UserProfile');

class FileController {
    // async createDir(req, res) {
    //     try {
    //         const {name, type, parent} = req.body
    //         const file = new File({name, type, parent, user: req.user.id})
    //         const parentFile = await File.findOne({_id: parent})
    //         if(!parentFile) {
    //             file.path = name
    //             await fileService.createDir(file)
    //         } else {
    //             file.path = `${parentFile.path}\\${file.name}`
    //             await fileService.createDir(file)
    //             parentFile.childs.push(file._id)
    //             await parentFile.save()
    //         }
    //         await file.save()
    //         return res.json(file)
    //     } catch (e) {
    //         console.log(e)
    //         return res.status(400).json(e)
    //     }
    // }

    async uploadFile(req, res) {
        try {
            const file = req.files.image

            const user = await UserAuth.findById(req.user.id);
            await UserProfile.findOneAndUpdate({user_id: user.user_id}, { photo: `/storage/${user.user_id}${file.name.slice(-4)}`});

            const oldFile = await File.findOne({user: user.user_id});

            if(oldFile) {
                const oldFilePath = oldFile?.path.slice(1);
                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                    console.error(err)
                    return
                    }})
            }
           

            await File.findOneAndDelete({user: user.user_id})

            let path =`./storage/${user.user_id}${file.name.slice(-4)}`

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'File already exist'})
            }

            file.mv(path)

            const type = file.name.split('.').pop()
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: `/storage/${user.user_id}${file.name.slice(-4)}`,
                user: user.user_id
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }
}

module.exports = new FileController()