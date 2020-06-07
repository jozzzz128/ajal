const fs = require('fs');

function writeSync(file, jsonText){
    try {
        const wfile = fs.writeFileSync('./config/'+file, JSON.stringify(jsonText), 'utf8');
        return true;
    } catch (e){} return false;
}

module.exports = (req, res, next) => {
    const flag = require('../config/loaded.json');
    //If database already loaded
    if(flag) next();
    else{
        const {host, user, password, database} = req.body;
        //Verify complete parameters
        if(!host || !user || !password || !database) 
        return res.status(200).json({ code: 0, message: "Database information incomplete" });
        try {
            //Load database info
            const rwDatabase = writeSync('dbinfo.json', {
                host : host,
                user : user,
                password : password,
                database : database
            });
            console.log(rwDatabase);
            if(rwDatabase){
                //Modify Flag
                const rwFlag = writeSync('loaded.json', true);
                if(rwFlag){
                    const db = require('./config/database');
                    
                }
            }
        } catch (e){} return res.status(200).json({ code: -1 , message: "Error at loading database info"});
    }
}