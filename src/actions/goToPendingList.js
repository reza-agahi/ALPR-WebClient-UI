/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
import C from '../constants/actions';
import { convertTo8Digit } from '../plateUtils';
import { errors } from '../constants/messages';

export const goToPendingList = ({ plate }) => dispatch => {
  const query = `mutation($id: String!, $plateCode: String!, $status: String!) {
    databaseUpdateAPlate(id: $id, plateCode: $plateCode, status: $status) {
      id
      plate_code
      car_full_address
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
      variables: {
        id: plate.id,
        plateCode: plate.plate_code,
        status: 'pending',
      },
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.data.databaseUpdateAPlate) {
        dispatch({
          type: C.ADD_PENDING_PLATE,
          payload: plate,
        });
        dispatch({
          type: C.REMOVE_REJECTED_PLATE,
          payload: plate.id,
        });
      } else {
        toastr.warning(errors.SERVER_ERROR, resp.errors[0].message);
      }
    });
};
