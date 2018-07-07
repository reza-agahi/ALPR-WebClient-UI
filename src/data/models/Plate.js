import DataType from 'sequelize';
import Model from '../sequelize';

const Plate = Model.define(
  'Plate',
  {
    id: {
      type: DataType.STRING(64),
      primaryKey: true,
    },

    date_time: {
      type: DataType.STRING(64),
    },

    cam_code: {
      type: DataType.STRING(16),
    },

    plate_code: {
      type: DataType.STRING(16),
    },

    car_full_address: {
      type: DataType.STRING(512),
    },

    plate_full_address: {
      type: DataType.STRING(512),
    },

    violation_address: {
      type: DataType.STRING(128),
    },

    violation_code: {
      type: DataType.STRING(32),
    },

    status: {
      type: DataType.ENUM('pending', 'verified', 'rejected'),
    },

    sent: {
      type: DataType.BOOLEAN,
    },
  },
  {
    timestamps: true,
  },
);

export default Plate;
