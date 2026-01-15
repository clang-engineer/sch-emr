import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import React from 'react';

const EmrContentEmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#90a4ae',
      }}
    >
      <FontAwesomeIcon icon={['fas', 'folder-open']} style={{ fontSize: '4rem', color: '#cfd8dc', marginBottom: '16px' }} />
      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500, color: '#78909c', mb: 0.5 }}>
        조회된 기록이 없습니다
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#90a4ae' }}>
        좌측 검색 조건을 선택하여 환자 기록을 조회하세요
      </Typography>
    </Box>
  );
};

export default EmrContentEmptyState;
