// SELECT MAX(decode(a, 'N', 'Y', 'N')) n		-- 방사면역
// 	     , MAX(decode(b, 'M', 'Y', 'N')) m		-- 미생물
// 	     , MAX(decode(c, 'L', 'Y', 'N')) l		-- 진검
// 	     , MAX(decode(d, 'P', 'Y', 'N')) p		-- 병리
//
//   		SELECT MAX(decode(a, 'E', 'Y', 'N')) e		-- 영상
//      , MAX(decode(b, 'F', 'Y', 'N')) f		-- 내시경
//      , MAX(decode(c, 'G', 'Y', 'N')) g		-- 기능
//      , MAX(decode(d, 'H', 'Y', 'N')) h		-- 핵의학
const FORM_QUERY_META = [
  {
    code: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT_1',
  },
  {
    code: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT_2',
  },
  {
    code: 'I',
    query: 'SELECT_CATEGORY_INPATIENT_1',
  },
  {
    code: 'I',
    query: 'SELECT_CATEGORY_INPATIENT_2',
  },
  {
    code: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY_1',
  },
  {
    code: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY_2',
  },
];

const FORM_DETAIL_QUERY_META = [];

export { FORM_QUERY_META, FORM_DETAIL_QUERY_META };
