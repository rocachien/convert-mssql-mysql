/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";

/**
 * @class Table
 * @description Generate the table string
 * @param data
 * @type {{Object}}
 * @author Rocachien
 */
class Table {
  constructor(setting) {
    // console.log('===== Column => constructor =====');

    this.setting = setting;
  }
}

/**
 * @function init
 * @description Init the table with name
 * @param name The table name
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.init = function(name) {
  // console.log('===== Table => create =====');
 let str ='';
  if (!name || name.length < 3) {
    return '';
  }

  this.sql = '';
  this.isDrop = false;
  this.isReplace = false;
  this.isNotExist = false;
  this.tableName = name;
  this.tableColumns = '';

};

/** @function tenBang
 * @description Generate table name
 * @returns {String}
 * @author PTP0411
 */
    Table.prototype.tenBang = function() {
    let str = this.tableName;
        if(this.tableName.includes('-')){
            str = this.tableName.replaceAll('-', '_');
        }
        if(this.tableName.includes(':')){
            str = this.tableName.replaceAll(':','_');
        }
        if(this.tableName.includes('.')){
            str = this.tableName.replaceAll('.','_');
        }
        if(this.tableName.includes('#')){
            str = this.tableName.replaceAll('#','_');
        }
    return str;
};
/**
 * @function defineColumn
 * @description Generate the column sql
 * @param cols The definition of columns
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.defineColumn = function(cols) {
  // console.log('===== Table => defineColumn =====');
  // console.log('===== Table => cols: ', cols);

  if (!cols || cols.length < 1) {
    this.tableColumns = '';
  }

  this.tableColumns = '(\n' + cols.join(', \n') + '\n)';
};

/**
 * @function drop
 * @description Generate the drop sql when the table exist
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.drop = function() {
  // console.log('===== Table => drop =====');

  this.isNotExist = false;
  this.isReplace = false;
  this.isDrop = true;
};

/**
 * @function replace
 * @description Generate the replace sql when the table exist
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.replace = function() {
  // console.log('===== Table => replace =====');

  this.isNotExist = false;
  this.isReplace = true;
  this.isDrop = false;
};

/**
 * @function notExist
 * @description Generate the create sql when the table not exist
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.notExist = function() {
  // console.log('===== Table => notExist =====');

  this.isNotExist = true;
  this.isReplace = false;
  this.isDrop = false;
};

/**
 * @function create
 * @description Generate the create sql
 * @returns {String}
 * @author Rocachien
 */
Table.prototype.create = function() {
  // console.log('===== Table => create =====');

  if (
    !this.tableName ||
    this.tableName.length < 3 ||
    !this.tableColumns ||
    this.tableColumns.length < 3) {
    return '';
  }
  const drop = this.isDrop ? `DROP TABLE IF EXISTS ${this.tableName};` : '';
  const replace = this.isReplace ? 'OR REPLACE ' : '';
  const exist = this.isNotExist ? 'IF NOT EXISTS ' : '';
  this.sql = `${drop}CREATE ${replace}TABLE ${exist}${this.tenBang()} ${this.tableColumns}`;

  return this.sql;
};
module.exports = Table;
