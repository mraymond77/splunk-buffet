import { combineReducers } from 'redux';
import AuthenticationReducer from './authentication';
import ConfsReducer from './confs';
import LogValidationReducer from './logValidation';
import ErrorReducer from './error';
import ProgressReducer from './progress';

const reducers = {
  authentication: AuthenticationReducer,
  confs: ConfsReducer,
  error: ErrorReducer,
  logValidation: LogValidationReducer,
  progress: ProgressReducer,
};

export default combineReducers(reducers);
