
const initialState = {
  byIndexName: {},
  isFetching: false,
  isFetched: false,
  isSaving: false,
  isSaved: false,
  sidebarIndexSelection: '',
};

export default function confsReducer(state = initialState, action) {
  switch (action.type) {
    case 'SIDEBAR_INDEX_SELECT': {
      const newState = Object.assign({}, state);
      newState.sidebarIndexSelection = action.indexName;
      return newState;
    }
    case 'CONFS_FETCH_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isFetching = true;
      return newState;
    }
    case 'CONFS_FETCH_FAILURE':
    case 'CONFS_RESET': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'CONFS_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.byIndexName = action.json;
      newState.isFetching = false;
      newState.isFetched = true;
      return newState;
    }
    case 'CONFS_SAVE_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isSaving = true;
      return newState;
    }
    case 'CONFS_SAVE_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isSaving = false;
      newState.isSaved = false;
      return newState;
    }
    case 'CONFS_SAVE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.byIndexName = action.json;
      newState.isSaving = false;
      newState.isSaved = true;
      return newState;
    }
    default: {
        return state;
    }
  }
}
