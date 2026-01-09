import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Sala extends Model {
    declare id: string;
    declare nome: string;
    declare horarioInicio: string;
    declare horarioFim: string;
    declare duracaoBloco: number;
    declare ativa: boolean;
    declare criadoEm: Date;
    declare atualizadoEm: Date;
}

Sala.init(
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
        horarioInicio: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        horarioFim: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        duracaoBloco: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ativa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'salas',
        timestamps: true,
        createdAt: 'criadoEm',
        updatedAt: 'atualizadoEm',
    }
);
