const mysql = require('mysql');

///////////////  /*  DB ����  */  ///////////////
const db = mysql.createConnection({
	host: 'localhost',
	database: 'web',
	user: 'root',
	password: '#Sunhyisu344774',
	port: '3474',
	multipleStatements: true  // �������� ��� ����
});

const sessionDB = {
	host: 'localhost',
	database: 'web',
	user: 'root',
	password: '#Sunhyisu344774',
	port: '3474'
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
	sessionDB,
};
///////////////  /*  ��� EXPORT  */  ///////////////
