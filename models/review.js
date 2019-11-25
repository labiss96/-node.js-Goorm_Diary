module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Review', {
        review_id: {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            allowNull : false,
            unique : true,
        },
        writer : {
            type: DataTypes.INTEGER,
            allowNull : false,
        },
        comment : {
            type: DataTypes.STRING(200),
            allowNull : false,
        },
        feel_of_hit: {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        score: {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
    },
        
    );
}
