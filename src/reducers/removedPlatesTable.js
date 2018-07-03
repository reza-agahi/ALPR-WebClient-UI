import C from '../constants/actions';

export default function removedPlatesTable(state = {}, action) {
  switch (action.type) {
    case C.ADD_BATCH_REMOVED_PLATES_TABLE:
      return [...state, ...action.payload];
    case C.SET_REMOVED_PLATES_TABLE:
      return action.payload;
    case C.REMOVE_REJECTED_PLATE:
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}
