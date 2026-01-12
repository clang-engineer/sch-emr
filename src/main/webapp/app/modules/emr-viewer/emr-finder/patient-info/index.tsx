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
  const patientName = patient?.name ?? '-';
  const patientGender = patient?.sex ?? '-';
  const patientAge = patient?.age ?? '-';
  const residentNumber = patient?.residentNo1 + '-' + '*******' ?? '-';

  const renderValue = (value: string | number) => (loading ? '조회중...' : value);
  const renderInitial = () => (loading ? '...' : initial);

  const fieldLabelStyle = {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#78909c',
    mb: 0.3,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const fieldBoxStyle = {
    mb: 0.5,
    width: '100%',
  };

  const infoTextStyle = {
    fontSize: '0.85rem',
    color: '#263238',
    fontWeight: 600,
    lineHeight: 1.3,
  };

  const summaryName = patientName !== '-' ? patientName : '환자 정보';
  const summaryNumber = patientNumber !== '-' ? patientNumber : '미지정';
  const initial = patientName && patientName !== '-' ? patientName.charAt(0) : '?';

  if (!loading && !patient) {
    return <EmptyState icon="user" title="조회된 환자 없음" description="등록번호로 환자를 검색해주세요." />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        px: 2.5,
        py: 1.5,
        borderRadius: '12px',
        border: '1px solid #eceff1',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        maxWidth: '950px',
        margin: '0 auto',
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
      <Grid container>
        <Grid size={5} sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #eceff1', pr: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                mr: 2,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              }}
            >
              {renderInitial()}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#263238', lineHeight: 1.3, mb: 0.3 }}>
                {renderValue(summaryName)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={7} container spacing={1} sx={{ pl: 2.5 }}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfo;
