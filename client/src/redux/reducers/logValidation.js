const initialState = {
  logValidationUploading: false,
  logValidationResults: '',
};

export default function logValidationReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOG_VALIDATION_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.logValidationUploading = true;
      return newState;
    }
    case 'LOG_VALIDATION_CLEAR_RESULTS': {
      const newState = Object.assign({}, state);
      newState.logValidationResults = '';
      return newState;
    }
    case 'LOG_VALIDATION_FAILURE': {
      const newState = Object.assign({}, state);
      newState.logValidationUploading = false;
      newState.logValidationResults = '';
      return newState;
    }
    case 'LOG_VALIDATION_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.logValidationUploading = false;
      newState.logValidationResults = action.json;
      return newState;
    }
    default: {
      return state;
    }
  }
}
