import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { fetchConfs } from './confs';
import { clearError } from './error';

// Action creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json });
export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error });
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });
export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });

// Check user session
export function checkSession() {
  return async(dispatch) => {
    // contact the API
    await fetch(
      '/checksession',
      {
        method: 'GET',
        //credentials: 'same-origin',
        credentials: 'include',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.username) {
        dispatch(sessionCheckSuccess(json));
      } else {
        dispatch(sessionCheckFailure());
      }
    })
    .then(() => {
      return dispatch(fetchConfs());
    })
    .catch(error => dispatch(sessionCheckFailure(error)));
  };
}

// Log user in
export function logUserIn(userData) {
  return async (dispatch) => {
    // clear error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // register that a login attempt is being made
    dispatch(loginAttempt());

    // contact login API
    await fetch(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json) {
        dispatch(loginSuccess(json));
      } else {
        dispatch(loginFailure(new Error('Invalid username or password. Please try again.')));
      }
    })
    .then(() => {
        dispatch(fetchConfs());
    })
    .catch((error) => {
      dispatch(loginFailure(new Error(error)));
    });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// Log user out
export function logUserOut() {
  return async (dispatch) => {
    // clear error box if displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // Contact API
    await fetch(
      '/logout',
      {
        method: 'GET',
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        dispatch(logoutSuccess());
      } else {
        dispatch(logoutFailure(new Error(response.status)));
      }
    })
    .catch((error) => {
      dispatch(logoutFailure(new Error(error)));
    });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}
