import C from '../constants/actions';

export default function currentPlate(state = {}, action) {
  switch (action.type) {
    case C.SET_CURRENT_PLATE:
      return action.payload;
    default:
      return state;
  }
}
