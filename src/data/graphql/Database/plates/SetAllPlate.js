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
    plate_code: String
    # new status
    status: String
    # new status
    warningDesc: String
    # violation code
    violation_code: String
    # violation address
    violation_address: String
    # camera code
    cam_code: String
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
      console.log("args: ", args);
      // If plate does'nt exists, throw error
      const plate = await Plate.find({ where: { id: args.id } });

      if (!plate) {
        // eslint-disable-next-line no-throw-literal
        throw 'Plate with this id doesnt exist';
      }

      let message = '';

      if (args.status === 'verified') {
        // send plate information to soap server
        const dataXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.camera.rahvar.nrdc.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:addInformation>
         <clientCameraDTO>
            <!--Optional:-->
            <web:cameraCode>${args.cam_code}</web:cameraCode>
            <!--Optional:-->
            <web:cameraWarningDesc>${args.warningDesc}</web:cameraWarningDesc>
            <!--Optional:-->
            <web:clientCameraDTO/>
            <!--Optional:-->
            <colorCode>?</colorCode>
            <!--Optional:-->
            <confirmDate>?</confirmDate>
            <!--Optional:-->
            <confirmId>?</confirmId>
            <!--Optional:-->
            <web:errorCode>?</web:errorCode>
            <!--Optional:-->
            <web:isInternal>1</web:isInternal>
            <!--Optional:-->
            <web:message></web:message>
            <!--Optional:-->
            <web:password>123@car</web:password>
            <!--Optional:-->
            <web:plateImage>${fs
              .readFileSync(
                path.resolve(
                  __dirname,
                  `../build/public/${plate.plate_full_address}`,
                ),
              )
              .toString('base64')}</web:plateImage>
            <!--Optional:-->
            <web:plateImageConvert>cid:1399079069374</web:plateImageConvert>
            <!--Optional:-->
            <web:plateNo>${args.plate_code}</web:plateNo>
            <!--Optional:-->
            <web:speed>0</web:speed>
            <!--Optional:-->
            <systemCode>?</systemCode>
            <!--Optional:-->
            <usageCode>?</usageCode>
            <!--Optional:-->
            <userId>?</userId>
            <!--Optional:-->
            <web:userName>mznws_babol</web:userName>
            <!--Optional:-->
            <web:vehicleColor>?</web:vehicleColor>
            <!--Optional:-->
            <web:vehicleImage>${fs
              .readFileSync(
                path.resolve(
                  __dirname,
                  `../build/public/${plate.car_full_address}`,
                ),
              )
              .toString('base64')}</web:vehicleImage>
            <!--Optional:-->
            <web:vehicleImageConvert>cid:449917414602</web:vehicleImageConvert>
            <!--Optional:-->
            <web:vehicleSystem>?</web:vehicleSystem>
            <!--Optional:-->
            <web:vehicleUsage>?</web:vehicleUsage>
            <!--Optional:-->
            <web:version>?</web:version>
            <!--Optional:-->
            <violationAddress>${args.violation_address}</violationAddress>
            <!--Optional:-->
            <web:violationOccureDate>${
              plate.date_time
            }</web:violationOccureDate>
            <!--Optional:-->
            <web:violationTypeCode>${
              args.violation_code
            }</web:violationTypeCode>
            <!--Optional:-->
            <web:warningId>?</web:warningId>
         </clientCameraDTO>
      </web:addInformation>
   </soapenv:Body>
</soapenv:Envelope>`;

        const url =
          'http://10.30.138.12:8001/WebServiceCamera/services/AddCameraWarning?wsdl';
        await timeout(
          5000,
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml;charset=UTF-8',
            },
            body: dataXML,
          }),
        )
          .then(response => response.text())
          .then(response => {
            // if ok
            parseString(response, (err, result) => {
              console.log(JSON.stringify(result));
              const errorCode = Number(
                result['soap:Envelope']['soap:Body'][0][
                  'ns1:addInformationResponse'
                ][0].return[0]['ns2:errorCode'][0],
              );
              if (errorCode === 0) {
                plate.updateAttributes({
                  sent: true,
                  status: args.status,
                  plate_code: args.plate_code,
                  warningDesc: args.warningDesc,
                  violation_code: args.violation_code,
                  violation_address: args.violation_address,
                  cam_code: args.cam_code,
                });
              } else {
                switch (errorCode) {
                  case 100:
                    message = 'کد دوربین تعریف نشده یا اشتباه وارد شده است.';
                    break;
                  case 200:
                    message = 'اطلاعات ورودی اشتباه یا رکورد تکراری است.';
                    break;
                  case 300:
                    message = 'مشکل در درج اطلاعات';
                    break;
                  case 400:
                    message = 'مشکل در ارتباط';
                    break;
                  case 500:
                    message = 'مشکل در اعتبار سنجی';
                    break;
                  case 10:
                    message = 'نام کاربری اشتباه است.';
                    break;
                  case 20:
                    message = 'کلمه عبور اشتباه است.';
                    break;
                  case 30:
                    message = 'کاربر غیر فعال است.';
                    break;
                  case 40:
                    message = 'کاربر دسترسی ندارد.';
                    break;
                  case 600:
                    message = 'تصویر پلاک وارد نشده است.';
                    break;
                  case 605:
                    message =
                      'اندازه تصویر پلاک از ۵۰ کیلوبایت بالاتر می‌باشد.';
                    break;
                  case 610:
                    message = 'تصویر خودرو وارد نشده است.';
                    break;
                  case 615:
                    message =
                      'اندازه تصویر پلاک از ۳۰۰ کیلوبایت بالاتر می‌باشد.';
                    break;
                  case 620:
                    message = 'کد دوربین وارد نشده است.';
                    break;
                  case 625:
                    message = 'پلاک وارد نشده است.';
                    break;
                  case 630:
                    message = 'نام کاربری وارد نشده است.';
                    break;
                  case 635:
                    message = 'کلمه عبور وارد نشده است.';
                    break;
                  case 640:
                    message = 'سرعت وارد نشده است.';
                    break;
                  case 645:
                    message = 'تاریخ تخلف وارد نشده است.';
                    break;
                  case 650:
                    message = 'نوع تخلف وارد نشده است.';
                    break;
                  default:
                    break;
                }
                console.log('errorCode', errorCode);
                plate.updateAttributes({
                  status: 'postponed',
                  plate_code: args.plate_code,
                  warningDesc: args.warningDesc,
                  violation_code: args.violation_code,
                  violation_address: args.violation_address,
                  cam_code: args.cam_code,
                });
              }
            });
          })
          .catch(error => {
            // might be a timeout error
            plate.updateAttributes({
              status: 'postponed',
              plate_code: args.plate_code,
              warningDesc: args.warningDesc,
              violation_code: args.violation_code,
              violation_address: args.violation_address,
              cam_code: args.cam_code,
            });
            message = 'مشکل در برقراری ارتباط با سرور راهور.';
          });
      } else {
        plate.updateAttributes({
          status: args.status,
          plate_code: args.plate_code,
          warningDesc: args.warningDesc,
          violation_code: args.violation_code,
          violation_address: args.violation_address,
          cam_code: args.cam_code,
        });
      }

      const newPlate = await Plate.findOne({
        where: { status: 'pending' },
      });
      if (newPlate) return { data: newPlate, message };
    },
  },
};
