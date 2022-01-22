const { Pool } = require('pg');
const errorCatch = require("../../middleware/errorMiddleware");

const options = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
}

const pg_client = new Pool(options)
try {
    pg_client.connect();
    console.log("::> PostgreSQL Server is Ready");
} catch (err) {
    const errData = {
        flag_type: 1,
        req_src: "consumer-air-api",
        req_path: "/",
        req_file: "postgresql.js",
        req_line: 14,
        req_func: "postgre",
        req_type: "Database",
        content_message: err.message,
        content_err: err,
        is_solved: 0,
        is_notified: 0,
        is_assgined: "name",
    };
    errorCatch(errData)
}

exports.pg_client = pg_client
