/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
import C from '../constants/actions';
import { convertTo8Digit } from '../plateUtils';
import { errors } from '../constants/messages';

export const goToPendingList = ({ plate }, itemType) => dispatch => {
  const query = `mutation($id: String!, $plate_code: String!, $status: String!) {
    databaseUpdateAPlate(id: $id, plate_code: $plate_code, status: $status) {
      data {
        id
        plate_code
        car_full_address
      }
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
        plate_code: plate.plate_code,
        status: 'pending',
      },
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      
      if (resp.data.databaseUpdateAPlate.data) {
        dispatch({
          type: C.ADD_PENDING_PLATE,
          payload: plate,
        });
        dispatch({
          type:
            itemType === 'rejected'
              ? C.REMOVE_REJECTED_PLATE
              : C.REMOVE_POSTPONED_PLATE,
          payload: plate.id,
        });
      } else {
        toastr.warning(errors.SERVER_ERROR, resp.errors[0].message);
      }
    });
};
