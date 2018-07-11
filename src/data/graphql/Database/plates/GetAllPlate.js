import { Plate } from 'data/models';

export const schema = [
  `
  # A user stored in the local database
  type DatabasePlate {
    id: String
    date_time: String
    cam_code: String
    plate_code: String
    plate_full_address: String
    car_full_address: String
    violation_address: String
    violation_code: String
    status: String
    warningDesc: String
    updatedAt: String
    createdAt: String
  }
`,
];

export const queries = [
  `
  # Retrieves all plate stored in the local database
  databaseGetAllPlate: [DatabasePlate]

  # Retrieves a single plate from the local database
  databaseGetAPlate: DatabasePlate
`,
];

export const resolvers = {
  RootQuery: {
    async databaseGetAllPlate() {
      const plates = await Plate.findAll();
      return plates;
    },
    async databaseGetAPlate() {
      const plate = await Plate.findOne({
        where: { status: 'pending' },
      });
      return plate;
    },
  },
};
