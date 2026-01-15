// material-ui
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
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

import axios from 'axios';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const viewMode = useAppSelector(state => state.emrLayout.viewMode);
  const dispatch = useAppDispatch();

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, value: number | null) => {
    if (value) {
      dispatch(setViewMode(value));
    }
  };

  const handleSignOutClick = () => {
    axios.post('api/user/singn-out').finally(() => {});

    // signOut()
    //     .unwrap()
    //     .then(() => (window.location.href = UrlUtils.getIdpUrl(profile)));
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '48px !important', px: 3, ml: '48px' }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={() => (window.location.href = 'https://deview.snuh.org/')}
        >
          <FontAwesomeIcon icon={['fas', 'book-medical']} size="lg" style={{ color: '#3f51b5' }} />
          {!matchDownMd && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'text.primary',
              }}
            >
              진료기록조회
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <ToggleButtonGroup size="small" exclusive value={viewMode} onChange={handleViewModeChange} aria-label="emr view mode">
            {VIEW_MODE_ACTIONS.map(action => (
              <Tooltip key={action.mode} title={action.label}>
                <ToggleButton value={action.mode} aria-label={action.label}>
                  {action.icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 2 }} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                }}
              >
                {user.fullName}
              </Typography>
              <IconButton
                onClick={handleSignOutClick}
                size="small"
                sx={{
                  color: '#3f51b5',
                  '&:hover': { bgcolor: theme.palette.action.hover },
                }}
              >
                <FontAwesomeIcon icon={['fas', 'right-from-bracket']} style={{ fontSize: '18px', color: '#3f51b5' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
