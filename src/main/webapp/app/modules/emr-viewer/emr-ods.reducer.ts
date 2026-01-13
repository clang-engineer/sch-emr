import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { CATEGORY_QUERY_META, FORM_QUERY_META } from './emr-finder/emr-finder.constant';

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
  chartNo: string;
  label: string;
  code: string;
  inDate?: string;
  outDate?: number;
  department?: string;
  doctor?: string;
  ptNo?: string;
  [key: string]: unknown;
}

// "INDXNM","FORMNM","ITEMINDXSEQ","SUPITEMINDXSEQ","CNT","EMRFLAG","RECKIND","SIGNNO","LISFLAG","LEVL","SECONDSORTNO","FIRSTSORTNO","THIRDSORTNO"
// 핵의학검체검사 결과보고서,핵의학검체검사 결과보고서,152750,0,1,E,LIS,0,,1,8,102,99999999999
// -,핵의학검체검사 결과보고서,152753,152750,1,E,LIS,10000000000800004098,,2,9999999999,9999999999,10
export interface Form {
  INDXNM?: string;
  FORMNM?: string;
  ITEMINDXSEQ?: string;
  SUPITEMINDXSEQ?: number;
  CNT?: string;
  EMRFLAG?: string;
  RECKIND?: string;
  SIGNNO?: string;
  LISFLAG?: string;
  LEVL?: string;
  SECONDSORTNO?: string;
  FIRSTSORTNO?: string;
  THIRDSORTNO?: string;
  [key: string]: unknown;
}

interface EmrOdsState {
  loading: boolean;
  errorMessage: string | null;
  patient: Patient | null;
  charts: Chart[];
  forms: Form[];
  categories: Record<string, string>[];
  updateSuccess: boolean;
}

const initialState: EmrOdsState = {
  loading: false,
  errorMessage: null,
  patient: null,
  charts: [],
  forms: [],
  categories: [],
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
  async (data: { ptNo: string; term: string }) => {
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
  async ({ query }: { query: string }) => {
    const requestUrl = `${apiUrl}`;

    const payload = {
      key: query,
      map: null,
    };
    return axios.post<Form[]>(requestUrl, cleanEntity(payload));
  },
  { serializeError: serializeAxiosError }
);

export const fetchCategoryForms = createAsyncThunk(
  'emr-ods/fetch_category_forms',
  async ({ chart, ptNo }: { chart: Chart; ptNo: string }) => {
    const categoryMatches = CATEGORY_QUERY_META.filter(m => m.code.toLowerCase() === chart.code.toLowerCase());
    const categoryData = await Promise.all(
      categoryMatches.map(async meta => {
        const payload = {
          key: meta.query,
          map: {
            ptNo,
            inDate: chart.inDate,
            outDate: chart.outDate,
          },
        };
        const { data } = await axios.post<Record<string, string>[]>(apiUrl, cleanEntity(payload));
        return { query: meta.query, data: data?.[0] ?? {} };
      })
    );

    const keysWithY = new Set(categoryData.flatMap(({ data }) => Object.keys(data).filter(key => data[key] === 'Y')));
    const formQueries = FORM_QUERY_META.filter(meta => keysWithY.has(meta.code));
    const formResponses = await Promise.all(
      formQueries.map(meta => {
        const payload = {
          key: meta.query,
          map: null,
        };
        return axios.post<Form[]>(apiUrl, cleanEntity(payload));
      })
    );

    return {
      categoryData,
      forms: formResponses.flatMap(response => response.data ?? []),
    };
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
        state.charts = [];
        state.forms = [];
        state.categories = [];
        state.updateSuccess = true;
      })
      .addCase(getChartList.fulfilled, (state, action) => {
        state.loading = false;
        state.charts = action.payload.data;
        state.forms = [];
        state.categories = [];
        state.updateSuccess = true;
      })
      .addCase(getFormList.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = [...state.forms, ...(action.payload.data ?? [])];
        state.updateSuccess = true;
      })
      .addCase(fetchCategoryForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = [...state.forms, ...(action.payload.forms ?? [])];
        state.categories = action.payload.categoryData.map(item => item.data);
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getPatientInfo, getChartList, getFormList, fetchCategoryForms), state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addMatcher(isRejected(getPatientInfo, getChartList, getFormList, fetchCategoryForms), (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message ?? null;
      })
      .addMatcher(isFulfilled(getPatientInfo, getChartList, getFormList, fetchCategoryForms), state => {
        state.loading = false;
      });
  },
});

export const { reset } = emrOds.actions;

export default emrOds.reducer;
