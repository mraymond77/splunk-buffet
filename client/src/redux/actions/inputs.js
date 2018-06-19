import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

export const inputsFetchAttempt = () => ({ type: 'INPUTS_FETCH_ATTEMPT' });
export const inputsFetchSuccess = json => ({ type: 'INPUTS_FETCH_SUCCESS', json });
export const inputsFetchFailure = error => ({ type: 'INPUTS_FETCH_FAILURE', error });

export function fetchInputs() {
  return async (dispatch) => {
      // clear error box if displayed
      dispatch(clearError());

      // turn on spinner
      dispatch(incrementProgress());

      // register that inputs fetch attempt is being made
      dispatch(inputsFetchAttempt());

      // Send api call
      await fetch(
        '/api/inputs',
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
          dispatch(inputsFetchSuccess(json));
        } else {
          dispatch(inputsFetchFailure(new Error('No inputs configured')));
        }
      })
      .catch((error) => {
        dispatch(inputsFetchFailure(new Error(error)));
      });

    // turn off spinner
    dispatch(decrementProgress());
  };
}
