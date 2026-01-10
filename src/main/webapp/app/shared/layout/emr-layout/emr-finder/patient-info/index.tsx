import React from 'react';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const inputFieldStyle = {
    width: '100%',
    maxWidth: '100%',
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff',
      fontSize: '0.8rem',
      // minHeight: '30px',
      width: '100%',
      '& fieldset': {
        borderColor: '#1976d2',
      },
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '5px 10px',
      fontWeight: 500,
      fontSize: '0.8rem',
      '&::placeholder': {
        fontSize: '0.75rem',
        opacity: 0.7,
      },
    },
  };

  const readOnlyFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#f8f9fa',
      fontSize: '0.8rem',
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '6px 10px',
      color: '#37474f',
    },
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

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>등록번호</Typography>
            <Box sx={infoTextStyle}>-</Box>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>성명</Typography>
            <Box sx={infoTextStyle}>-</Box>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>성별/나이</Typography>
            <Box sx={infoTextStyle}>-</Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>주민번호</Typography>
            <Box sx={infoTextStyle}>-</Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={fieldBoxStyle}>
            <Typography sx={fieldLabelStyle}>진료부서</Typography>
            <Box sx={infoTextStyle}>-</Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfo;
