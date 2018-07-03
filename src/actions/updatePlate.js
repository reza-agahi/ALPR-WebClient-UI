/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
// import soap from 'soap';
import C from '../constants/actions';
import { convertTo8Digit } from '../plateUtils';
import { errors, warnings } from '../constants/messages';

export const updatePlate = ({ id, plateCode, status }) => dispatch => {
  const query = `mutation($id: String!, $plateCode: String!, $status: String!) {
    databaseUpdateAPlate(id: $id, plateCode: $plateCode, status: $status) {
      id
      date_time
      cam_code
      plate_code
      plate_full_address
      car_full_address
      violation_address
      violation_code
      status
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
      variables: { id, plateCode, status },
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.data.databaseUpdateAPlate) {
        const plate = resp.data.databaseUpdateAPlate;
        const payload = {};
        payload.id = plate.id;
        payload.imageSrc = plate.plate_full_address;
        payload.plateCharacters = convertTo8Digit(plate.plate_code);
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload,
        });
      } else if (resp.errors) {
        toastr.error(
          errors.PLATE_UPDATE_TITLE,
          errors.PLATE_UPDATE_DESCRIPTION,
        );
      } else {
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload: { id: '0', plateCharacters: [], imageSrc: '' },
        });
        toastr.warning(warnings.NOTIFICATION, warnings.PLATE_NOT_FOUND);
      }
    });
};
