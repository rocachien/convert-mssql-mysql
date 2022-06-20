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
    console.warn('===== Error: The setting is required');
    process.exit();
    return true;
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
    console.warn('===== Error: ', tables.message);
    return false;
  }
// console.log(tables)
  const d = new Date();
  // console.log('===== Now: ', d.toISOString());

  for (let i = 0; i < tables.data.length ; i++) {
    const table = tables.data[i]['TABLE_NAME'];
  // for (let i = 0; i < 1 ; i++) {
    // const table = 'D34T1052';
    const sql = `SELECT * FROM information_schema.columns WHERE table_name = '${table}' ORDER BY ORDINAL_POSITION;`;
    const columns = await dbMSSQL.query(sql);

    // Check table structure
    if (columns && columns.message) {
      console.warn('===== Error: ', columns.message, table);
      return false;
    }
    if (columns.data.length === 0) {
      console.warn('===== No column in table: ', table);
      continue;
    }

    // Generate table
    dbMySQL.table.init(table);
    const colDefinition = [];

    for (let j = 0; j < columns.data.length; j++) {
      const column = columns.data[j];
      const colDef = dbMySQL.column.definition(column);

      if (colDef && colDef.length > 0) {
        colDefinition.push(colDef);
      }
    }

    if (colDefinition.length > 0) {
      dbMySQL.table.defineColumn(colDefinition);
    }

    dbMySQL.table.replace();
    const sTable = dbMySQL.table.create();

    console.log('===== Converting table: ', table, '=====');
    const data = await dbMySQL.query(sTable);

    if (data && data.error) {
      console.log(sTable);
      console.error(data.error);
      break;
    }
    console.log('===== DONE: ', table);
  }



  const c = new Date();
  console.log('===== Now: ', c.toISOString());
  console.log('===== Time: ', ((c.getTime() - d.getTime())/1000).toFixed(2), 'seconds');
  console.log('===== convert.end =====');
  dbMSSQL.adapter.closeAll();
  dbMySQL.adapter.close();
  process.exit();
  return true;
};

module.exports = convert;
