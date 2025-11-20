import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

export interface SessionAttributes {
  id: string;
  userId: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  revokedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type SessionCreationAttributes = Optional<SessionAttributes, 'revokedAt' | 'createdAt' | 'updatedAt'>;

export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  declare id: string;
  declare userId: string;
  declare accessTokenHash: string;
  declare refreshTokenHash: string;
  declare accessExpiresAt: Date;
  declare refreshExpiresAt: Date;
  declare revokedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.STRING(191),
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    accessTokenHash: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    refreshTokenHash: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    accessExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    refreshExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['refreshExpiresAt']
      }
    ]
  }
);

