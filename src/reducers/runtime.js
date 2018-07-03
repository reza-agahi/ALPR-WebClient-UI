import C from '../constants/actions';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case C.SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
}
