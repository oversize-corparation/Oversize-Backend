// models/FavoritesService.js

module.exports = (sequelize, DataTypes) => {
  const FavoritesService = sequelize.define('FavoritesService', {});

  FavoritesService.associate = (models) => {
    FavoritesService.belongsTo(models.User, { foreignKey: 'user_id' });
    FavoritesService.belongsTo(models.Service, { foreignKey: 'service_id' });
  };
  return FavoritesService;
};
