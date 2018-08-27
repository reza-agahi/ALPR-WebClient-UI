import fs from 'fs';
import base64 from 'base-64';
import fetch from 'node-fetch';
import soap from 'soap';
import path from 'path';
import { Plate } from 'data/models';
import { parseString } from 'xml2js';
import config from '../../../../config';
import { updatePlate } from '../../../../actions/updatePlate';

export const schema = [
  `
  type Response {
    data: DatabasePlate
    message: String
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
    plateCode: String
    # new status
    status: String
    # new status
    warningDesc: String
  ): Response
`,
];

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}

export const resolvers = {
  Mutation: {
    async databaseUpdateAPlate(parent, args) {
      // If plate does'nt exists, throw error
      const plate = await Plate.find({ where: { id: args.id } });

      if (!plate) {
        // eslint-disable-next-line no-throw-literal
        throw 'Plate with this id doesnt exist';
      }

      let message = '';

      if (args.status === 'verified') {
        // send plate information to soap server
        const dataXML = `<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Body>
        <ns0:addInformation xmlns:ns0="http://webservice.camera.rahvar.nrdc.com/">
          <clientCameraDTO>
            <ns0:cameraCode>${plate.cam_code}</ns0:cameraCode>
            <ns0:isInternal>1</ns0:isInternal>
            <ns0:password>123</ns0:password>
            <ns0:cameraWarningDesc>${plate.warningDesc}</ns0:cameraWarningDesc>
            <ns0:plateImage>${fs
              .readFileSync(
                path.resolve(
                  __dirname,
                  `../build/public/${plate.plate_full_address}`,
                ),
              )
              .toString('base64')}</ns0:plateImage>
            <ns0:plateNo>${plate.plate_code}</ns0:plateNo>
            <ns0:speed>0</ns0:speed>
            <ns0:userName>tbzws_gtehran</ns0:userName>
            <ns0:vehicleImage>${fs
              .readFileSync(
                path.resolve(
                  __dirname,
                  `../build/public/${plate.car_full_address}`,
                ),
              )
              .toString('base64')}</ns0:vehicleImage>
            <violationAddress>${plate.violation_address}</violationAddress>
            <ns0:violationOccureDate>${
              plate.date_time
            }</ns0:violationOccureDate>
            <ns0:violationTypeCode>${
              plate.violation_code
            }</ns0:violationTypeCode>
          </clientCameraDTO>
        </ns0:addInformation>
      </soap-env:Body>
    </soap-env:Envelope>
    `;

        const url =
          'http://10.30.138.12:8001/WebServiceCamera/services/AddCameraWarning?wsdl';
        await timeout(
          2000,
          fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'text/xml; charset:utf-8;',
            },
            body: dataXML,
          }),
        )
          .then(response => response.text())
          .then(response => {
            // if ok
            parseString(response, (err, result) => {
              const errorCode = Number(
                result['soap:Envelope']['soap:Body'][0][
                  'ns1:addInformationResponse'
                ][0].return[0]['ns1:errorCode'][0],
              );
              if (errorCode === 0) {
                plate.updateAttributes({
                  sent: true,
                  status: args.status,
                  plate_code: args.plateCode,
                  warningDesc: args.warningDesc,
                });
              } else {
                if (errorCode === 200) {
                  message = 'این تخلف قبلا به سرور راهور ارسال شده است.';
                }
                console.log('errorCode', errorCode);
                plate.updateAttributes({
                  status: 'postponed',
                  plate_code: args.plateCode,
                  warningDesc: args.warningDesc,
                });
              }
            });
          })
          .catch(error => {
            // might be a timeout error
            plate.updateAttributes({
              status: 'postponed',
              plate_code: args.plateCode,
              warningDesc: args.warningDesc,
            });
            message = 'مشکل در برقراری ارتباط با سرور راهور.';
          });
      } else {
        plate.updateAttributes({
          status: args.status,
          plate_code: args.plateCode,
          warningDesc: args.warningDesc,
        });
      }

      const newPlate = await Plate.findOne({
        where: { status: 'pending' },
      });
      if (newPlate) return { data: newPlate, message };
    },
  },
};
