import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

export interface EmrPatientInfo {
  id?: string;
  name?: string;
  gender?: string;
  age?: number;
  residentNo?: string;
  department?: string;
  [key: string]: unknown;
}

export interface EmrRecordSummary {
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

export interface EmrFormSummary {
  id: string;
  name: string;
  code?: string;
  [key: string]: unknown;
}

interface EmrContentState {
  loading: boolean;
  errorMessage: string | null;
  patientInfo: EmrPatientInfo | null;
  records: EmrRecordSummary[];
  forms: EmrFormSummary[];
  updateSuccess: boolean;
}

const initialState: EmrContentState = {
  loading: false,
  errorMessage: null,
  patientInfo: null,
  records: [],
  forms: [],
  updateSuccess: false,
};

const apiUrl = 'api/emr';

export const getPatientInfo = createAsyncThunk(
  'emr-content/fetch_patient',
  async (patientId: string) => {
    const requestUrl = `${apiUrl}/patients/${patientId}`;
    return axios.get<EmrPatientInfo>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const getRecordList = createAsyncThunk(
  'emr-content/fetch_record_list',
  async ({ patientId, params }: { patientId: string; params?: Record<string, unknown> }) => {
    const requestUrl = `${apiUrl}/patients/${patientId}/records`;
    return axios.get<EmrRecordSummary[]>(requestUrl, { params });
  },
  { serializeError: serializeAxiosError }
);

export const getFormList = createAsyncThunk(
  'emr-content/fetch_form_list',
  async ({ patientId, recordId, params }: { patientId?: string; recordId?: string; params?: Record<string, unknown> }) => {
    const requestUrl = recordId
      ? `${apiUrl}/records/${recordId}/forms`
      : patientId
      ? `${apiUrl}/patients/${patientId}/forms`
      : `${apiUrl}/forms`;
    return axios.get<EmrFormSummary[]>(requestUrl, { params });
  },
  { serializeError: serializeAxiosError }
);

const emrContent = createSlice({
  name: 'emr-content',
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
        state.patientInfo = action.payload.data;
        state.updateSuccess = true;
      })
      .addCase(getRecordList.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.updateSuccess = true;
      })
      .addCase(getFormList.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.data;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getPatientInfo, getRecordList, getFormList), state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addMatcher(isRejected(getPatientInfo, getRecordList, getFormList), (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message ?? null;
      })
      .addMatcher(isFulfilled(getPatientInfo, getRecordList, getFormList), state => {
        state.loading = false;
      });
  },
});

export const { reset } = emrContent.actions;

export default emrContent.reducer;
