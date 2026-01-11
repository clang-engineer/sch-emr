import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import reducer, { getFormList, getPatientInfo, getRecordList, reset } from './emr-content.reducer';

describe('Emr content reducer tests', () => {
  const initialState = {
    loading: false,
    errorMessage: null,
    patientInfo: null,
    records: [],
    forms: [],
    updateSuccess: false,
  };

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: false,
      errorMessage: null,
      updateSuccess: false,
    });
    expect(state.patientInfo).toBeNull();
    expect(state.records).toEqual([]);
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
    it('should set state to loading', () => {
      testMultipleTypes([getPatientInfo.pending.type, getRecordList.pending.type, getFormList.pending.type], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          loading: true,
        });
      });
    });

    it('should reset the state', () => {
      expect(reducer({ ...initialState, loading: true }, reset())).toEqual({
        ...initialState,
      });
    });
  });

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [getPatientInfo.rejected.type, getRecordList.rejected.type, getFormList.rejected.type],
        'some message',
        state => {
          expect(state).toMatchObject({
            errorMessage: 'error message',
            updateSuccess: false,
            loading: false,
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
      const payload = { data: { id: 'P100', name: 'Sample Patient' } };
      expect(
        reducer(undefined, {
          type: getPatientInfo.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        updateSuccess: true,
        patientInfo: payload.data,
      });
    });

    it('should set record list', () => {
      const payload = { data: [{ id: 'R1' }, { id: 'R2' }] };
      expect(
        reducer(undefined, {
          type: getRecordList.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        updateSuccess: true,
        records: payload.data,
      });
    });

    it('should set form list', () => {
      const payload = { data: [{ id: 'F1' }] };
      expect(
        reducer(undefined, {
          type: getFormList.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        updateSuccess: true,
        forms: payload.data,
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches FETCH_PATIENT_INFO actions', async () => {
      const expectedActions = [{ type: getPatientInfo.pending.type }, { type: getPatientInfo.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getPatientInfo('P100'));
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });

    it('dispatches FETCH_RECORD_LIST actions', async () => {
      const expectedActions = [{ type: getRecordList.pending.type }, { type: getRecordList.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getRecordList({ patientId: 'P100' }));
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });

    it('dispatches FETCH_FORM_LIST actions', async () => {
      const expectedActions = [{ type: getFormList.pending.type }, { type: getFormList.fulfilled.type, payload: resolvedObject }];
      await store.dispatch(getFormList({ recordId: 'R1' }));
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
