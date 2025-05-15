const {ObjectId} = require("mongodb")

function isObjectIdValid(id){
    if(ObjectId.isValid(id)){
        if (((String)(new ObjectId(id))) == id){
            return true
        }
            return false

    }
    return false;
}

module.exports = isObjectIdValid
