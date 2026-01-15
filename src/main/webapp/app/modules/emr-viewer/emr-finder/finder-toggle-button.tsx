import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { openDrawer } from 'app/modules/emr-viewer/emr-layout.reducer';

const FinderToggleButton = () => {
  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const isCollapsed = !drawerOpen;

  const toggleSidebar = () => {
    dispatch(openDrawer(isCollapsed));
  };

  return (
    <Tooltip title={isCollapsed ? 'Expand finder' : 'Collapse finder'} placement="left">
      <IconButton
        size="small"
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: '30%',
          right: -26,
          transform: 'translateY(-50%)',
          width: 28,
          height: 40,
          borderRadius: '0 12px 12px 0',
          backgroundColor: '#f3f6ff',
          color: '#3f51b5',
          border: '1px solid rgba(63, 81, 181, 0.2)',
          borderLeft: 'none',
          boxShadow: 'none',
          zIndex: 0,
          '&:hover': {
            backgroundColor: '#e7ecfb',
          },
        }}
      >
        {isCollapsed ? <IconLayoutSidebarLeftExpand size={18} /> : <IconLayoutSidebarLeftCollapse size={18} />}
      </IconButton>
    </Tooltip>
  );
};

export default FinderToggleButton;
