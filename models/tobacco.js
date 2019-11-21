module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Tobacco', {
        tobacco_id: {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            allowNull : false,
            unique : true,
        },
        brand: {
            type : DataTypes.STRING(30),
            allowNull : false,
            unique : false,
        },
        name: {
            type : DataTypes.STRING(30),
            allowNull : false,
            unique : false,
        },
        price: {
            type : DataTypes.INTEGER,
            allowNull : false,
            unique : false,
        },
        nicotine: {
            type : DataTypes.FLOAT,
            allowNull : false,
            unique : false,
        },
        TAR: {
            type : DataTypes.FLOAT,
            allowNull : false,
            unique : false,
        },
        feel_of_hit: {
            type : DataTypes.INTEGER,
            allowNull : false,
            unique : false,
            defaultValue: 0
        },
        is_menthol: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            unique : false,
        },
        score: {
            type : DataTypes.FLOAT,
            allowNull : false,
            unique : false,
            defaultValue: 0
        },
     
    },
        
    );
}
