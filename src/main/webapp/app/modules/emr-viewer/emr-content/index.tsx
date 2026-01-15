import { Box, Grid, Paper } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import * as React from 'react';
import { cardAnimation, viewModeGridAnimation } from './animation';
import EmrContentEmptyState from './emr-content-empty-state';
import EmrViewModeDial from './emr-view-mode-dail';
import { sampleHtmlItems } from './sample-html-items';

const EmrContent = () => {
  const htmlItems = useAppSelector(state => state.emrContent.items);
  const { drawerOpen, viewMode } = useAppSelector(state => state.emrLayout);
  const prevViewModeRef = React.useRef(viewMode);
  const shouldAnimateViewMode = prevViewModeRef.current !== viewMode;

  const displayItems = htmlItems.length ? htmlItems : sampleHtmlItems;
  const gridSize = viewMode === 4 ? 3 : viewMode === 2 ? 6 : 12;

  React.useEffect(() => {
    prevViewModeRef.current = viewMode;
  }, [viewMode]);

  return (
    <Box display={'flex'} justifyContent={'center'}>
      {/* 사이드바 토글 버튼 */}

      {/* 메인 콘텐츠 영역 */}
      <Grid
        key={viewMode}
        container
        spacing={2}
        p={3}
        justifyContent={'center'}
        flexDirection={'row'}
        sx={{
          ...(shouldAnimateViewMode ? viewModeGridAnimation : {}),
        }}
      >
        {displayItems.length > 0 ? (
          displayItems.map((item, index) => (
            <Grid
              key={item.id}
              size={gridSize}
              sx={{
                maxWidth: viewMode === 1 ? (drawerOpen ? '100%' : '60vw') : '100%',
                transition: shouldAnimateViewMode ? 'flex-basis 220ms ease, max-width 220ms ease, width 220ms ease' : 'none',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #e3e8f5',
                  borderRadius: 2,
                  ...(shouldAnimateViewMode ? cardAnimation(index) : {}),
                }}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <EmrContentEmptyState />
          </Grid>
        )}
      </Grid>
      <EmrViewModeDial />
    </Box>
  );
};

export default EmrContent;
