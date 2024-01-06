const fs = require('fs')

const deleteFile = (filePath)=>{

    fs.unlink(filePath, err=>{
        if(err){
            throw err
        }else{
            console.log('file hasbeen deleted')
        }
    }) 
 
}
exports.deleteFile = deleteFile;