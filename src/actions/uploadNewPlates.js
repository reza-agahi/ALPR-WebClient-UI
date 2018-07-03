/* eslint-disable import/prefer-default-export */

import { toastr } from 'react-redux-toastr';
import { successes, errors } from '../constants/messages';
import C from '../constants/actions';

export const uploadNewPlates = ({ file }) => dispatch => {
  const query = `mutation($file: String!) {
    addBatch(file: $file) {
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
      variables: { file },
    }),
  })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.data.addBatch) {
        dispatch({
          type: C.SET_PENDING_PLATES_TABLE,
          payload: resp.data.addBatch.filter(item => item.status === 'pending'),
        });
        dispatch({
          type: C.SET_VERIFIED_PLATES_TABLE,
          payload: resp.data.addBatch.filter(
            item => item.status === 'verified',
          ),
        });
        dispatch({
          type: C.SET_REMOVED_PLATES_TABLE,
          payload: resp.data.addBatch.filter(
            item => item.status === 'rejected',
          ),
        });

        toastr.success(
          successes.ADD_NEW_PLATES_TITLE,
          successes.ADD_NEW_PLATES_DESCRIPTION,
        );
      } else {
        toastr.error(
          errors.ADD_NEW_PLATES_TITLE,
          errors.ADD_NEW_PLATES_DESCRIPTION,
        );
      }
    });
};
