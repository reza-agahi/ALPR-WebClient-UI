/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
import { successes, errors } from '../constants/messages';
import C from '../constants/actions';

export const getAllPlates = () => dispatch => {
  const query = `query {
    databaseGetAllPlate {
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
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.data.databaseGetAllPlate) {
        dispatch({
          type: C.SET_PENDING_PLATES_TABLE,
          payload: resp.data.databaseGetAllPlate.filter(
            item => item.status === 'pending',
          ),
        });
        dispatch({
          type: C.SET_VERIFIED_PLATES_TABLE,
          payload: resp.data.databaseGetAllPlate.filter(
            item => item.status === 'verified',
          ),
        });
        dispatch({
          type: C.SET_REMOVED_PLATES_TABLE,
          payload: resp.data.databaseGetAllPlate.filter(
            item => item.status === 'rejected',
          ),
        });
      } else {
        toastr.error(
          errors.GET_PLATES_TITLE,
          errors.GET_PLATES_TITLE_DESCRIPTION,
        );
      }
    });
};
