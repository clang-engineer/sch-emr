import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery, Typography } from '@mui/material';
// import { openDrawer } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { openDrawer, setFinderWidthAction, setViewModeAction } from 'app/modules/emr-viewer/emr-layout.reducer';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmrFinder from './form';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const { finderWidth } = useAppSelector(state => state.emrLayout);

  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isCollapsed = finderWidth === finderWidthCollapsed;

  const handleExpand = React.useCallback(() => {
    dispatch(setFinderWidthAction(finderWidthNarrow));
    dispatch(setViewModeAction('single'));
  }, [dispatch]);

  // 접힌 상태 UI
  const collapsedView = React.useMemo(
    () => (
      <Box
        onClick={handleExpand}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f7fa',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          gap: 3,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        }}
      >
        {/* 아이콘들 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'search']} style={{ fontSize: '1rem' }} />
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1976d2',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'filter']} style={{ fontSize: '1rem' }} />
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1976d2',
            }}
          >
            <FontAwesomeIcon icon={['fas', 'list']} style={{ fontSize: '1rem' }} />
          </Box>
        </Box>
      </Box>
    ),
    [handleExpand]
  );

  const drawer = React.useMemo(() => (isCollapsed ? collapsedView : <EmrFinder />), [isCollapsed, collapsedView]);

  return (
    <Box component="nav" sx={{ width: finderWidth, height: 'calc(100vh - 48px)', mt: '48px', ml: '48px' }} aria-label="record finder">
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={true}
        onClose={() => dispatch(openDrawer(!drawerOpen))}
        sx={{
          '& .MuiDrawer-paper': {
            zIndex: 1,
            position: 'fixed',
            top: '48px',
            left: '48px',
            width: finderWidth,
            height: 'calc(100vh - 48px)',
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            borderRight: 'none',
            overflow: 'visible',
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default React.memo(Sidebar);
