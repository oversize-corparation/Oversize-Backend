// models/Service.js

module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false },
    duration_estimate: { type: DataTypes.INTEGER },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  Service.associate = (models) => {
    Service.belongsTo(models.Store, { foreignKey: 'store_id' });
    Service.hasMany(models.OrderService, { foreignKey: 'service_id' });
    Service.hasMany(models.Review, { foreignKey: 'service_id' });
    Service.hasMany(models.FavoritesService, { foreignKey: 'service_id' });
  };

  return Service;
};
