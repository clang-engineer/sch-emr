import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const FormList = () => {
  const [selected, setSelected] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [expanded, setExpanded] = useState<string[]>(['1', '2', '3', '4', '5']);

  // 샘플 데이터
  const formData: FormNode[] = [
    {
      id: '1',
      name: '진료기록',
      type: 'folder',
      children: [
        { id: '1-1', name: '초진기록지', type: 'form' },
        { id: '1-2', name: '경과기록지', type: 'form' },
        { id: '1-3', name: '퇴원요약지', type: 'form' },
      ],
    },
    {
      id: '2',
      name: '수술기록',
      type: 'folder',
      children: [
        { id: '2-1', name: '수술기록지', type: 'form' },
        { id: '2-2', name: '마취기록지', type: 'form' },
        { id: '2-3', name: '수술동의서', type: 'form' },
      ],
    },
    {
      id: '3',
      name: '검사기록',
      type: 'folder',
      children: [
        { id: '3-1', name: '혈액검사 결과지', type: 'form' },
        { id: '3-2', name: '영상검사 판독지', type: 'form' },
        { id: '3-3', name: '병리검사 결과지', type: 'form' },
      ],
    },
    {
      id: '4',
      name: '간호기록',
      type: 'folder',
      children: [
        { id: '4-1', name: '간호정보조사지', type: 'form' },
        { id: '4-2', name: '간호경과기록지', type: 'form' },
        { id: '4-3', name: 'V/S 기록지', type: 'form' },
      ],
    },
    {
      id: '5',
      name: '동의서',
      type: 'folder',
      children: [
        { id: '5-1', name: '입원동의서', type: 'form' },
        { id: '5-2', name: '개인정보 제공동의서', type: 'form' },
        { id: '5-3', name: '진료정보 열람동의서', type: 'form' },
      ],
    },
  ];

  const handleSelect = (nodeId: string) => {
    setSelected(nodeId);
  };

  const handleToggle = (nodeId: string) => {
    setExpanded(prev => (prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 트리 영역 */}
      <Box sx={{ flex: 1, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', bgcolor: '#fff' }}>
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
      </Box>
    </Box>
  );
};

export default FormList;
