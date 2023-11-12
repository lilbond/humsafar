import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: process.env.MYSQL_HOST,
	database: process.env.MYSQL_DATABASE,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: 3306,
});

export default async function executeQuery(query: string, values: any[]) {
	try {
		const results = await connection.query(query, values);
		return results;
	} catch (error) {
		throw error;
	}
}
