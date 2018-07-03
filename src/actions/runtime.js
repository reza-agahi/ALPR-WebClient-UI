/* eslint-disable import/prefer-default-export */

import C from '../constants/actions';

export function setRuntimeVariable({ name, value }) {
  return {
    type: C.SET_RUNTIME_VARIABLE,
    payload: {
      name,
      value,
    },
  };
}
