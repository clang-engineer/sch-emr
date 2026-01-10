// material-ui
import { styled } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';

// project imports
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

// theme constant

// assets
import * as React from 'react';
import CommonLayout from 'app/shared/layout/emr-layout/rex-sidebar/CommonLayout';
import { useAppSelector } from 'app/config/store';

import './style.scss';
import { finderWidthNarrow, finderWidthWide } from 'app/shared/layout/emr-layout/constant';

interface MainStyleProps {
  open: boolean;
  layout: string;
  finderwidth: number;
}

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<MainStyleProps>(({ theme, open, layout, finderwidth }) => ({
  ...theme.typography.body1,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  padding: '20px 40px',
  marginTop: '48px',
  height: 'calc(100vh - 48px)',
  overflowX: 'scroll',
  overflowY: 'scroll',
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

const MainLayout = () => {
  const { finderWidth } = useAppSelector(state => state.emrLayout);
  const { drawerOpen } = useAppSelector(state => state.emrLayout);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Common Layout */}
      <CommonLayout />

      {/* App Sidebar */}
      <Sidebar />

      {/* main content */}
      <Main open={drawerOpen} finderwidth={finderWidth}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
