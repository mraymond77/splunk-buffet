import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

export const confsFetchAttempt = () => ({ type: 'CONFS_FETCH_ATTEMPT' });
export const confsFetchSuccess = json => ({ type: 'CONFS_FETCH_SUCCESS', json });
export const confsFetchFailure = error => ({ type: 'CONFS_FETCH_FAILURE', error });
export const confsReset = () => ({ type: 'CONFS_RESET' });
export const confsSaveAttempt = () => ({ type: 'CONFS_SAVE_ATTEMPT' });
export const confsSaveSuccess = json => ({ type: 'CONFS_SAVE_SUCCESS', json });
export const confsSaveFailure = error => ({ type: 'CONFS_SAVE_FAILURE', error });
export const sidebarIndexSelect = indexName => ({ type: 'SIDEBAR_INDEX_SELECT', indexName});

export function fetchConfs() {
  return async (dispatch) => {
      // clear error box if displayed
      dispatch(clearError());

      // turn on spinner
      dispatch(incrementProgress());

      // register that confs fetch attempt is being made
      dispatch(confsFetchAttempt());

      // Send api call
      await fetch(
        '/api/confs',
        {
          method: 'GET',
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
          dispatch(confsFetchSuccess(json));
        } else {
          dispatch(confsFetchFailure(new Error('No confs configured')));
        }
      })
      .catch((error) => {
        dispatch(confsFetchFailure(new Error(error)));
      });

    // turn off spinner
    dispatch(decrementProgress());
  };
}

export function saveConfs(inputConfsObj) {
  return async (dispatch) => {
    dispatch(clearError());
    dispatch(incrementProgress());
    dispatch(confsSaveAttempt());
    // Send api call
    await fetch(
      '/api/confs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputConfsObj),
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
      return dispatch(confsSaveSuccess(json));
      //return dispatch(confsSaveFailure(new Error(json)));
    })
    .catch(error => dispatch(confsSaveFailure(new Error(error))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}
