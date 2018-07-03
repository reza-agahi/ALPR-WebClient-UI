import fs from 'fs';
import base64 from 'base-64';
import soap from 'soap';
import { Plate } from 'data/models';
import config from '../../../../config';

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
    updatedAt: String
    createdAt: String
  }
`,
];

export const mutation = [
  `
  # Change a single plate status
  databaseUpdateAPlate (
    # id of plate
    id: String!
    # new plate_code
    plateCode: String! 
    # new status
    status: String!   
  ): DatabasePlate
`,
];

export const resolvers = {
  Mutation: {
    async databaseUpdateAPlate(parent, args) {
      // If plate does'nt exists, throw error
      const plate = await Plate.find({ where: { id: args.id } });

      if (!plate) {
        // eslint-disable-next-line no-throw-literal
        throw 'Plate with this id doesnt exist';
      }

      const updatedPlate = await plate.updateAttributes({
        status: args.status,
        plate_code: args.plateCode,
      });

      if (!updatedPlate) {
        // eslint-disable-next-line no-throw-literal
        throw 'Plate doesnt updated.';
      }

      // send plate information to soap server
      // if (plate.status === 'verified') {
      //   const url =
      //     'http://10.30.138.12:8001/WebServiceCamera/services/AddCameraWarning?wsdl';
      //   const data = {
      //     violationTypeCode: plate.violation_code,
      //     violationOccureDate: plate.date_time,
      //     violationAddress: plate.violation_address,
      //     speed: 0,
      //     password: '123',
      //     userName: 'tbzws_gtehran',
      //     plateNo: plate.plate_code,
      //     cameraCode: config.cameraCode,
      //     vehicleImage: base64.encode(fs.readFileSync(plate.car_full_address)),
      //     plateImage: base64.encode(fs.readFileSync(plate.plate_full_address)),
      //     isInternal: 1,
      //   };
      //   soap.createClient(url, (err, client) => {
      //     client.addInformation(data, (err, result) => {
      //       if (err) console.log(err);
      //       console.log(result);
      //     });
      //   });
      // }

      const newPlate = await Plate.findOne({
        where: { status: 'pending' },
      });
      return newPlate;
    },
  },
};
