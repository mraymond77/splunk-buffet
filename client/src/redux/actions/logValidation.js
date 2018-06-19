import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

export const logValidationAttempt = () => ({ type: 'LOG_VALIDATION_ATTEMPT' });
export const logValidationClearResults = () => ({ type: 'LOG_VALIDATION_CLEAR_RESULTS' });
export const logValidationFailure = () => ({ type: 'LOG_VALIDATION_FAILURE' });
export const logValidationSuccess = (json) => ({ type: 'LOG_VALIDATION_SUCCESS', json });

export function logValidate(sampleLogData) {
  return async (dispatch) => {
    dispatch(clearError());
    dispatch(incrementProgress());
    dispatch(logValidationAttempt());
    // Upload data to server for analysis
    await fetch(
      '/api/logvalidation',
      {
        method: 'POST',
        body: sampleLogData,
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
      return dispatch(logValidationSuccess(json));
    })
    .catch(error => dispatch(logValidationFailure(new Error(error))));
    return dispatch(decrementProgress());
  }
}
