import React from 'react';

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import { setViewMode } from '../emr-layout.reducer';
import { ViewMode, VIEW_MODE_ACTIONS } from 'app/modules/emr-viewer/view-mode';

const dialSx = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 1300,
  '& .MuiFab-root': {
    width: 44,
    height: 44,
    minHeight: 44,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
  },
};

const actionSx = {
  '& .MuiFab-root': {
    width: 36,
    height: 36,
    minHeight: 36,
    bgcolor: 'background.paper',
    color: 'primary.main',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
  },
  '& .MuiSpeedDialAction-staticTooltipLabel': {
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: '1px solid',
    borderColor: 'divider',
    fontSize: '0.75rem',
    fontWeight: 600,
    py: 0.25,
    px: 1,
    borderRadius: 1,
  },
};

const EmrViewModeDial = () => {
  const dispatch = useAppDispatch();
  const gridIcon = VIEW_MODE_ACTIONS.find(action => action.mode === 4)?.icon ?? VIEW_MODE_ACTIONS[0].icon;
  const handleViewModeClick = React.useCallback(
    (mode: ViewMode) => {
      dispatch(setViewMode(mode));
    },
    [dispatch]
  );

  return (
    <SpeedDial ariaLabel="view mode" sx={dialSx} icon={<SpeedDialIcon icon={gridIcon} />} FabProps={{ size: 'small' }}>
      {VIEW_MODE_ACTIONS.map(action => (
        <SpeedDialAction
          key={action.mode}
          icon={action.icon}
          tooltipTitle={action.label}
          FabProps={{ size: 'small' }}
          sx={actionSx}
          onClick={() => handleViewModeClick(action.mode)}
        />
      ))}
    </SpeedDial>
  );
};

export default React.memo(EmrViewModeDial);
