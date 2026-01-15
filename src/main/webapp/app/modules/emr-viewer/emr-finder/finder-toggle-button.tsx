import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
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
          top: '35%',
          right: -32,
          transform: 'translateY(-50%)',
          width: 32,
          height: 48,
          borderRadius: '0 12px 12px 0',
          backgroundColor: '#f3f6ff',
          color: '#3f51b5',
          border: '0',
          boxShadow: 'inset 0 0 0 1px rgba(63, 81, 181, 0.12)',
          zIndex: 0,
          '&:hover': {
            backgroundColor: '#e7ecfb',
          },
        }}
      >
        <FontAwesomeIcon
          icon={(isCollapsed ? ['fad', 'triple-chevrons-right'] : ['fad', 'triple-chevrons-left']) as unknown as IconProp}
          size={'xs'}
        />
      </IconButton>
    </Tooltip>
  );
};

export default FinderToggleButton;
