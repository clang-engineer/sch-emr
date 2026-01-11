import React from 'react';
import { Box, IconButton, InputAdornment, TextField, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import EmptyState from '../empty-state';

interface PatientSearchProps {
  onSearch: (patientId: string) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ onSearch }) => {
  const [patientId, setPatientId] = React.useState('');

  const handleSearch = () => {
    if (patientId.trim()) {
      onSearch(patientId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const inputFieldStyle = {
    width: '180px',
    '& .MuiInput-root': {
      fontSize: '0.75rem',
      '&:before': {
        borderBottom: '1px solid #1976d2',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid #1976d2',
      },
      '&:after': {
        borderBottom: '2px solid #1976d2',
      },
    },
    '& .MuiInput-input': {
      padding: '4px 0',
      fontWeight: 500,
      fontSize: '0.75rem',
      color: '#1976d2',
      textAlign: 'center',
      '&::placeholder': {
        fontSize: '0.75rem',
        opacity: 0.6,
        color: '#1976d2',
        textAlign: 'center',
      },
    },
  };

  return (
    <TextField
      variant="standard"
      placeholder="환자 등록번호 입력 후 검색"
      value={patientId}
      onChange={e => setPatientId(e.target.value)}
      onKeyPress={handleKeyPress}
      sx={inputFieldStyle}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" edge="end" sx={{ color: '#1976d2', padding: '2px' }} onClick={handleSearch}>
              <FontAwesomeIcon icon={['fas', 'search']} style={{ fontSize: '1rem' }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const PatientInfo = () => {
  const { patient, loading } = useAppSelector(state => state.emrContent);

  const patientNumber = patient?.ptNo ?? '-';
  const patientName = patient?.patientName ?? '-';
  const patientGender = patient?.gender ?? '-';
  const patientAge = patient?.age ?? '-';
  const residentNumber = patient?.residentNumber ?? '-';
  const department = patient?.department ?? '-';

  const renderValue = (value: string | number) => (loading ? '조회중...' : value);
  const renderInitial = () => (loading ? '...' : initial);

  const fieldLabelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#546e7a',
    mb: 0.3,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const fieldBoxStyle = {
    mb: 0.5,
    width: '100%',
    overflow: 'hidden',
  };

  const infoTextStyle = {
    fontSize: '0.8rem',
    color: '#37474f',
    bgcolor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    px: 1.2,
    py: 0.7,
    minHeight: '30px',
    display: 'flex',
    alignItems: 'center',
  };

  const summaryName = patientName !== '-' ? patientName : '환자 정보';
  const summaryNumber = patientNumber !== '-' ? patientNumber : '미지정';
  const summaryDepartment = department !== '-' ? department : '부서 미지정';
  const initial = patientName && patientName !== '-' ? patientName.charAt(0) : '?';

  if (!loading && !patient) {
    return <EmptyState icon="user" title="조회된 환자 없음" description="등록번호로 환자를 검색해주세요." />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        px: 1.5,
        py: 1.2,
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <CircularProgress size={26} thickness={4} sx={{ color: '#1976d2' }} />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          mb: 1.4,
          pb: 1,
          borderBottom: '1px solid #eef2f5',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: '#1976d2',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {renderInitial()}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#263238', lineHeight: 1.2 }}>
            {renderValue(summaryName)}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#607d8b' }}>
            {renderValue(summaryNumber)} · {renderValue(summaryDepartment)}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>등록번호</Typography>
            <Box sx={infoTextStyle}>{renderValue(patientNumber)}</Box>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>성명</Typography>
            <Box sx={infoTextStyle}>{renderValue(patientName)}</Box>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>성별/나이</Typography>
            <Box sx={infoTextStyle}>{renderValue(`${patientGender}/${patientAge}`)}</Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>주민번호</Typography>
            <Box sx={infoTextStyle}>{renderValue(residentNumber)}</Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>진료부서</Typography>
            <Box sx={infoTextStyle}>{renderValue(department)}</Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfo;
