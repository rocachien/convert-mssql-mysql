/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";
const Adapter = require('./adapter');

/**
 * @class MSSQL
 * @description MSSQL Database
 * @param setting Options to setting the environment
 * @type {{Object}}
 * @author Rocachien
 */
class MSSQL {
  constructor(setting) {
    // console.log('===== MSSQL => constructor =====');

    this.setting = setting;
    this.adapter = new Adapter(this.setting);
  }
}

/**
 * @function query
 * @description inherit the adapter for query
 * @param sql String of query
 * @returns {String}
 * @author Rocachien
 */
MSSQL.prototype.query = async function(sql) {
  // console.log('===== MSSQL => query =====');

  return await this.adapter.query(sql);
};

module.exports = MSSQL;
