import { merge } from 'lodash';

/** * Queries ** */
import {
  schema as GetAllUsers,
  queries as GetAllUsersQueries,
  resolvers as GetAllUsersResolver,
} from './users/GetAllUsers';
import {
  queries as GetLoggedInUserQueries,
  resolvers as GetLoggedInUserResolver,
} from './users/GetLoggedInUser';
import {
  schema as GetAllPlates,
  queries as GetAllPlatesQueries,
  resolvers as GetAllPlatesResolver,
} from './plates/GetAllPlate';

/** * Mutations ** */
import {
  schema as CreateUserInput,
  mutation as CreateUser,
  resolvers as CreateUserResolver,
} from './users/CreateUser';
import {
  schema as SetAllPlates,
  mutation as SetAllPlatesMutation,
  resolvers as SetAllPlatesResolver,
} from './plates/SetAllPlate';
import {
  schema as AddBatchWithFile,
  mutation as AddBatchWithFileMutation,
  resolvers as AddBatchWithFileResolver,
} from './plates/AddBatchWithFile';

export const schema = [
  ...GetAllUsers,
  ...CreateUserInput,
  ...GetAllPlates,
  ...SetAllPlates,
  ...AddBatchWithFile,
];

export const queries = [
  ...GetAllUsersQueries,
  ...GetLoggedInUserQueries,
  ...GetAllPlatesQueries,
];

export const mutations = [
  ...CreateUser,
  ...SetAllPlatesMutation,
  ...AddBatchWithFileMutation,
];

export const resolvers = merge(
  GetAllUsersResolver,
  GetLoggedInUserResolver,
  CreateUserResolver,
  GetAllPlatesResolver,
  SetAllPlatesResolver,
  AddBatchWithFileResolver,
);
