
/**
 * 所有的数据库的访问方法
 */
let pool = require('./init')
let query = function (sql, data = {}, isCount = false) {
    return new Promise((resolve, reject) => {
        console.log(sql)
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(new Error('数据库连接池连接失败'))
            } else {
                //开启数据库事务
                conn.beginTransaction(err => {
                    if (err) {
                        return '开启事务失败'
                    } else {
                        if (Array.isArray(sql)) {
                            let sqlstr = sql.join(';');
                            sqlstr += ";"
                            // console.log(sqlstr)
                            conn.query(sqlstr, function (qerr, vals, fields) {
                                if (qerr) {
                                    reject(new Error('sql语句执行发生错误'))
                                } else {
                                    conn.commit((error) => {
                                        if (error) {
                                            console.log('事务提交失败')
                                        }
                                    })
                                    //释放连接
                                    conn.release();
                                    resolve(vals)
                                }
                            });
                        } else {
                            conn.query(sql, Object.values(data), function (qerr, vals, fields) {
                                //事件驱动回调
                                if (qerr) {
                                    reject(new Error('sql语句执行发生错误'))
                                } else {
                                    if (isCount) {
                                        conn.query(`SELECT FOUND_ROWS() as count`, function (error, count) {
                                            conn.commit((error) => {
                                                if (error) {
                                                    console.log('事务提交失败')
                                                }
                                            })
                                            conn.release();
                                            resolve({
                                                data: vals,
                                                count: count[0].count
                                            })
                                        })
                                    } else {
                                        conn.commit((error) => {
                                            if (error) {
                                                console.log('事务提交失败')
                                            }
                                        })
                                        //释放连接
                                        conn.release();
                                        resolve(vals)
                                    }
                                }
                            });
                        }
                    }
                })

            }
        });
    })
};

module.exports = query;