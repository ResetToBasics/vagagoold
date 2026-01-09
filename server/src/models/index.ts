import { Agendamento } from './Agendamento';
import { Log } from './Log';
import { Sala } from './Sala';
import { User } from './User';

User.hasMany(Agendamento, { foreignKey: 'clienteId', as: 'agendamentos' });
Agendamento.belongsTo(User, { foreignKey: 'clienteId', as: 'cliente' });

Sala.hasMany(Agendamento, { foreignKey: 'salaId', as: 'agendamentos' });
Agendamento.belongsTo(Sala, { foreignKey: 'salaId', as: 'sala' });

User.hasMany(Log, { foreignKey: 'clienteId', as: 'logs' });
Log.belongsTo(User, { foreignKey: 'clienteId', as: 'cliente' });

export { Agendamento, Log, Sala, User };
