import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export type AgendamentoStatus = 'pendente' | 'agendado' | 'cancelado' | 'concluido';

export class Agendamento extends Model {
    declare id: string;
    declare dataHora: Date;
    declare clienteId: string;
    declare salaId: string;
    declare status: AgendamentoStatus;
    declare criadoEm: Date;
    declare atualizadoEm: Date;
}

Agendamento.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        dataHora: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        clienteId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        salaId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pendente', 'agendado', 'cancelado', 'concluido'),
            allowNull: false,
            defaultValue: 'pendente',
        },
    },
    {
        sequelize,
        tableName: 'agendamentos',
        timestamps: true,
        createdAt: 'criadoEm',
        updatedAt: 'atualizadoEm',
    }
);
