import React from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormNode } from './types';

interface TreeItemProps {
  node: FormNode;
  level: number;
  selectedIds: string[];
  onSelect: (node: FormNode) => void;
  expanded: string[];
  onToggle: (id: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({ node, level, selectedIds, onSelect, expanded, onToggle }) => {
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
              <TreeItem
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

export default TreeItem;
