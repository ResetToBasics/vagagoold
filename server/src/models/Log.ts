import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Log extends Model {
    declare id: string;
    declare clienteId: string;
    declare tipoAtividade: string;
    declare modulo: string;
    declare descricao: string | null;
    declare ipOrigem: string | null;
    declare userAgent: string | null;
    declare dataHora: Date;
    declare criadoEm: Date;
    declare atualizadoEm: Date;
}

Log.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        clienteId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        tipoAtividade: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        modulo: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        ipOrigem: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        dataHora: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'logs',
        timestamps: true,
        createdAt: 'criadoEm',
        updatedAt: 'atualizadoEm',
    }
);
