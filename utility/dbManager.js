const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('C://sqlite-tools-win-x64-3530100//sipbackend.db', (error) => {
    if (error) {
        console.log("Error Occured")
    } else {
        console.log("Connected to DB")
    }
})

module.exports = db;