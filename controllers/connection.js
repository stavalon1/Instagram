const Sequelize = require('sequelize');

const connection = new Sequelize(
    'instagraph_db',
    'root',
    'stavalon1995',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = connection;