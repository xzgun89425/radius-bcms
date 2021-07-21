const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'radiusdb',
    password: 'radiusdb',
    database: 'radius'
})
let sql, values

let query = function(sql, values) {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = query