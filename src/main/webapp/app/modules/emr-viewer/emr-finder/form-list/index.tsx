import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Box, IconButton, InputAdornment, List, TextField, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import EmptyState from '../empty-state';
import { Chart } from 'app/modules/emr-viewer/emr-finder.reducer';
import TreeItem from './TreeItem';
import { FormNode } from './types';
import { buildFormNodeMap, buildTree, collectFolderIds, filterTree, normalizeForms, sortTree } from './tree-utils';

interface FormListProps {
  selectedChart?: Chart;
}

const FormList: React.FC<FormListProps> = ({ selectedChart }) => {
  const [selectedForms, setSelectedForms] = useState<FormNode[]>([]);
  const [expanded, setExpanded] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { forms, loading: loadingState } = useAppSelector(state => state.emrFinder);
  const selectedFormIds = useMemo(() => selectedForms.map(form => form.id), [selectedForms]);
  const formLoading = loadingState.form;

  const formData = useMemo<FormNode[]>(() => {
    const normalized = normalizeForms(forms, selectedChart);
    const roots = buildTree(normalized);
    sortTree(roots);
    return roots;
  }, [forms, selectedChart]);

  const formNodeMap = useMemo(() => {
    return buildFormNodeMap(formData);
  }, [formData]);

  useEffect(() => {
    setSearchTerm('');
    setSelectedForms([]);
  }, [selectedChart?.chartNo]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredFormData = useMemo<FormNode[]>(() => {
    return filterTree(formData, normalizedSearch);
  }, [formData, normalizedSearch]);

  const allFolderIds = useMemo(() => {
    return collectFolderIds(formData);
  }, [formData]);

  const filteredFolderIds = useMemo(() => {
    return collectFolderIds(filteredFormData);
  }, [filteredFormData]);

  const handleSelect = (node: FormNode) => {
    if (node.type !== 'form') {
      return;
    }
    setSelectedForms(prev => {
      const exists = prev.some(item => item.id === node.id);
      if (exists) {
        return prev.filter(item => item.id !== node.id);
      }
      return [...prev, formNodeMap.get(node.id) ?? node];
    });
  };

  const handleToggle = (nodeId: string) => {
    setExpanded(prev => (prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]));
  };

  const handleExpandAll = () => {
    setExpanded(allFolderIds);
  };

  const handleCollapseAll = () => {
    setExpanded([]);
  };

  const handleClearSelection = () => {
    setSelectedForms([]);
  };

  const showEmpty = !formLoading && filteredFormData.length === 0;
  const effectiveExpanded = normalizedSearch ? filteredFolderIds : expanded;
  const effectiveFolderIds = normalizedSearch ? filteredFolderIds : allFolderIds;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 리스트 영역 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            bgcolor: '#fff',
            mb: 0.4,
          }}
        >
          {showEmpty ? (
            <Box sx={{ p: 2 }}>
              <EmptyState
                icon="file-alt"
                title={normalizedSearch ? '검색 결과 없음' : '서식 없음'}
                description={normalizedSearch ? '검색어에 맞는 서식이 없습니다.' : '선택한 기록에 서식이 없습니다.'}
              />
            </Box>
          ) : (
            <List component="nav" disablePadding>
              {filteredFormData.map(node => (
                <TreeItem
                  key={node.id}
                  node={node}
                  level={0}
                  selectedIds={selectedFormIds}
                  onSelect={handleSelect}
                  expanded={effectiveExpanded}
                  onToggle={handleToggle}
                />
              ))}
            </List>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="서식 검색"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={['fas', 'search']} style={{ fontSize: '0.8rem', color: '#90a4ae' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')} aria-label="검색어 지우기">
                    <FontAwesomeIcon icon={['fas', 'times-circle']} style={{ fontSize: '0.8rem', color: '#90a4ae' }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
            sx={{
              '& .MuiInputBase-root': {
                height: 28,
                fontSize: '0.75rem',
                px: 0.5,
              },
              '& .MuiInputBase-input': {
                py: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0,0,0,0.15)',
              },
            }}
          />
          <Tooltip title="선택 해제" placement="top">
            <span>
              <IconButton size="small" onClick={handleClearSelection} disabled={selectedFormIds.length === 0}>
                <Badge
                  badgeContent={selectedFormIds.length}
                  invisible={selectedFormIds.length === 0}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  sx={{
                    '& .MuiBadge-badge': {
                      minWidth: 12,
                      height: 12,
                      fontSize: '0.6rem',
                      padding: '0 3px',
                      bgcolor: '#1976d2',
                      color: '#fff',
                      transform: 'scale(0.9) translate(70%, -70%)',
                    },
                  }}
                >
                  <FontAwesomeIcon icon={['fad', 'circle-xmark']} style={{ fontSize: '0.8rem', color: '#546e7a' }} />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="전체 펼치기" placement="top">
            <span>
              <IconButton size="small" onClick={handleExpandAll} disabled={effectiveFolderIds.length === 0 || normalizedSearch.length > 0}>
                <FontAwesomeIcon icon={['fad', 'square-caret-down']} style={{ fontSize: '0.8rem', color: '#546e7a' }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="전체 접기" placement="top">
            <span>
              <IconButton
                size="small"
                onClick={handleCollapseAll}
                disabled={effectiveFolderIds.length === 0 || normalizedSearch.length > 0}
              >
                <FontAwesomeIcon icon={['fad', 'square-caret-up']} style={{ fontSize: '0.8rem', color: '#546e7a' }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default FormList;
