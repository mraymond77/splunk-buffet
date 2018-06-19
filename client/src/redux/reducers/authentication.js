
const initialState = {
  id: '',
  isLoggedIn: false,
  isLoggingIn: false,
  username: '',
};

export default function AuthenticationReducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isLoggingIn = true;
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_SESSION_CHECK_FAILURE':
    case 'AUTHENTICATION_LOGOUT_SUCCESS': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_SESSION_CHECK_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.id = action.json._id;
      newState.isLoggedIn = true;
      newState.isLoggingIn = false;
      newState.username = action.json.username;
      return newState;
    }
    case 'AUTHENTICATION_LOGOUT_FAILURE': {
      return state;
    }
    default: {
        return state;
    }
  }
}
