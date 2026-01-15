import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export interface ArticleHtmlItem {
  id: string;
  html: string;
  createdAt?: string;
}

interface ArticleHtmlListProps {
  items: ArticleHtmlItem[];
  emptyMessage?: string;
}

const ArticleHtmlList: React.FC<ArticleHtmlListProps> = ({ items, emptyMessage = 'No articles available.' }) => {
  if (!items.length) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map(item => (
        <Paper key={item.id} elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          {item.createdAt && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {item.createdAt}
            </Typography>
          )}
          <Box
            component="article"
            sx={{
              '& img': { maxWidth: '100%', height: 'auto' },
              '& table': { width: '100%', borderCollapse: 'collapse' },
              '& th, & td': { border: '1px solid #e0e0e0', padding: '4px 8px' },
            }}
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default ArticleHtmlList;
