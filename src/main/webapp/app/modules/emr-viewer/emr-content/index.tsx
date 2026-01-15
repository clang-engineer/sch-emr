import { Box, Grid, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setViewMode } from 'app/modules/emr-viewer/emr-layout.reducer';
import * as React from 'react';
import EmrContentEmptyState from './emr-content-empty-state';
import FinderToggleButton from './finder-toggle-button';
import { sampleArticleHtml } from './sample-article-html';

const sampleHtmlItems = [
  {
    id: 'sample-1',
    html: sampleArticleHtml,
    createdAt: '2024-01-12',
  },
  {
    id: 'sample-2',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-3',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-1',
    html: sampleArticleHtml,
    createdAt: '2024-01-12',
  },
  {
    id: 'sample-2',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-3',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-1',
    html: sampleArticleHtml,
    createdAt: '2024-01-12',
  },
  {
    id: 'sample-2',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-3',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
];

const EmrContent = () => {
  const htmlItems = useAppSelector(state => state.emrContent.items);
  const { drawerOpen, viewMode } = useAppSelector(state => state.emrLayout);
  const dispatch = useAppDispatch();

  const displayItems = htmlItems.length ? htmlItems : sampleHtmlItems;
  const gridSize = viewMode === 4 ? 3 : viewMode === 2 ? 6 : 12;
  const viewModeActions = [
    { mode: 1, label: '1장 보기', icon: <FontAwesomeIcon icon={['fas', 'book-open']} size="sm" /> },
    { mode: 2, label: '2장 보기', icon: <FontAwesomeIcon icon={['fas', 'columns']} size="sm" /> },
    { mode: 4, label: '4장 보기', icon: <FontAwesomeIcon icon={['fas', 'grid']} size="sm" /> },
  ];

  return (
    <Box display={'flex'} justifyContent={'center'}>
      {/* 사이드바 토글 버튼 */}
      <FinderToggleButton />

      {/* 메인 콘텐츠 영역 */}
      <Grid container spacing={2} p={5} justifyContent={'center'} flexDirection={'row'}>
        {displayItems.length > 0 ? (
          displayItems.map(item => (
            <Grid
              key={item.id}
              size={gridSize}
              sx={{
                maxWidth: viewMode === 1 ? (drawerOpen ? '100%' : '60vw') : '100%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
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
      <SpeedDial
        ariaLabel="view mode"
        sx={{
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
        }}
        icon={<SpeedDialIcon icon={<FontAwesomeIcon icon={['fas', 'grid']} size="sm" />} />}
        FabProps={{ size: 'small' }}
      >
        {viewModeActions.map(action => (
          <SpeedDialAction
            key={action.mode}
            icon={action.icon}
            tooltipTitle={action.label}
            FabProps={{ size: 'small' }}
            sx={{
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
            }}
            onClick={() => dispatch(setViewMode(action.mode))}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default EmrContent;
