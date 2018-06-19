const initialState = 0;

export default function ProgressReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT_PROGRESS': {
      return state + 1;
    }
    case 'DECREMENT_PROGRESS': {
        return Math.max(state - 1, 0);
    }
    default: {
      return state;
    }
  }
}
