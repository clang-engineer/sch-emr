import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';
// import { openDrawer } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { openDrawer, setFinderWidthAction, setViewModeAction } from 'app/modules/emr-viewer/emr-layout.reducer';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import EmrFinder from './main';
import CollapsedSidebar from './collapsed-sidebar';

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

  const drawer = React.useMemo(
    () => (isCollapsed ? <CollapsedSidebar onExpand={handleExpand} /> : <EmrFinder />),
    [isCollapsed, handleExpand]
  );

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
