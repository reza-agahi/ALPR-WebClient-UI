import { Plate } from 'data/models';
import fs from 'fs';
import AdmZip from 'adm-zip';
import base64 from 'base-64';
import { correctDateTime } from '../../../../plateUtils';

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
  # add plates in batch with file
  addBatch (
    # zip file containing plates data in base64 format
    file: String!
  ): [DatabasePlate]
`,
];

export const resolvers = {
  Mutation: {
    async addBatch(parent, args) {
      const file = base64.decode(args.file);
      const buf = Buffer.from(file, 'binary');
      const zip = new AdmZip(buf);
      const zipEntries = zip.getEntries();
      let violations = [];
      zipEntries.forEach(zipEntry => {
        if (
          zipEntry.entryName.indexOf('/send/plates/') !== -1 &&
          zipEntry.isDirectory === false
        ) {
          fs.writeFile(
            `public/violations/plates/${zipEntry.name}`,
            zip.readFile(zipEntry.entryName),
            'binary',
            err => {
              console.log(err);
            },
          );
          // zip.extractEntryTo(zipEntry.entryName, `public/violations/plates/`);
        } else if (
          zipEntry.entryName.indexOf('/send/cars/') !== -1 &&
          zipEntry.isDirectory === false
        ) {
          fs.writeFile(
            `public/violations/cars/${zipEntry.name}`,
            zip.readFile(zipEntry.entryName),
            'binary',
            err => {
              console.log(err);
            },
          );
        } else if (
          zipEntry.name === 'violation.json' &&
          zipEntry.isDirectory === false
        ) {
          violations = JSON.parse(zip.readAsText(zipEntry.entryName));
          violations = violations.map(item => ({
            id: item.plate_full_address
              .split('/')
              .slice(-1)[0]
              .split('.')[0],
            ...item,
            status: 'pending',
            date_time: correctDateTime(item.date_time),
            plate_full_address: `violations/plates/${
              item.plate_full_address.split('/').slice(-1)[0]
            }`,
            car_full_address: `violations/cars/${
              item.car_full_address.split('/').slice(-1)[0]
            }`,
          }));
        }
      });
      if (violations.length > 0) {
        const addedViolations = await Plate.bulkCreate(violations, {
          ignoreDuplicates: true,
        });

        if (!addedViolations) {
          // eslint-disable-next-line no-throw-literal
          throw 'problem with adding new violations';
        }
      }
      const plates = await Plate.findAll();
      return plates;
    },
  },
};
