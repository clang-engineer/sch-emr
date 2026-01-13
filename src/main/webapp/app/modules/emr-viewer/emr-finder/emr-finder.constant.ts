//O: 응급, I: 입원, E: 외래
interface ICategory {
  code: 'O' | 'I' | 'E';
  query: string;
}
const CATEGORY_QUERY_META: ICategory[] = [
  {
    code: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT1',
  },
  {
    code: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT2',
  },
  {
    code: 'I',
    query: 'SELECT_CATEGORY_INPATIENT1',
  },
  {
    code: 'I',
    query: 'SELECT_CATEGORY_INPATIENT2',
  },
  {
    code: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY1',
  },
  {
    code: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY2',
  },
];

// SELECT MAX(decode(a, 'N', 'Y', 'N')) n		-- 방사면역
// 	     , MAX(decode(b, 'M', 'Y', 'N')) m		-- 미생물
// 	     , MAX(decode(c, 'L', 'Y', 'N')) l		-- 진검
// 	     , MAX(decode(d, 'P', 'Y', 'N')) p		-- 병리
//
//   		SELECT MAX(decode(a, 'E', 'Y', 'N')) e		-- 영상
//      , MAX(decode(b, 'F', 'Y', 'N')) f		-- 내시경
//      , MAX(decode(c, 'G', 'Y', 'N')) g		-- 기능
//      , MAX(decode(d, 'H', 'Y', 'N')) h		-- 핵의학

interface IForm {
  code: 'N' | 'M' | 'L' | 'P' | 'E' | 'F' | 'G' | 'H';
  query: string;
}

const FORM_QUERY_META: IForm[] = [
  { code: 'N', query: 'SELECT_FORM_N' },
  { code: 'M', query: 'SELECT_FORM_M' },
  { code: 'L', query: 'SELECT_FORM_L' },
  { code: 'P', query: 'SELECT_FORM_P' },
  { code: 'E', query: 'SELECT_FORM_E' },
  { code: 'F', query: 'SELECT_FORM_F' },
  { code: 'G', query: 'SELECT_FORM_G' },
  { code: 'H', query: 'SELECT_FORM_H' },
];

export { FORM_QUERY_META, CATEGORY_QUERY_META };
