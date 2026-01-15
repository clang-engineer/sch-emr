import { Box, IconButton, Tooltip } from '@mui/material';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import * as React from 'react';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import { openDrawer } from 'app/modules/emr-viewer/emr-layout.reducer';

const FinderToggleButton = () => {
  const dispatch = useAppDispatch();

  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const isCollapsed = !drawerOpen;
  const finderWidth = drawerOpen ? finderWidthNarrow : finderWidthCollapsed;

  const toggleSidebar = () => {
    dispatch(openDrawer(isCollapsed));
  };

  const left = React.useMemo(() => {
    let result = finderWidth;

    if (drawerOpen) {
      result += 68;
    } else {
      result += 48;
    }
    return result;
  }, [finderWidth, drawerOpen]);

  return (
    <Box position={'fixed'} top={58} left={left} display={'flex'} flexDirection={'column'} sx={{ zIndex: 10 }}>
      <Tooltip title={isCollapsed ? '기록지 목록 조회 화면을 펼칩니다.' : '기록지 목록 조회 화면을 접습니다.'} placement={'right'}>
        <IconButton onClick={toggleSidebar}>{isCollapsed ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}</IconButton>
      </Tooltip>
    </Box>
  );
};

export default FinderToggleButton;
