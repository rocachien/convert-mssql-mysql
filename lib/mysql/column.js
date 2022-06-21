/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";

/**
 * check if a string has number
 * author: PTP0411
 */
function hasNumber(myString) {
  return /\d/.test(myString);
}

/**
 * @class Column
 * @description Generate the column string
 * @param data {{COLUMN_NAME, ORDINAL_POSITION, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH, NUMERIC_PRECISION, NUMERIC_PRECISION_RADIX, NUMERIC_SCALE, DATETIME_PRECISION, CHARACTER_SET_NAME, COLLATION_NAME}}
 * @type {{Object}}
 * @author Rocachien
 */
class Column {
  constructor(setting) {
    // console.log('===== Column => constructor =====');

    this.setting = setting;
  }
}

/**
 * @function name
 * @description Generate the column name
 * @returns {String}
 * @author PTP0411
 */
Column.prototype.name = function() {
// console.log('===== Column => name =====');
  let name = '';
  if(!this.data || !this.data.COLUMN_NAME){
    return '';
  }

  if(this.data.COLUMN_NAME.toLowerCase() === 'separator'|| this.data.COLUMN_NAME.toLowerCase()==='mode' || this.data.COLUMN_NAME.toLowerCase()==='description'
   ||this.data.COLUMN_NAME.toLowerCase() === 'sql' || this.data.COLUMN_NAME.toLowerCase()==='select'||
      this.data.COLUMN_NAME.toLowerCase()==='condition'|| this.data.COLUMN_NAME.toLowerCase()==='minvalue'|| this.data.COLUMN_NAME.toLowerCase()==='maxvalue'
  || this.data.COLUMN_NAME.toLowerCase()==='div' || this.data.COLUMN_NAME.toLowerCase()==='usage'|| this.data.COLUMN_NAME.toLowerCase()==='values' ||
      this.data.COLUMN_NAME.toLowerCase()==='decimal'|| this.data.COLUMN_NAME.toLowerCase()==='mod' || this.data.COLUMN_NAME.toLowerCase()==='group' ||
  this.data.COLUMN_NAME.toLowerCase()==='order'||this.data.COLUMN_NAME.toLowerCase()==='inout' || this.data.COLUMN_NAME.toLowerCase()==='interval'||
      this.data.COLUMN_NAME.toLowerCase()==='check' || this.data.COLUMN_NAME.toLowerCase().includes('read') || this.data.COLUMN_NAME.toLowerCase().includes('#') ||
      this.data.COLUMN_NAME.toLowerCase()==='use' ||this.data.COLUMN_NAME.toLowerCase()==='right'||this.data.COLUMN_NAME.toLowerCase()==='left'||
      this.data.COLUMN_NAME.toLowerCase() === 'release' || this.data.COLUMN_NAME.toLowerCase() === 'describe' || this.data.COLUMN_NAME.toLowerCase() === 'limit'||
     this.data.COLUMN_NAME.toLowerCase() === 'tinyint' ||isNaN(this.data.COLUMN_NAME) === false|| this.data.COLUMN_NAME.includes('/')){
    name = '`'+this.data.COLUMN_NAME+'`';
  }
  else if(this.data.COLUMN_NAME.includes(':')){
    name = this.data.COLUMN_NAME.replaceAll(':','_');
  }
  else {
    name = this.data.COLUMN_NAME;
  }
  return name;
}

/**
 * @function type
 * @description Generate the column type
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.type = function() {
  // console.log('===== Column => type =====');

  let type = '';
  let length = 0;
  let precision = 10;
  let scale = 0;
  if (!this.data || !this.data.DATA_TYPE) {
    return '';
  }

  // Get column length
  if (this.data.CHARACTER_MAXIMUM_LENGTH) {
    length = parseInt(this.data.CHARACTER_MAXIMUM_LENGTH);
  }
// get decimal
  if(this.data.NUMERIC_PRECISION){
    precision = parseInt(this.data.NUMERIC_PRECISION);
  }
  if (this.data.NUMERIC_SCALE){
    scale = parseInt(this.data.NUMERIC_SCALE);
  }

  // Column Type: Numeric, String, Date time, Other
  switch (this.data.DATA_TYPE) {
    case 'smallmoney':
      type += ' DECIMAL(10,4)';
      break;
    case 'double':
      type += ' DOUBLE';
      break;
    case 'bit':
      type += ' BOOL';
      break;
    case 'real':
      type += ' REAL';
      break;
    case 'money':
      type += ' DECIMAL(18, 4)';
      break;
    case 'decimal':
    case 'numeric':
      type += ' DECIMAL';
      break;
    case 'float':
      type += ' FLOAT';
      break;
    case 'bigint':
      type += ' BIGINT';
      break;
    case 'int':
      type += ' INT';
      break;
    case 'smallint':
    case 'tinyint':
      type += ' SMALLINT';
      break;
    case 'xml':
    case 'sql_variant':
      type += ' TEXT';
      break;
    case 'datetime':
    case 'smalldatetime':
      type += ' DATETIME';
          break;
    case 'date':
      type += ' DATE';
      break;
    case 'Duration':
    case 'time':
      type += ' TIME';
      break;
    case 'timestamp':
    case 'datetimeoffset':
      type += ' TIMESTAMP';
      break;
    case 'image':
      type += ' BLOB';
      break;
    case 'char':
    case 'nchar':
      type += ' CHAR';
      break;
    case 'binary':
      type += ' BINARY';
      break;
    case 'varbinary':
      if(length == -1){
        length = 0;
      }
      type += ' VARBINARY';
      break;
    case 'uniqueidentifier':
      type += ' CHAR(38)';
      break;
    case 'varchar':
    case 'nvarchar':
      // @todo: varchar limit length (16383) must be change to text or long text
      if (length <= 16777215) {
        length = 0;
        type += ' TEXT';
      }
      else if (length > 16777215 && length <= 4294967295) {
        length = 0;
        type += ' LONGTEXT';
      }
      break;
    case 'text':
    case 'ntext':
      if (length > 65535 && length <= 16777215) {
        length = 0;
        type += ' TEXT';
      }
      if (length > 16777215) {
        length = 0;
        type += ' LONGTEXT';
      }
      break;
  }

  // Column length
  if (type.length >= 0 && length >= 0 && this.data.DATA_TYPE === 'varbinary'
  || type.length > 0 && length > 0 && this.data.DATA_TYPE === 'char') {
    type += '('+length+')';
  }

  // Decimal lenth
  if(this.data.DATA_TYPE === 'decimal'){
    type += '('+precision+', '+scale+')';
  }

  return type;
};

/**
 * @function attribute
 * @description Generate the column attribute (None, BINARY, UNSIGNED, UNSIGNED ZEROFILL, CURRENT_TIMESTAMP)
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.attribute = function() {
  // console.log('===== Column => attribute =====');

  let str = '';

  return str;
};

/**
 * @function collation
 * @description Generate the column collation
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.collation = function() {
  // console.log('===== Column => collation =====');

  let str = '';
  if (!this.data) {
    return str;
  }

  //Column character set
  if (this.data.CHARACTER_SET_NAME) {
    const charSet = this.setting.characterSetName ? this.setting.characterSetName : this.data.CHARACTER_SET_NAME;
    str += ' CHARACTER SET ' + charSet;
  }
  //Column collation
  if (this.data.COLLATION_NAME) {
    const collation = this.setting.collationName ? this.setting.collationName : this.data.COLLATION_NAME;
    str += ' COLLATE ' + collation;
  }

  return str;
};

/**
 * @function nullAble
 * @description Generate the column NOT NULL
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.nullAble = function() {
  // console.log('===== Column => nullAble =====');

  let str = '';
  if (!this.data) {
    return str;
  }

  if (this.data.IS_NULLABLE && this.data.IS_NULLABLE === 'NO') {
    str += ' NOT NULL';
  }

  return str;
};

/**
 * @function defaultValue
 * @description Generate the column with default value
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.defaultValue = function() {
  // console.log('===== Column => defaultValue =====');

  let str = '';
  if (!this.data) {
    return str;
  }
  const dft = this.data.COLUMN_DEFAULT || 'null';




  switch (dft) {
    case '(NULL)':
    case 'null':
      if (this.data.IS_NULLABLE && this.data.IS_NULLABLE === 'NO') {
        str = '';
      }
      if (this.data.IS_NULLABLE === 'YES') {
        str = ' DEFAULT NULL';
      }
      break;

    case '(newid())':
      str = ` DEFAULT uuid()`;
          break;

    case '(host_id())':
    case '(host_name())':
    case '(app_name())':
      str = ` DEFAULT ''`;
      break;

    case "('')":
      if (this.type() === ' SMALLINT' || this.data.DATA_TYPE === 'decimal' || this.type() === ' TINYINT' ||
          this.type() === ' TIME' || this.type() === ' INT' || this.type() === ' BIGINT' ||
        this.type() === ' FLOAT' || this.data.DATA_TYPE === 'money' || this.data.DATA_TYPE === 'smallmoney') {
        str = ' DEFAULT 0';
      } else if (this.type() == ' DATETIME') {
        str = '';
      } else {
        str = ` DEFAULT ''`;
      }
      break;

    case '(datepart(month,getdate()))':
      str = ' DEFAULT MONTH(CURRENT_TIMESTAMP)';
      break;

    case '(datepart(year,getdate()))':
      str = ' DEFAULT YEAR(CURRENT_TIMESTAMP)';
      break;

    case '(suser_sname())':
      str = ' DEFAULT USER()';
      break;

    case '(getdate())':
      str = ` DEFAULT CURRENT_TIMESTAMP`;
      break;

    case `('01/01/1900')`:
    case '(1/1/1900)':
      str = ` DEFAULT '1900/01/01'`;
      break;

    case '((0))':
      if(this.data.DATA_TYPE === 'varbinary'){
        str = ` DEFAULT ''`
      }
    break;

    default: str = ` DEFAULT ${dft.replace(/\(/g, '').replace(/\)/g, '')}`;
  }

  if (hasNumber(dft) === true && this.type() === ' DATETIME') {
    str = ' DEFAULT CURRENT_TIMESTAMP';
  }

  if (dft.includes('/') &&
      dft.substring(dft.indexOf("/")).length < 5
      && this.type() == ' DATETIME'){
console.log('abcd: ')
    str = ` DEFAULT STR_TO_DATE(this.data.COLUMN_DEFAULT,'%d,%m,%Y')`;
  }

  return str;
};

/**
 * @function increment
 * @description Generate the column is incremented
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.increment = function() {
  // console.log('===== Column => increment =====');

  let str = '';
  if (!this.data) {
    return str;
  }

  return str;
};

/**
 * @function comment
 * @description Generate the column comment
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.comment = function() {
  // console.log('===== Column => comment =====');

  //COMMENT 'unique ID for each foo entry'
  let str = '';
  if (!this.data) {
    return str;
  }

  return str;
};

/**
 * @function definition
 * @description Generate the column string
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.definition = function(column) {
  // console.log('===== Column => definition =====');
  // console.log('===== column: ', column);

  //https://dev.mysql.com/doc/refman/8.0/en/show-columns.html
  //https://www.techonthenet.com/mariadb/tables/create_table.php
  //Name, Type, Attributes, Collation, Null, Default, Increment, Comments
  //CREATE TABLE `tb` (
  // `id`       INT(11)       UNSIGNED    NOT NULL    AUTO_INCREMENT                                                        COMMENT 'id comment' ,
  // `name`     VARCHAR(100)  BINARY      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL                COMMENT 'name comment' ,
  // `birth`    DATE                      NOT NULL                                              DEFAULT CURRENT_TIMESTAMP   COMMENT 'birth comment' ,
  // `age`      INT(2)        UNSIGNED    NOT NULL                                              DEFAULT '18' ,
  // PRIMARY KEY  (`id`))
  // ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT = 'table comment';

  this.data = column;
  let col = '';
  if (!this.data || !this.data.COLUMN_NAME) {
    return col;
  }

  col += this.name();
  col += this.type();
  col += this.attribute();
  col += this.collation();
  col += this.nullAble();
  col += this.defaultValue();
  col += this.increment();
  col += this.comment();

  return col;
};

module.exports = Column;
