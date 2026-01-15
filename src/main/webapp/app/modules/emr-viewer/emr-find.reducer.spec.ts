import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import reducer, { getChartList, getPatientInfo, getFormList, reset } from './emr-finder.reducer';

describe('Emr content reducer tests', () => {
  const initialState = {
    loading: {
      patient: false,
      chart: false,
      form: false,
    },
    errorMessage: null,
    patient: null,
    charts: [],
    forms: [],
    categories: [],
    updateSuccess: false,
  };

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: {
        patient: false,
        chart: false,
        form: false,
      },
      errorMessage: null,
      updateSuccess: false,
    });
    expect(state.patient).toBeNull();
    expect(state.charts).toEqual([]);
    expect(state.forms).toEqual([]);
  }

  function testMultipleTypes(types, payload, testFunction, error?) {
    types.forEach(type => {
      testFunction(reducer(undefined, { type, payload, error }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(reducer(undefined, { type: '' }));
    });
  });

  describe('Requests', () => {
    it('should set patient loading', () => {
      const state = reducer(undefined, { type: getPatientInfo.pending.type });
      expect(state).toMatchObject({
        errorMessage: null,
        updateSuccess: false,
        loading: {
          patient: true,
          chart: false,
          form: false,
        },
      });
    });

    it('should set chart loading', () => {
      const state = reducer(undefined, { type: getChartList.pending.type });
      expect(state).toMatchObject({
        errorMessage: null,
        updateSuccess: false,
        loading: {
          patient: false,
          chart: true,
          form: false,
        },
      });
    });

    it('should set form loading', () => {
      const state = reducer(undefined, { type: getFormList.pending.type });
      expect(state).toMatchObject({
        errorMessage: null,
        updateSuccess: false,
        loading: {
          patient: false,
          chart: false,
          form: true,
        },
      });
    });

    it('should reset the state', () => {
      expect(reducer({ ...initialState, loading: { patient: true, chart: true, form: true } }, reset())).toEqual({
        ...initialState,
      });
    });
  });

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [getPatientInfo.rejected.type, getChartList.rejected.type, getFormList.rejected.type],
        'some message',
        state => {
          expect(state).toMatchObject({
            errorMessage: 'error message',
            updateSuccess: false,
            loading: {
              patient: false,
              chart: false,
              form: false,
            },
          });
        },
        {
          message: 'error message',
        }
      );
    });
  });

  describe('Successes', () => {
    it('should set patient info', () => {
      const payload = { data: [{ id: 'P100', name: 'Sample Patient' }] };
      expect(
        reducer(undefined, {
          type: getPatientInfo.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: {
          patient: false,
          chart: false,
          form: false,
        },
        updateSuccess: true,
        patient: payload.data[0],
        charts: [],
        forms: [],
        categories: [],
      });
    });

    it('should set chart list', () => {
      const payload = { data: [{ id: 'R1' }, { id: 'R2' }] };
      expect(
        reducer(undefined, {
          type: getChartList.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: {
          patient: false,
          chart: false,
          form: false,
        },
        updateSuccess: true,
        charts: payload.data,
        forms: [],
        categories: [],
      });
    });

    it('should set form list', () => {
      const payload = { data: [{ id: 'F1' }] };
      const previousState = { ...initialState, forms: [{ id: 'F0' }] };
      expect(
        reducer(previousState, {
          type: getFormList.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...previousState,
        loading: {
          patient: false,
          chart: false,
          form: false,
        },
        updateSuccess: true,
        forms: [...previousState.forms, ...payload.data],
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({});
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches FETCH_PATIENT_INFO actions', async () => {
      const expectedActions = [{ type: getPatientInfo.pending.type }, { type: getPatientInfo.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getPatientInfo('P100'));
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });

    it('dispatches FETCH_CHART_LIST actions', async () => {
      const expectedActions = [{ type: getChartList.pending.type }, { type: getChartList.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getChartList({ ptNo: 'P100', term: '100' }));
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });

    it('dispatches FETCH_FORM_LIST actions', async () => {
      const expectedActions = [{ type: getFormList.pending.type }, { type: getFormList.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getFormList({ query: 'FORM_QUERY' }));
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });

    it('dispatches RESET actions', async () => {
      const expectedActions = [reset()];
      await store.dispatch(reset());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
