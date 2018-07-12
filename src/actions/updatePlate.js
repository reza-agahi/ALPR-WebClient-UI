/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
// import soap from 'soap';
import C from '../constants/actions';
import { convertTo8Digit } from '../plateUtils';
import { errors, warnings } from '../constants/messages';

export const updatePlate = data => dispatch => {
  const query = `mutation($id: String!, $plateCode: String, $status: String, $warningDesc: String) {
      databaseUpdateAPlate(id: $id, plateCode: $plateCode, status: $status, warningDesc: $warningDesc) {
        data {
          id
          date_time
          cam_code
          plate_code
          plate_full_address
          car_full_address
          violation_address
          violation_code
          status
          warningDesc
        }
        message
      }
  }`;
  fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: data,
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);

      if (resp.data.databaseUpdateAPlate) {
        const plate = resp.data.databaseUpdateAPlate.data;
        const payload = {};
        payload.id = plate.id;
        payload.carSrc = plate.car_full_address;
        payload.plateSrc = plate.plate_full_address;
        payload.plateCharacters = convertTo8Digit(plate.plate_code);
        payload.warningDesc = plate.warningDesc;
        payload.date_time = plate.date_time;
        payload.cam_code = plate.cam_code;
        payload.violation_address = plate.violation_address;
        payload.violation_code = plate.violation_code;
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload,
        });
        if (resp.data.databaseUpdateAPlate.message.length > 0)
          toastr.error(
            errors.PLATE_UPDATE_TITLE,
            `${
              resp.data.databaseUpdateAPlate.message
            } تخلف به لیست تخلفات تعویق افتاده اضافه شد.`,
          );
      } else if (resp.errors) {
        toastr.error(
          errors.PLATE_UPDATE_TITLE,
          errors.PLATE_UPDATE_DESCRIPTION,
        );
      } else {
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload: {
            id: '0',
            plateCharacters: [],
            carSrc: '',
            plateSrc: '',
            warningDesc: '',
            cam_code: '',
            violation_address: '',
            violation_code: '',
          },
        });
        toastr.warning(warnings.NOTIFICATION, warnings.PLATE_NOT_FOUND);
      }
    });
};
