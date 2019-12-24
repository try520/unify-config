const {
  ClickHouse
} = require('clickhouse');
module.exports = class {
  constructor(databaseConfig) {
    this.config = databaseConfig;
    this.clickHouse = new ClickHouse(databaseConfig);
  }

  /**
   * 创建数据库
   * @param {*} databaseName
   */
  async createDataBase(databaseName) {
    try {
      let query = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
      let ret = await this.clickHouse.query(query).toPromise();
      return ret;
    } catch (err) {
      return false
    }
  }

  /**
   * 删除数据库
   * @param {*} databaseName
   */
  async dropDataBase(databaseName) {
    let query = `DROP DATABASE IF NOT EXISTS ${databaseName}`;
    let ret = await this.clickHouse.query(query).toPromise();
    return ret;
  }

  /**
   * 删除表
   * @param {*} tableName
   */
  async dropTable(tableName) {
    try {
      if (!tableName) tableName = this.tableName;
      let sqls = [`DROP TABLE IF EXISTS ${this.config.dbName}.${tableName}_sub`, `DROP TABLE IF EXISTS ${this.config.dbName}.${tableName}`];
      for (let sql of sqls) {
        await this.clickHouse.query(sql).toPromise();
      }
      return true;
    } catch (err) {
      return false
    }

  }

  /**
   * 创建表
   */
  async createTable() {
    try {
      let fileds = '';
      let orderBy = [];
      for (let key in this.fields.column) {
        fileds += `${key} ${this.fields.column[key].type},`;
        if (this.fields.column[key].isPrimary) {
          orderBy.push(key);
        }
      }
      if (fileds.indexOf(',') > 0) {
        fileds = fileds.substr(0, fileds.length - 1);
      }
      let sqls = [
        `CREATE TABLE IF NOT EXISTS ${this.config.dbName}.${this.tableName}_sub  ( ${fileds} ) ENGINE= ${this.fields.engine} PARTITION BY ${this.fields.partition} ORDER BY (${orderBy.join(',')}) SETTINGS index_granularity = 8192`, `CREATE TABLE IF NOT EXISTS ${this.config.dbName}.${this.tableName} ( ${fileds}) ENGINE=Distributed(${this.config.clusterName}, ${this.config.dbName}, ${this.tableName}_sub, rand())`
      ];
      for (let sql of sqls) {
        await this.query(sql);
      }
      return true;
    } catch (err) {
      console.error(err)
      return false;
    }

  }

  /**
   * 查询 （此方法为基类方法 请使用 find 系列方法代替此方法）
   * @param {*} sql
   */
  async query(sql) {
    let ret = await this.clickHouse.query(sql).toPromise();
    return ret;
  }

  /**
   * 插入数据(此方法为基类方法，请使用 insertOne 或者 insertItems 代替)
   * @param {*} sql
   * @param {*} data
   */
  async insert(sql, data) {
    let ret = await this.clickHouse.insert(sql, data).toPromise();
    return ret;
  }

  /**
   * 插入单条数据
   * @param {*} model
   */
  async insertOne(model) {
    let fileds = this.getInsertField(model);
    let ret = await this.insert(`INSERT INTO ${this.config.dbName}.${this.tableName} (${fileds})`, model);
    return ret;
  }

  /**
   * 插入多条数据
   * @param {*} models
   */
  async insertItems(models) {
    let fileds = this.getInsertField(models[0]);
    let ret = await this.insert(`INSERT INTO ${this.config.dbName}.${this.tableName} (${fileds})`, models);
    return ret;
  }

  /**
   * 查询并返回1条数据
   * @param {*} option
   */
  async findOne(option) {
    let model = {};
    if (!option.limit) {
      option.offset = 0;
      option.limit = 1;
    }
    let sql = this.getFindSql(option);
    let ret = await this.query(sql);
    if (ret) {
      model = ret[0];
    }
    return model;
  }

  /**
   * 查询数据
   * @param {*} option
   */
  async findAll(option) {
    let sql = this.getFindSql(option);
    return await this.query(sql);
  }

  /**
   * 查询并初始化数据
   * @param {*} option
   */
  async findOrInitialize(option) {
    let _model = {};
    let ret = await this.findOne(option);
    if (!ret) {
      _model = this.model;
      if (option.defaults) {
        for (let key in option.defaults) {
          _model[key] = option.defaults[key];
        }
      }
    } else {
      _model = ret;
    }
    return _model;
  }

  /**
   * 返回数据模型
   */
  get model() {
    let _model = {};
    for (let key in this.fields.column) {
      _model[key] = this.getDefaultVal(this.fields.column[key].type, this.fields.column[key].default);
    }
    return _model;
  }

  getDefaultVal(type, val) {
    let _val;
    type = type.toLowerCase();
    if (val) {
      _val = val;
    } else {
      if (type.indexOf('string') > -1) {
        _val = '';
      } else if (type.indexOf('int') > -1 || type.indexOf('float') > -1 || type.indexOf('double')) {
        _val = 0;
      } else if (type.indexOf('datetime') > -1) {
        _val = this.moment().format('YYYY-MM-DD hh:mm:ss');
      } else if (type.indexOf('date') > -1) {
        _val = this.moment().format('YYYY-MM-DD');
      }
    }
    return _val;
  }

  /**
   * 数量统计
   * @param {*} option
   */
  async count(option) {
    option.attributes = ` count(*) as count`;
    let ret = await this.findOne(option);
    return Number("0" + ret.count);
  }

  /**
   * 查询并统计
   * @param {*} option
   */
  async findAndCount(option) {
    let rows = await this.findAll(option);
    delete option.limit;
    delete option.order;
    delete option.group;
    delete option.offset;
    let count = await this.count(option);
    return {
      count: count,
      rows: rows
    };
  }

  /**
   * 查询最小值
   * @param {*} field
   * @param {*} option
   */
  async min(field, option) {
    option.attributes = ` min(${field}) `;
    return await this.findAll(option);
  }

  /**
   * 查询最大值
   * @param {*} field
   * @param {*} option
   */
  async max(field, option) {
    option.attributes = ` max(${field}) `;
    return await this.findAll(option);
  }

  /**
   * 合计某个字段值
   * @param {*} field
   * @param {*} option
   */
  async sum(field, option) {
    option.attributes = ` sum(${field}) `;
    return await this.findAll(option);
  }

  getFindSql(option) {
    let sql = '';
    let attributes = option.attributes ? option.attributes : '*';
    sql = `SELECT ${attributes} FROM ${this.config.dbName}.${this.tableName}`;
    if (option.where) {
      sql += ` where ${option.where}`;
    }
    if (option.group) {
      sql += ` group by  ${option.group}`;
    }
    if (option.order) {
      sql += ` order by  ${option.order}`;
    }
    if (!option.offset) {
      option.offset = 0;
    }
    if (option.limit) {
      sql += ` limit  ${ option.offset} , ${option.limit}`;
    }
    console.log(sql);
    return sql;
  }

  getInsertField(model) {
    let fields = [];
    for (let key in model) {
      if (key) {
        fields.push(key);
      }
    }
    return fields.join(',');
  }

  getInsertSql(model) {
    let sql = `insert into ${this.config.dbName}.${this.tableName} ( [key] ) values ([val])`;
    let values = [];
    for (let key in model) {
      if (key) {
        let val = null;
        let valType = typeof model[key];
        switch (valType) {
          case 'string':
            if (!isNaN(model[key])) {
              val = model[key];
            } else {
              val = `'${model[key]}'`;
            }
            break;
          case 'number':
            val = model[key];
            break;
        }
        sql = sql.replace('[key]', `${key},[key]`).replace('[val]', `${val},[val]`);
      }
    }
    sql = sql.replace(',[key]', '').replace(',[val]', '');
    return sql;
  }

};