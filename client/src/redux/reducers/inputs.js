
const initialState = {
  inputConfs: '',
  isFetching: false,
  isFetched: false,
};

export default function InputsReducer(state = initialState, action) {
  switch (action.type) {
    case 'INPUTS_FETCH_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isFetching = true;
      return newState;
    }
    case 'INPUTS_FETCH_FAILURE': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'INPUTS_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.inputConfs = action.json;
      newState.isFetching = false;
      newState.isFetched = true;
      return newState;
    }
    default: {
        return state;
    }
  }
}
