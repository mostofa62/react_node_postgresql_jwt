import {Dialect, Sequelize} from 'sequelize';
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const {DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE,DB_USERNAME, DB_PASSWORD} = process.env;



const sequelize = new Sequelize(DB_DATABASE as string, DB_USERNAME as string, DB_PASSWORD as string, {
    host: DB_HOST as string,
    port:parseInt(<string>DB_PORT),
    //dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    dialect:  DB_CONNECTION as Dialect
});

export { sequelize as SequelizeDb }

