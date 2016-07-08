import createReducer from './createReducer';
import {
  RELS_REQUEST,
  RELS_SUCCESS,
  RELS_FAILURE,
  RELS_UNLOADED,
  RELS_BY_FRIEND,
  RELS_TO_IGNORED,
} from '../actions/RelsActions';
import Immutable from 'immutable';

const initialTypeState = {
  data: {},
  unloadedCount: 0,
  isFetching: false,
  error: null,
};

const initialState = Immutable.fromJS({
  [RELS_BY_FRIEND]: initialTypeState,
  [RELS_TO_IGNORED]: initialTypeState,
});

const actionMap = {
  [RELS_REQUEST](state, { relType }) {
    return state.mergeIn([ relType ], {
      isFetching: true,
      error: null,
    });
  },

  [RELS_SUCCESS](state, { response, relType }) {
    return state.mergeIn([ relType ], {
      data: response.result,
      isFetching: false,
      error: null,
    });
  },

  [RELS_FAILURE](state, { error, relType }) {
    return state.mergeIn([ relType ], {
      error,
      isFetching: false,
    });
  },

  [RELS_UNLOADED](state, { relType, currentRelsCount }) {
    return state.setIn(
      [ relType, 'unloadedCount' ],
      state.getIn([ relType, 'data', 'totalCount' ], 0) - currentRelsCount
    );
  },
};

export default createReducer(initialState, actionMap);
