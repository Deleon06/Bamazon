module.exports = function(sequelize, DataTypes) {

    var products = sequelize.define('products', {
        item_id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },

        product_name: {
            type: DataTypes.STRING,
            notEmpty: true
        },

        department_name: {
            type: DataTypes.STRING,
            notEmpty: true
        },

        price: {
            type: DataTypes.INTEGER,
            notEmpty: true
        },

        stock_quantity: {
            type: DataTypes.INTEGER,
            notEmpty: true
        }

    });

    return products;
};