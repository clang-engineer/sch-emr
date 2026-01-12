import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

import { cleanEntity } from 'app/shared/util/entity-utils';

export interface Patient {
  id?: number;
  ptNo?: string;
  name?: string;
  sex?: string;
  age?: number;
  residentNo1?: string;
  residentNo2?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface Chart {
  chartNo?: number;
  ptNo?: string;
  chartDate?: string;
  chartTime?: string;
  visitType?: string;
  department?: string;
  doctorName?: string;
  content?: string;
  createdAt?: string;
  patientName?: string;
  [key: string]: unknown;
}

export interface Form {
  formNo?: string;
  parentFormNo?: string;
  ptNo?: string;
  chartNo?: number;
  name?: string;
  type?: string;
  recordData?: string;
  createdAt?: string;
  patientName?: string;
  [key: string]: unknown;
}

interface EmrOdsState {
  loading: boolean;
  errorMessage: string | null;
  patient: Patient | null;
  charts: Chart[];
  forms: Form[];
  updateSuccess: boolean;
}

const initialState: EmrOdsState = {
  loading: false,
  errorMessage: null,
  patient: null,
  charts: [],
  forms: [],
  updateSuccess: false,
};

const apiUrl = 'api/ods';

const SELECT_PATIENT = 'SELECT_PATIENT';
const SELECT_CHART_LIST = 'SELECT_CHART_LIST';
const SELECT_FORM_LIST = 'SELECT_FORM_LIST';

export const getPatientInfo = createAsyncThunk(
  'emr-ods/fetch_patient',
  async (ptNo: string) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: SELECT_PATIENT,
      map: {
        ptNo,
      },
    };

    return axios.post<Patient[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);

export const getChartList = createAsyncThunk(
  'emr-ods/fetch_record_list',
  async (data: { ptNo: string; startDate: string; endDate: string }) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: SELECT_CHART_LIST,
      map: data,
    };

    return axios.post<Chart[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);
export const getFormList = createAsyncThunk(
  'emr-ods/fetch_form_list',
  async ({ chartNos }: { chartNos: Array<string | number> }) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: SELECT_FORM_LIST,
      map: {
        chartNos,
      },
    };
    return axios.post<Form[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);

const emrOds = createSlice({
  name: 'emr-ods',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPatientInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload.data?.[0] ?? null;
        state.updateSuccess = true;
      })
      .addCase(getChartList.fulfilled, (state, action) => {
        state.loading = false;
        state.charts = action.payload.data;
        state.updateSuccess = true;
      })
      .addCase(getFormList.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.data;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getPatientInfo, getChartList, getFormList), state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addMatcher(isRejected(getPatientInfo, getChartList, getFormList), (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message ?? null;
      })
      .addMatcher(isFulfilled(getPatientInfo, getChartList, getFormList), state => {
        state.loading = false;
      });
  },
});

export const { reset } = emrOds.actions;

export default emrOds.reducer;
