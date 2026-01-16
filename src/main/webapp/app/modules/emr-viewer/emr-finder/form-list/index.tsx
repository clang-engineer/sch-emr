import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import EmptyState from '../empty-state';
import { Chart } from 'app/modules/emr-viewer/emr-finder.reducer';

interface FormNode {
  id: string;
  name: string;
  type: 'folder' | 'form';
  date?: string;
  sortKeys?: {
    first?: number;
    second?: number;
    third?: number;
  };
  children?: FormNode[];
}

interface TreeItemProps {
  node: FormNode;
  level: number;
  selectedIds: string[];
  onSelect: (node: FormNode) => void;
  expanded: string[];
  onToggle: (id: string) => void;
}

const TreeItemComponent: React.FC<TreeItemProps> = ({ node, level, selectedIds, onSelect, expanded, onToggle }) => {
  const isExpanded = expanded.includes(node.id);
  const isSelected = node.type === 'form' && selectedIds.includes(node.id);

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggle(node.id);
    } else {
      onSelect(node);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 1 + level * 2,
          py: 0.4,
          minHeight: 'unset',
          bgcolor: isSelected ? '#e3f2fd' : 'transparent',
          '&:hover': {
            bgcolor: isSelected ? '#e3f2fd' : '#f5f5f5',
          },
        }}
      >
        {node.type === 'folder' && (
          <Box
            sx={{
              mr: 0.6,
              width: 14,
              height: 14,
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 120ms ease',
            }}
          >
            <FontAwesomeIcon
              icon={['fas', 'caret-right']}
              style={{
                fontSize: '0.75rem',
                color: '#607d8b',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 120ms ease',
              }}
            />
          </Box>
        )}
        <ListItemIcon sx={{ minWidth: 'unset', mr: 0.8 }}>
          {node.type === 'folder' ? (
            isExpanded ? (
              <FontAwesomeIcon icon={['fas', 'folder-open']} style={{ fontSize: '1rem', color: '#ff9800' }} />
            ) : (
              <FontAwesomeIcon icon={['fas', 'folder']} style={{ fontSize: '1rem', color: '#ff9800' }} />
            )
          ) : (
            <FontAwesomeIcon icon={['fas', 'file-alt']} style={{ fontSize: '1rem', color: '#1976d2' }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          secondary={node.type === 'form' ? node.date ?? '' : undefined}
          primaryTypographyProps={{
            sx: {
              fontSize: '0.8rem',
              color: '#37474f',
              fontWeight: node.type === 'folder' ? 600 : 400,
            },
          }}
          secondaryTypographyProps={{
            sx: {
              fontSize: '0.7rem',
              color: '#90a4ae',
              lineHeight: 1.2,
            },
          }}
        />
      </ListItemButton>
      {node.type === 'folder' && node.children && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map(child => (
              <TreeItemComponent
                key={child.id}
                node={child}
                level={level + 1}
                selectedIds={selectedIds}
                onSelect={onSelect}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

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
    if (!forms.length || !selectedChart) {
      return [];
    }

    const hasItemIndexSeq = forms.some(form => form.ITEMINDXSEQ !== undefined && form.ITEMINDXSEQ !== null);
    const parseSort = (value: unknown) => {
      const numberValue = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
      return Number.isFinite(numberValue) ? numberValue : undefined;
    };
    const normalized = (
      hasItemIndexSeq
        ? forms.map(form => ({
            id: String(form.ITEMINDXSEQ ?? ''),
            parentId: form.SUPITEMINDXSEQ && form.SUPITEMINDXSEQ !== 0 ? String(form.SUPITEMINDXSEQ) : null,
            name: form.INDXNM && form.INDXNM !== '-' ? form.INDXNM : form.FORMNM ?? '',
            type: form.LEVL === '1' || form.LEVL === 1 ? 'folder' : 'form',
            date: form.RECDD ?? '',
            sortKeys: {
              first: parseSort(form.FIRSTSORTNO),
              second: parseSort(form.SECONDSORTNO),
              third: parseSort(form.THIRDSORTNO),
            },
          }))
        : forms
            .filter(form => (form.chartNo ? selectedChart.chartNo === form.chartNo : false))
            .map(form => ({
              id: String(form.formNo ?? ''),
              parentId: form.parentFormNo ? String(form.parentFormNo) : null,
              name: form.name ?? '',
              type: form.type === 'folder' ? 'folder' : 'form',
              date: (form as { RECDD?: string }).RECDD ?? '',
            }))
    ).filter(form => form.id && form.name);

    const nodes = new Map<string, FormNode>();
    normalized.forEach(form => {
      nodes.set(form.id, {
        id: form.id,
        name: form.name,
        type: form.type,
        date: form.date,
        sortKeys: form.sortKeys,
        children: [],
      });
    });

    const roots: FormNode[] = [];
    normalized.forEach(form => {
      const node = nodes.get(form.id);
      if (!node) {
        return;
      }
      if (!form.parentId || !nodes.has(form.parentId)) {
        roots.push(node);
        return;
      }
      const parent = nodes.get(form.parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      }
    });

    const sortNodes = (items: FormNode[]) => {
      items.sort((a, b) => {
        if (a.sortKeys?.first !== undefined || b.sortKeys?.first !== undefined) {
          return (a.sortKeys?.first ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.first ?? Number.MAX_SAFE_INTEGER);
        }
        if (a.sortKeys?.second !== undefined || b.sortKeys?.second !== undefined) {
          return (a.sortKeys?.second ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.second ?? Number.MAX_SAFE_INTEGER);
        }
        if (a.sortKeys?.third !== undefined || b.sortKeys?.third !== undefined) {
          return (a.sortKeys?.third ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.third ?? Number.MAX_SAFE_INTEGER);
        }
        return a.name.localeCompare(b.name, 'ko-KR');
      });
      items.forEach(item => {
        if (item.children?.length) {
          sortNodes(item.children);
        }
      });
    };
    sortNodes(roots);

    return roots;
  }, [forms, selectedChart]);

  const formNodeMap = useMemo(() => {
    const map = new Map<string, FormNode>();
    const walk = (nodes: FormNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'form') {
          map.set(node.id, node);
        }
        if (node.children?.length) {
          walk(node.children);
        }
      });
    };
    walk(formData);
    return map;
  }, [formData]);

  useEffect(() => {
    setSearchTerm('');
    setSelectedForms([]);
  }, [selectedChart?.chartNo]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredFormData = useMemo<FormNode[]>(() => {
    if (!normalizedSearch) {
      return formData;
    }

    const filterNodes = (nodes: FormNode[]): FormNode[] =>
      nodes.reduce<FormNode[]>((acc, node) => {
        const nameMatch = node.name.toLowerCase().includes(normalizedSearch);
        const dateMatch = node.date ? String(node.date).toLowerCase().includes(normalizedSearch) : false;
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        if (nameMatch || dateMatch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }
        return acc;
      }, []);

    return filterNodes(formData);
  }, [formData, normalizedSearch]);

  const allFolderIds = useMemo(() => {
    const ids: string[] = [];
    const walk = (nodes: FormNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'folder') {
          ids.push(node.id);
          if (node.children?.length) {
            walk(node.children);
          }
        }
      });
    };
    walk(formData);
    return ids;
  }, [formData]);

  const filteredFolderIds = useMemo(() => {
    const ids: string[] = [];
    const walk = (nodes: FormNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'folder') {
          ids.push(node.id);
          if (node.children?.length) {
            walk(node.children);
          }
        }
      });
    };
    walk(filteredFormData);
    return ids;
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
      {/* 트리 영역 */}
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
                description={normalizedSearch ? '검색어에 맞는 서식이 없습니다.' : '선택된 기록의 서식이 없습니다.'}
              />
            </Box>
          ) : (
            <List component="nav" disablePadding>
              {filteredFormData.map(node => (
                <TreeItemComponent
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
                <FontAwesomeIcon icon={['fad', 'circle-xmark']} style={{ fontSize: '0.8rem', color: '#546e7a' }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="전체 열기" placement="top">
            <span>
              <IconButton size="small" onClick={handleExpandAll} disabled={effectiveFolderIds.length === 0 || normalizedSearch.length > 0}>
                <FontAwesomeIcon icon={['fad', 'square-caret-down']} style={{ fontSize: '0.8rem', color: '#546e7a' }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="전체 닫기" placement="top">
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
