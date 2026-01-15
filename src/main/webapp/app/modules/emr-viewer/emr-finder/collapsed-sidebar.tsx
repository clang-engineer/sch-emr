import * as React from 'react';
import { Box, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FinderToggleButton from './finder-toggle-button';

interface CollapsedSidebarProps {
  onExpand: () => void;
}

const CollapsedSidebar: React.FC<CollapsedSidebarProps> = ({ onExpand }) => {
  return (
    <Box
      onClick={onExpand}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f6f8',
        borderRight: '2px solid rgba(63, 81, 181, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4,
        gap: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          backgroundColor: '#eef1fb',
          borderRightColor: '#3f51b5',
          '& .icon-container': {
            transform: 'scale(1.05)',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: '-2px',
          top: 0,
          width: '2px',
          height: '100%',
          background: 'linear-gradient(180deg, #3f51b5 0%, #5c6bc0 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::after': {
          opacity: 1,
        },
      }}
    >
      <FinderToggleButton />
      {/* 상단 힌트 */}
      <Box
        sx={{
          width: '24px',
          height: '4px',
          backgroundColor: '#8d9ad1',
          borderRadius: '2px',
          mb: 1,
        }}
      />

      {/* 아이콘들 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
        }}
      >
        <Tooltip title="환자 검색" placement="right" arrow>
          <Box
            className="icon-container"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'search']} size={'sm'} />
          </Box>
        </Tooltip>

        <Tooltip title="필터 조건" placement="right" arrow>
          <Box
            className="icon-container"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#e3e8f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3f51b5',
              transition: 'all 0.2s ease',
              border: '1px solid #c0cae6',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'filter']} size={'sm'} />
          </Box>
        </Tooltip>

        <Tooltip title="기록 목록" placement="right" arrow>
          <Box
            className="icon-container"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#e3e8f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3f51b5',
              transition: 'all 0.2s ease',
              border: '1px solid #c0cae6',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'list']} size={'sm'} />
          </Box>
        </Tooltip>
      </Box>

      {/* 하단 펼치기 힌트 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <FontAwesomeIcon icon={['fas', 'chevron-right']} size={'sm'} style={{ color: '#3f51b5' }} />
        <Box
          sx={{
            width: '2px',
            height: '20px',
            backgroundColor: '#8d9ad1',
            borderRadius: '1px',
          }}
        />
      </Box>
    </Box>
  );
};

export default CollapsedSidebar;
