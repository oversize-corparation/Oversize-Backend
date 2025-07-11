// models/Store.js

module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    contact_info: {
      type: DataTypes.STRING,
    },
    policy: {
      type: DataTypes.TEXT,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Store.associate = (models) => {
    Store.belongsTo(models.User, { foreignKey: 'owner_id' });
    Store.hasMany(models.Product, { foreignKey: 'store_id' });
    Store.hasMany(models.Service, { foreignKey: 'store_id' });
    Store.hasMany(models.Order, { foreignKey: 'store_id' });
  };

  return Store;
};
