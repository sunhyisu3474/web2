const mysql = require('mysql');

///////////////  /*  DB ����  */  ///////////////
const db = mysql.createConnection({
	host: 'nodejs-011.cafe24.com',
	database: 'sunhyisu3474',
	user: 'sunhyisu3474',
	password: 'Sunhyisu344774',
	port: '3306'
});

const sessionDB = {
	host: 'nodejs-011.cafe24.com',
	database: 'sunhyisu3474',
	user: 'sunhyisu3474',
	password: 'Sunhyisu344774',
	port: '3306'
};
///////////////  /*  DB ����  */  ///////////////


///////////////  /*  QUERY  */  ///////////////
let LOGIN_SQL = `SELECT id, pw FROM accounts WHERE id = ?`;
let REGISTER_SQL = `INSERT INTO accounts (id, pw) VALUES(?, ?)`;
let POST_CONTENTS = `INSERT INTO post (title, content) VALUES(?, ?)`;
///////////////  /*  QUERY  */  ///////////////


///////////////  /*  ��� EXPORT  */  ///////////////
module.exports = {
	db,
	LOGIN_SQL,
	REGISTER_SQL,
	POST_CONTENTS,
	sessionDB
};
///////////////  /*  ��� EXPORT  */  ///////////////
