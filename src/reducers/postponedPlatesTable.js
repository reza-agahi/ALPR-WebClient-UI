import C from '../constants/actions';

export default function postponedPlatesTable(state = {}, action) {
  switch (action.type) {
    case C.ADD_BATCH_POSTPONED_PLATES_TABLE:
      return [...state, ...action.payload];
    case C.SET_POSTPONED_PLATES_TABLE:
      return action.payload;
    case C.REMOVE_POSTPONED_PLATE:
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}
