// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Backdrop,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';

// assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setViewMode } from 'app/modules/emr-viewer/emr-layout.reducer';
import { VIEW_MODE_ACTIONS } from 'app/modules/emr-viewer/view-mode';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

interface HeaderProps {
  variant?: 'full' | 'compact';
}

const Header = ({ variant = 'full' }: HeaderProps) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const isCompact = variant === 'compact';
  const iconColor = '#ffffff';

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const viewMode = useAppSelector(state => state.emrLayout.viewMode);
  const dispatch = useAppDispatch();

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, value: number | null) => {
    if (value) {
      dispatch(setViewMode(value));
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #3f51b5 0%, #4e5fd4 55%, #5c6bc0 100%)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 6px 16px rgba(48, 63, 159, 0.25)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: isCompact ? 'center' : 'space-between',
          minHeight: '48px !important',
          px: isCompact ? 1 : 2,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          <FontAwesomeIcon icon={['fas', 'book-medical']} size="lg" style={{ color: iconColor }} />
          {!isCompact && !matchDownMd && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: '#ffffff',
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.18)',
              }}
            >
              의무기록조회
            </Typography>
          )}
        </Box>

        {!isCompact && (
          <Box display="flex" alignItems="center" gap={2} sx={{ flex: 1, justifyContent: 'flex-end' }}>
            {user && (
              <Box display="flex" alignItems="center" gap={2}>
                <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 2 }} open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  {user.fullName}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={1}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="emr view mode"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: iconColor,
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    color: iconColor,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {VIEW_MODE_ACTIONS.map(action => (
                  <Tooltip key={action.mode} title={action.label}>
                    <ToggleButton value={action.mode} aria-label={action.label}>
                      {action.icon}
                    </ToggleButton>
                  </Tooltip>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Box>
        )}
      </Toolbar>
    </Box>
  );
};

export default Header;
