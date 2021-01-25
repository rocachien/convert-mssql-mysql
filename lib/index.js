/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";
const mssql = require('./mssql');
const mysql = require('./mysql');
const convert = {};

/**
 * @function start
 * @description start the converting
 * @param option {{mssqlUser: null, mssqlPassword: null, mssqlServer: null, mssqlDatabase: null, mysqlUser: null, mysqlPassword: null, mysqlServer: null, mysqlDatabase: null}}
 * @returns {Boolean}
 * @author Rocachien
 */
convert.start = async (option) => {
  // console.log('===== convert.start =====');
  // console.log('===== option: ', option);


  // Step 1: Update the setting to connection MSSQL and MySQL database
  const setting = {
    mssqlUser:              null,
    mssqlPassword:          null,
    mssqlServer:            null,
    mssqlDatabase:          null,

    mysqlUser:              null,
    mysqlPassword:          null,
    mysqlServer:            null,
    mysqlDatabase:          null,

    characterSetName:       null,
    collationName:          null
  };

  if (option) {
    Object.keys(option).forEach((key) => {
      setting[key] = option[key];
    });
  }
  if (!setting.mssqlServer || !setting.mysqlServer) {
    console.error('===== Error: The setting is required');
    process.exit();
    return false;
  }

  // Connection with MSSQL
  const dbMSSQL = new mssql(setting);
  await dbMSSQL.adapter.connection('default');

  // Connection with MySQL
  const dbMySQL = new mysql(setting);
  await dbMySQL.adapter.connection();

  // Step 2: Read all tables of MSSQL database
  const sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`;
  const tables = await dbMSSQL.query(sql);

  if (tables && tables.message) {
    console.error('===== Error: ', tables.message);
    return false;
  }

  const d = new Date();
  console.log('==== Now: ', d.toISOString());

  for (let i = 0; i < tables.data.length; i++) {
    const table = tables.data[i]['TABLE_NAME'];
    const sql = `SELECT * FROM information_schema.columns WHERE table_name = '${table}' ORDER BY ORDINAL_POSITION;`;
    const columns = await dbMSSQL.query(sql);

    // Check table structure
    if (columns && columns.message) {
      console.error('===== Error: ', columns.message, table);
      return false;
    }
    if (columns.data.length === 0) {
      console.warn('===== No column in table: ', table);
      continue;
    }

    let sTable = `CREATE TABLE ${table} (`;
    for (let j = 0; j < columns.data.length; j++) {
      const column = columns.data[j];
      const colDef = dbMySQL.column.definition(column);

      console.log('===== colDef: ', colDef);

      // const data = await dbMySQL.query(`SELECT * FROM user`);
      // console.log('===== data: ', data);
      sTable += colDef + ', ';
    }


    console.log('===== i: ', i);
    console.log('===== sTable: ', sTable);
    break;
  }



  const c = new Date();
  console.log('==== Now: ', c.toISOString());
  console.log('==== Time: ', ((c.getTime() - d.getTime())/1000).toFixed(2), 'seconds');
  console.log('===== convert.end =====');
  dbMSSQL.adapter.closeAll();
  dbMySQL.adapter.close();
  process.exit();
  return true;
};

module.exports = convert;
