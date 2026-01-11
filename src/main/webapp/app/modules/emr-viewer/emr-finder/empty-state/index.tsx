import React from 'react';
import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        px: 2,
        py: 3,
        borderRadius: '8px',
        border: '1px dashed #cfd8dc',
        bgcolor: '#fafafa',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          bgcolor: '#e3f2fd',
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesomeIcon icon={['fas', icon]} style={{ fontSize: '1.2rem' }} />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#455a64', mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: '#90a4ae' }}>{description}</Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;
