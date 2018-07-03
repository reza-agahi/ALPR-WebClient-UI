import C from '../constants/actions';

export default function pendingPlatesTable(state = {}, action) {
  switch (action.type) {
    case C.ADD_BATCH_PENDING_PLATES_TABLE:
      return [...state, ...action.payload];
    case C.SET_PENDING_PLATES_TABLE:
      return action.payload;
    case C.ADD_PENDING_PLATE:
      return [...state, action.payload];
    default:
      return state;
  }
}
