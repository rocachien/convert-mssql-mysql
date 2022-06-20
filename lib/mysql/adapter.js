/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";
const mysql = require('mysql');

/**
 * @class Adapter
 * @description Connection with MySQL Database
 * @param setting Option to setting the connection
 * @type {{Object}}
 */
class Adapter {
  constructor(setting) {
    // console.log('===== Adapter => constructor =====');

    this.db = null;
    this.config = {
      user:       setting.mysqlUser,
      password:   setting.mysqlPassword,
      host:       setting.mysqlServer,
      database:   setting.mysqlDatabase,
      multipleStatements: true
    };
  }
}

/**
 * @function connection
 * @description Get pool to connection with MySQL

 * @returns {Promise<*>}
 */
Adapter.prototype.connection = async function () {
  // console.log('===== Adapter => connection =====');

  if (this.db) {
    return this.db;
  }
  this.db = mysql.createConnection(this.config);
  this.db.connect();
  return this.db;
};

/**
 * @function exec
 * @description Execute the request
 * @param sql The SQL query
 * @returns {Promise<*>}
 * @author Rocachien
 */
Adapter.prototype.exec = async function (sql) {
  // console.log('===== Adapter => exec =====');

  return new Promise((resolve, reject) => {
    this.db.query(sql, (error, results) => {
      if (error) {
        reject(error);
        return false;
      }

      resolve(results);
      return false;
    });
  });
};

/**
 * @function query
 * @description Request the database
 * @param sql String of query
 * @returns {Object} {code: null, message: null, error: null, data: []}
 * @author Rocachien
 */
Adapter.prototype.query = async function (sql) {
  // console.log('===== Adapter => query =====');

  try {
    let data = null;
    const results = await this.exec(sql);

    if (results.map) {
      data = results.map((result) => ({...result}));
    }

    return {
      code: 200,
      message: null,
      error: null,
      data: data
    };
  } catch (e) {
    return {
      code: 'MySQL',
      message: 'MySQL Error',
      error: e,
      data: []
    };
  }
};

/**
 * @function close
 * @description Close all of connection pool
 * @returns {Promise<any[]>}
 * @author Rocachien
 */
Adapter.prototype.close = function() {
  // console.log('===== Adapter => close =====');

  if (this.db) {
    this.db.end();
    delete this.db;
    this.db = null;
  }
};

module.exports = Adapter;
