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
      plate_full_address
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
        payload.imageSrc = plate.plate_full_address;
        payload.plateCharacters = convertTo8Digit(plate.plate_code);
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload,
        });
      } else if (!resp.errors) {
        dispatch({
          type: C.SET_CURRENT_PLATE,
          payload: { dateTime: '0', imageSrc: '', plateCharacters: [] },
        });

        toastr.warning(warnings.NOTIFICATION, warnings.PLATE_NOT_FOUND);
      }
    });
};
