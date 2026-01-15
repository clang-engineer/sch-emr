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
      <IconButton size="small" onClick={toggleSidebar} sx={{ color: '#ffffff' }}>
        {isCollapsed ? <IconLayoutSidebarLeftExpand size={18} /> : <IconLayoutSidebarLeftCollapse size={18} />}
      </IconButton>
    </Tooltip>
  );
};

export default FinderToggleButton;
