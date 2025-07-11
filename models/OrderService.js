// models/OrderService.js

module.exports = (sequelize, DataTypes) => {
  const OrderService = sequelize.define('OrderService', {
    price: { type: DataTypes.FLOAT, allowNull: false },
  });

  OrderService.associate = (models) => {
    OrderService.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderService.belongsTo(models.Service, { foreignKey: 'service_id' });
  };

  return OrderService;
};
