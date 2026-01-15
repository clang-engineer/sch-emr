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
          top: '40%',
          right: -32,
          transform: 'translateY(-50%)',
          width: 32,
          height: 48,
          borderRadius: '0 12px 12px 0',
          background: 'linear-gradient(180deg, #f7f9ff 0%, #eef3ff 100%)',
          color: '#3f51b5',
          border: '0',
          boxShadow: 'inset 0 0 0 1px rgba(63, 81, 181, 0.08)',
          zIndex: 0,
          '&:hover': {
            background: 'linear-gradient(180deg, #f1f5ff 0%, #e6edff 100%)',
          },
        }}
      >
        <FontAwesomeIcon icon={(isCollapsed ? ['fad', 'chevrons-right'] : ['fad', 'chevrons-left']) as unknown as IconProp} size={'xs'} />
      </IconButton>
    </Tooltip>
  );
};

export default FinderToggleButton;
