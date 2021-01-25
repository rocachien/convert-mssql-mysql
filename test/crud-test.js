/*jshint globalstrict:true, devel:true */
/*eslint no-var:0 */
/*global require, __dirname, describe, before, it */
"use strict";

const dotenv = require('dotenv');
const buster = require('buster');
const convert = require('../lib');

dotenv.config();
buster.spec.expose();
buster.testRunner.timeout = 500000000;

const option = {
  mssqlServer:             process.env.MSSQL_SERVER,
  mssqlDatabase:           process.env.MSSQL_DATABASE,
  mssqlUser:               process.env.MSSQL_USERNAME,
  mssqlPassword:           process.env.MSSQL_PASSWORD,

  mysqlServer:             process.env.MYSQL_SERVER,
  mysqlDatabase:           process.env.MYSQL_DATABASE,
  mysqlUser:               process.env.MYSQL_USERNAME,
  mysqlPassword:           process.env.MYSQL_PASSWORD,

  characterSetName:       process.env.CHARACTER_SET_NAME,
  collationName:          process.env.COLLATION_NAME
};

describe("CRUD operations", () => {
  before((done) => {
    done();
  });

  describe('Convert Database', () => {
    it("Before convert database", async (done) => {

      console.log('============================================');
      const result = await convert.start(option);
      console.log('============================================');
      console.log(result);
      buster.expect(result).toEqual("done");
      done();

    });
  });
});
