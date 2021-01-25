/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";
const Adapter = require('./adapter');
const Column = require('./column');

/**
 * @class MySQL
 * @description MySQL Database
 * @param setting Options to setting the environment
 * @type {{Object}}
 * @author Rocachien
 */
class MySQL {
  constructor(setting) {
    // console.log('===== MySQL => constructor =====');

    this.setting = setting;
    this.adapter = new Adapter(this.setting);
    this.column = new Column(this.setting);
  }
}

/**
 * @function query
 * @description inherit the adapter for query
 * @param sql String of query
 * @returns {String}
 * @author Rocachien
 */
MySQL.prototype.query = async function(sql) {
  // console.log('===== MySQL => constructor =====');

  return await this.adapter.query(sql);
};

module.exports = MySQL;
