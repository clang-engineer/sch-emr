// material-ui
import { styled } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import EmrFinder from './emr-finder';

// assets
import * as React from 'react';
import RexSidebar from 'app/modules/emr-viewer/rex-sidebar/RexSidebar';
import { useAppSelector } from 'app/config/store';

import './style.scss';
import { finderWidthNarrow, finderWidthWide } from 'app/modules/emr-viewer/constant';
import EmrContent from 'app/modules/emr-viewer/emr-content';
import Header from './Header';

interface MainStyleProps {
  open: boolean;
  layout: string;
  finderwidth: number;
}

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<MainStyleProps>(({ theme, open, layout, finderwidth }) => ({
  ...theme.typography.body1,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  padding: '0 40px',
  marginTop: '54px',
  height: 'calc(100vh - 48px)',
  overflowX: 'scroll',
  overflowY: 'scroll',
  backgroundColor: '#f5f5f5',
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter + 200,
    }),
    width: `calc(100vh - 48px - 40px)`,
    marginLeft: `-${finderwidth - 20}px`,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter + 200,
    }),
    width: `calc(100% - ${finderwidth}px - 48px - 40px)`,
    marginLeft: '20px',
    [theme.breakpoints.down('md')]: {
      marginLeft: `${-(finderwidth - 40 - 48)}px`,
    },
  }),
  ...((finderwidth === finderWidthNarrow || finderwidth === finderWidthWide) && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard + 200,
    }),
  }),
}));

// ==============================|| MAIN LAYOUT ||============================== //

const EmrViewer = () => {
  const theme = useTheme();

  const { finderWidth } = useAppSelector(state => state.emrLayout);
  const { drawerOpen } = useAppSelector(state => state.emrLayout);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ background: theme.palette.background.default, ml: '48px', zIndex: 1 }}
      >
        <Header />
      </AppBar>
      <CssBaseline />

      {/* Common Layout */}
      <RexSidebar />

      {/* App Sidebar */}
      <EmrFinder />

      {/* main content */}
      <Main open={drawerOpen} finderwidth={finderWidth}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <EmrContent />
        </Box>
      </Main>
    </Box>
  );
};

export default EmrViewer;
