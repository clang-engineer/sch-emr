import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

import { cleanEntity } from 'app/shared/util/entity-utils';

export interface Patient {
  id?: string;
  name?: string;
  gender?: string;
  age?: number;
  residentNo?: string;
  department?: string;
  [key: string]: unknown;
}

export interface Chart {
  id: string;
  patientName: string;
  patientId: string;
  recordType: string;
  recordDate: string;
  department: string;
  doctor: string;
  status?: string;
  [key: string]: unknown;
}

export interface Form {
  id: string;
  name: string;
  code?: string;
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

export const getPatientInfo = createAsyncThunk(
  'emr-ods/fetch_patient',
  async (ptNo: string) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: 'patient_by_number',
      map: {
        patientNumber: ptNo,
      },
    };

    return axios.post<Patient[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);

export const getChartList = createAsyncThunk(
  'emr-ods/fetch_record_list',
  async (patientNumber: string) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: 'chart_by_patient',
      map: {
        patientNumber,
      },
    };

    return axios.post<Chart[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);

export const getFormList = createAsyncThunk(
  'emr-ods/fetch_form_list',
  async ({ patientId, chartId }: { patientId?: string | number; chartId?: string | number }) => {
    const requestUrl = `${apiUrl}`;

    if (chartId !== undefined && chartId !== null) {
      const payload = {
        key: 'record_by_chart',
        map: {
          chartId,
        },
      };
      return axios.post<Form[]>(requestUrl, cleanEntity(payload));
    }

    if (patientId !== undefined && patientId !== null) {
      const payload = {
        key: 'record_by_patient',
        map: {
          patientId,
        },
      };
      return axios.post<Form[]>(requestUrl, cleanEntity(payload));
    }

    throw new Error('patientId or chartId is required');
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
