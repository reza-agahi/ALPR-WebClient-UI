/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
import C from '../constants/actions';
import { convertTo8Digit } from '../plateUtils';
import { warnings } from '../constants/messages';

export const getAPlate = () => dispatch => {
  const query = `query {
    databaseGetAPlate {
      id
      plate_code
      car_full_address
      plate_full_address
      warningDesc
      date_time
      cam_code
      violation_address
      violation_code
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
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.data.databaseGetAPlate) {
        const plate = resp.data.databaseGetAPlate;
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
      } else if (!resp.errors) {
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload: {
            date_time: '',
            carSrc: '',
            plateSrc: '',
            plateCharacters: [],
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
