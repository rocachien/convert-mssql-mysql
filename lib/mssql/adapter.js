/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";
const mssql = require('mssql');

/**
 * @class Adapter
 * @description Connection with MSSQL Database
 * @param setting Option to setting the connection
 * @type {{Object}}
 * @author Rocachien
 */
class Adapter {
  constructor(setting) {
    // console.log('===== Adapter => constructor =====');

    this.pools = {};
    this.db = null;
    this.config = {
      user: setting.mssqlUser,
      password: setting.mssqlPassword,
      server: setting.mssqlServer,
      database: setting.mssqlDatabase,
      options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    };
  }
}

/**
 * @function getPool
 * @description Get pool to connection with MSSQL
 * @param name String of connection name
 * @returns {Promise<*>}
 * @author Rocachien
 */
Adapter.prototype.connection = async function (name) {
  // console.log('===== Adapter => getPool =====');

  if (!Object.prototype.hasOwnProperty.call(this.pools, name)) {
    const pool = new mssql.ConnectionPool(this.config);
    const close = pool.close.bind(pool);

    pool.close = (...args) => {
      delete this.pools[name];
      return close(...args);
    };

    await pool.connect();
    this.pools[name] = pool;
  }
  this.db = this.pools[name];
  return this.pools[name];
};


/**
 * @function query
 * @description Request the database
 * @param sql String of query
 * @returns {Object} {code: null, message: null, error: null, data: []}
 * @author Rocachien
 */
Adapter.prototype.query = async function(sql) {
  // console.log('===== Adapter => query =====');

  try {
    const result = await this.db.request().query(sql);
    return {
      code: 200,
      message: null,
      error: null,
      data: result.recordsets.length === 1 ? result.recordset : result.recordsets
    };
  } catch (e) {
    return {
      code: 'MSSQL',
      message: 'MSSQL Error',
      error: e,
      data: []
    };
  }
};

/**
 * @function closeAll
 * @description Close all of connection pool
 * @returns {Promise<any[]>}
 * @author Rocachien
 */
Adapter.prototype.closeAll = function() {
  // console.log('===== Adapter => getPool =====');

  return Promise.all(Object.values(this.pools).map((pool) => {
    return pool.close();
  }));
};

module.exports = Adapter;
