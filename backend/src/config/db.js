const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'saa',
  password: process.env.DB_PASSWORD || '1234',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'shopquanao',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

console.log('Đang kết nối tới SQL Server với cấu hình:', {
  server: config.server,
  database: config.database,
  user: config.user,
  port: config.port
});

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Kết nối thành công tới SQL Server!');
    return pool;
  })
  .catch(err => {
    console.error('Kết nối SQL Server THẤT BẠI: ', err.message);
    return null;
  });

module.exports = {
  sql,
  poolPromise
};
