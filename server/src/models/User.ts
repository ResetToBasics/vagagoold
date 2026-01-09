import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export type UserRole = 'admin' | 'cliente';

export class User extends Model {
    declare id: string;
    declare nome: string;
    declare email: string;
    declare senhaHash: string;
    declare role: UserRole;
    declare ativo: boolean;
    declare endereco: Record<string, string> | null;
    declare permissoes: string[] | null;
    declare criadoEm: Date;
    declare atualizadoEm: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nome: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
        },
        senhaHash: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'cliente'),
            allowNull: false,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        endereco: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        permissoes: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'criadoEm',
        updatedAt: 'atualizadoEm',
    }
);
