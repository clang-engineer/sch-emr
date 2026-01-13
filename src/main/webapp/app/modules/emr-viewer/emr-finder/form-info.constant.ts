// SELECT MAX(decode(a, 'N', 'Y', 'N')) n		-- 방사면역
// 	     , MAX(decode(b, 'M', 'Y', 'N')) m		-- 미생물
// 	     , MAX(decode(c, 'L', 'Y', 'N')) l		-- 진검
// 	     , MAX(decode(d, 'P', 'Y', 'N')) p		-- 병리
//
//   		SELECT MAX(decode(a, 'E', 'Y', 'N')) e		-- 영상
//      , MAX(decode(b, 'F', 'Y', 'N')) f		-- 내시경
//      , MAX(decode(c, 'G', 'Y', 'N')) g		-- 기능
//      , MAX(decode(d, 'H', 'Y', 'N')) h		-- 핵의학
const category = [
  {
    type: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT_1',
  },
  {
    type: 'O',
    query: 'SELECT_CATEGORY_OUTPATIENT_2',
  },
  {
    type: 'I',
    query: 'SELECT_CATEGORY_INPATIENT_1',
  },
  {
    type: 'I',
    query: 'SELECT_CATEGORY_INPATIENT_2',
  },
  {
    type: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY_1',
  },
  {
    type: 'E',
    query: 'SELECT_CATEGORY_EMERGENCY_2',
  },
];

const form = [];
