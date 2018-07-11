import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import user from './user';
import runtime from './runtime';
import currentPlate from './currentPlate';
import pendingPlatesTable from './pendingPlatesTable';
import verifiedPlatesTable from './verifiedPlatesTable';
import removedPlatesTable from './removedPlatesTable';
import postponedPlatesTable from './postponedPlatesTable';

export default combineReducers({
  user,
  runtime,
  toastr: toastrReducer,
  currentPlate,
  pendingPlatesTable,
  verifiedPlatesTable,
  removedPlatesTable,
  postponedPlatesTable,
});
