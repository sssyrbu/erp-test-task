import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

export interface StoredFileAttributes {
  id: number;
  userId: string;
  originalName: string;
  storedName: string;
  extension: string;
  mimeType: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoredFileCreationAttributes = Optional<StoredFileAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class StoredFile extends Model<StoredFileAttributes, StoredFileCreationAttributes> implements StoredFileAttributes {
  declare id: number;
  declare userId: string;
  declare originalName: string;
  declare storedName: string;
  declare extension: string;
  declare mimeType: string;
  declare size: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoredFile.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    storedName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    extension: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      }
    ]
  }
);

