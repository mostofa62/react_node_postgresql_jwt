import { Sequelize, Model, DataTypes } from 'sequelize';
import {SequelizeDb} from '../config/database';
class User extends Model {
    declare id: number;
    declare name: string;
    declare email:string;
    declare password:string;    
    declare token:string | null;
}
const sequelize = SequelizeDb;
User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      token: {
        type: new DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      //timestamps:false,
      sequelize, // passing the `sequelize` instance is required
    },
  );

  export { User as User};