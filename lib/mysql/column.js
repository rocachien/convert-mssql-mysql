/**
 * @copyright 2021
 * @author rocachien
 * @create 2021/01/18 20:37
 * @update 2021/01/18 20:37
 */
"use strict";

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
 * @function type
 * @description Generate the column type
 * @returns {String}
 * @author Rocachien
 */
Column.prototype.type = function() {
  // console.log('===== Column => type =====');

  let type = '';
  let length = 0;
  if (!this.data || !this.data.DATA_TYPE) {
    return '';
  }

  // Get column length
  if (this.data.CHARACTER_MAXIMUM_LENGTH) {
    length = parseInt(this.data.CHARACTER_MAXIMUM_LENGTH);
  }

  // Column Type: Numeric, String, Date time, Other
  switch (this.data.DATA_TYPE) {
    case 'char':
    case 'nchar':
      type += ' CHAR';
      break;
    case 'varchar':
    case 'nvarchar':
      //@todo: varchar limit length (16383) must be change to text or long text
      type += ' VARCHAR';
      break;
    case 'text':
    case 'ntext':
      if (length > 65535 && length <= 16777215) {
        length = 0;
        type += ' TEXT';
      }
      if (length > 16777215 && length <= 4294967295) {
        length = 0;
        type += ' LONGTEXT';
      }
      break;
  }

  // Column length
  if (type.length > 0 && length > 0) {
    type += '('+length+')';
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
    case 'null':
      str = ' DEFAULT NULL';
      break;
    case '(\'\')':
      str = ` DEFAULT ''`;
      break;
    case '(getdate())':
      str = ` DEFAULT CURRENT_TIMESTAMP`;
      break;
    default: str = ` DEFAULT ${dft.replace(/\(/g, '').replace(/\)/g, '')}`;
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

  col += this.data.COLUMN_NAME;
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
