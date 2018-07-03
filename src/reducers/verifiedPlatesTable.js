import C from '../constants/actions';

export default function verifiedPlatesTable(state = {}, action) {
  switch (action.type) {
    case C.ADD_BATCH_VERIFIED_PLATES_TABLE:
      return [...state, ...action.payload];
    case C.SET_VERIFIED_PLATES_TABLE:
      return action.payload;
    default:
      return state;
  }
}
