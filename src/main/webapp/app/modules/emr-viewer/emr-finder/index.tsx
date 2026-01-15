import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';
// import { openDrawer } from 'store/slices/menu';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { openDrawer } from 'app/modules/emr-viewer/emr-layout.reducer';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import EmrFinder from './main';
import CollapsedSidebar from './collapsed-sidebar';
import Header from 'app/modules/emr-viewer/Header';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const finderWidth = drawerOpen ? finderWidthNarrow : finderWidthCollapsed;

  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isCollapsed = !drawerOpen;

  const handleExpand = React.useCallback(() => {
    dispatch(openDrawer(true));
  }, [dispatch]);

  const drawer = React.useMemo(() => {
    const content = isCollapsed ? <CollapsedSidebar onExpand={handleExpand} /> : <EmrFinder />;

    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Header variant={isCollapsed ? 'compact' : 'full'} />
        <Box sx={{ flex: 1, minHeight: 0 }}>{content}</Box>
      </Box>
    );
  }, [isCollapsed, handleExpand]);

  return (
    <Box component="nav" sx={{ width: finderWidth, height: '100vh', mt: 0 }} aria-label="record finder">
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={matchUpMd ? true : drawerOpen}
        onClose={() => dispatch(openDrawer(false))}
        sx={{
          '& .MuiDrawer-paper': {
            zIndex: 1,
            position: 'fixed',
            top: 0,
            left: 0,
            width: finderWidth,
            height: '100vh',
            backgroundColor: '#f5f6f8',
            boxShadow: 'inset 2px 0 0 rgba(63, 81, 181, 0.2)',
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
