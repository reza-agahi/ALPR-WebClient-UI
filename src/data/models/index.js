import { CronJob } from 'cron';
import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Plate from './Plate';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

// Plate.upsert({
//   date_time: '1397/2/11 12:03',
//   cam_code: '1000001',
//   plate_code: '05010000000001044719',
//   plate_full_address: '206.jpg',
//   violation_address:
//     '\u062e\u06cc\u0627\u0628\u0627\u0646 \u0627\u0644\u063a\u062f\u06cc\u0631',
//   violation_code: 999991,
//   car_full_address: '206.jpg',
//   status: 'pending',
// })
//   .then(() => {
//     console.warn('plate added successfully.');
//   })
//   .catch(error => {
//     console.warn('problem with adding plate: ', error);
//   });

// Plate.upsert({
//   date_time: '1397/3/11 12:03',
//   cam_code: '1000001',
//   plate_code: '05010000000000244719',
//   plate_full_address: '206.jpg',
//   violation_address:
//     '\u062e\u06cc\u0627\u0628\u0627\u0646 \u0627\u0644\u063a\u062f\u06cc\u0631',
//   violation_code: 999991,
//   car_full_address: '206.jpg',
//   status: 'pending',
// })
//   .then(() => {
//     console.warn('plate added successfully.');
//   })
//   .catch(error => {
//     console.warn('problem with adding plate: ', error);
//   });

new CronJob(
  '00 00 * * * *',
  () => {
    Plate.destroy({
      where: {
        createdAt: {
          [sequelize.Op.lt]: new Date(
            new Date() - 30 * 24 * 60 * 60 * 1000 + 4.5 * 60 * 60 * 1000,
          ),
        },
      },
    });
  },
  null,
  true,
);

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, UserLogin, UserClaim, UserProfile, Plate };
