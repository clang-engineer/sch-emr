// material-ui
import { styled } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';

import EmrFinder from './emr-finder';

// assets
import * as React from 'react';
import { useAppSelector } from 'app/config/store';

import './style.scss';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import EmrContent from 'app/modules/emr-viewer/emr-content';

interface MainStyleProps {
  open: boolean;
  finderwidth: number;
}

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' && prop !== 'finderwidth' })<MainStyleProps>(
  ({ theme, open, finderwidth }) => ({
    ...theme.typography.body1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: '0 40px',
    marginTop: 0,
    height: '100vh',
    overflowX: 'scroll',
    overflowY: 'scroll',
    backgroundColor: '#f7f7f7',
    ...(!open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter + 200,
      }),
      width: `calc(100vw - 40px)`,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter + 200,
      }),
      width: `calc(100% - ${finderwidth}px)`,
      [theme.breakpoints.down('md')]: {
        marginLeft: `${-(finderwidth - 40)}px`,
      },
    }),
    ...(finderwidth === finderWidthNarrow && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.standard + 200,
      }),
    }),
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const EmrViewer = () => {
  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const finderWidth = drawerOpen ? finderWidthNarrow : finderWidthCollapsed;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Common Layout */}
      {/* <RexSidebar />
       */}

      {/* App Sidebar */}
      <EmrFinder />

      {/* main content */}
      <Main open={drawerOpen} finderwidth={finderWidth}>
        <EmrContent />
      </Main>
    </Box>
  );
};

export default EmrViewer;
