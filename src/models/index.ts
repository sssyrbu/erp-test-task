import { Session } from './Session';
import { StoredFile } from './StoredFile';
import { User } from './User';

let associationsReady = false;

export const setupAssociations = () => {
  if (associationsReady) {
    return;
  }

  User.hasMany(Session, {
    foreignKey: 'userId',
    as: 'sessions',
    onDelete: 'CASCADE'
  });

  Session.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  User.hasMany(StoredFile, {
    foreignKey: 'userId',
    as: 'files',
    onDelete: 'CASCADE'
  });

  StoredFile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  associationsReady = true;
};

export { User, Session, StoredFile };

