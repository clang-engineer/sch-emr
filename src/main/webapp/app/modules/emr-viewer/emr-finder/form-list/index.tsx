import React, { useMemo, useState } from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';

interface FormNode {
  id: string;
  name: string;
  type: 'folder' | 'form';
  children?: FormNode[];
}

interface TreeItemProps {
  node: FormNode;
  level: number;
  selected: string;
  onSelect: (id: string) => void;
  expanded: string[];
  onToggle: (id: string) => void;
}

const TreeItemComponent: React.FC<TreeItemProps> = ({ node, level, selected, onSelect, expanded, onToggle }) => {
  const isExpanded = expanded.includes(node.id);
  const isSelected = selected === node.id;

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggle(node.id);
    } else {
      onSelect(node.id);
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
          <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
            {isExpanded ? (
              <FontAwesomeIcon icon={['fas', 'chevron-down']} style={{ fontSize: '1.2rem', color: '#546e7a' }} />
            ) : (
              <FontAwesomeIcon icon={['fas', 'chevron-right']} style={{ fontSize: '1.2rem', color: '#546e7a' }} />
            )}
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
          primaryTypographyProps={{
            sx: {
              fontSize: '0.8rem',
              color: '#37474f',
              fontWeight: node.type === 'folder' ? 600 : 400,
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
                selected={selected}
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
  selectedChartNos?: number[];
}

const FormList: React.FC<FormListProps> = ({ selectedChartNos = [] }) => {
  const [selected, setSelected] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>(['1', '2', '3', '4', '5']);
  const { forms, loading } = useAppSelector(state => state.emrContent);

  const formData = useMemo<FormNode[]>(() => {
    if (!forms.length || selectedChartNos.length === 0) {
      return [];
    }

    const normalized = forms
      .filter(form => (form.chartNo ? selectedChartNos.includes(form.chartNo) : false))
      .map(form => ({
        id: String(form.formNo ?? ''),
        parentId: form.parentFormNo ? String(form.parentFormNo) : null,
        name: form.name ?? '',
        type: form.type === 'folder' ? 'folder' : 'form',
      }))
      .filter(form => form.id && form.name);

    const nodes = new Map<string, FormNode>();
    normalized.forEach(form => {
      nodes.set(form.id, { id: form.id, name: form.name, type: form.type, children: [] });
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
      items.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
      items.forEach(item => {
        if (item.children?.length) {
          sortNodes(item.children);
        }
      });
    };
    sortNodes(roots);

    return roots;
  }, [forms, selectedChartNos]);

  const handleSelect = (nodeId: string) => {
    setSelected(nodeId);
  };

  const handleToggle = (nodeId: string) => {
    setExpanded(prev => (prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]));
  };

  const showEmpty = !loading && formData.length === 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 트리 영역 */}
      <Box sx={{ flex: 1, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', bgcolor: '#fff' }}>
        {showEmpty ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#90a4ae' }}>선택된 기록의 서식이 없습니다.</Typography>
          </Box>
        ) : (
          <List component="nav" disablePadding>
            {formData.map(node => (
              <TreeItemComponent
                key={node.id}
                node={node}
                level={0}
                selected={selected}
                onSelect={handleSelect}
                expanded={expanded}
                onToggle={handleToggle}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default FormList;
