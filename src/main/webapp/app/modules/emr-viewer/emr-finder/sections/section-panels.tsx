import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AccordionSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  expanded: boolean;
  onChange: () => void;
  headerContent?: React.ReactNode;
  contentHeight?: number;
}

export const AccordionSection = React.forwardRef<HTMLDivElement, AccordionSectionProps>(
  ({ title, color, children, expanded, onChange, headerContent, contentHeight }, ref) => {
    return (
      <Box ref={ref} ml={1} mr={1} mt={0.5} mb={0} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            onClick={onChange}
            sx={{
              bgcolor: '#f8f9fa',
              borderBottom: expanded ? '2px solid #1976d2' : 'none',
              px: 1.5,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 3, height: 14, bgcolor: color, borderRadius: '2px' }} />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  fontSize: '0.8rem',
                  color: '#37474f',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
              <FontAwesomeIcon
                icon={['fas', expanded ? 'chevron-up' : 'chevron-down']}
                style={{ fontSize: '0.75rem', color: '#546e7a', marginLeft: '4px' }}
              />
            </Box>
            {headerContent && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={event => event.stopPropagation()}>
                {headerContent}
              </Box>
            )}
          </Box>
          {expanded && <Box sx={{ p: 1.5, height: contentHeight ? `${contentHeight}px` : 'auto', overflow: 'auto' }}>{children}</Box>}
        </Paper>
      </Box>
    );
  }
);

AccordionSection.displayName = 'AccordionSection';

interface ResizableSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  height: number;
  isLast?: boolean;
  isFirst?: boolean;
  onResize?: (delta: number) => void;
  headerContent?: React.ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
}

export const ResizableSection: React.FC<ResizableSectionProps> = ({
  title,
  color,
  children,
  height,
  isLast = false,
  isFirst = false,
  onResize,
  headerContent,
  disabled = false,
  disabledMessage,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef<number>(0);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (isLast) return;
    setIsDragging(true);
    startYRef.current = event.clientY;
    event.preventDefault();
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientY - startYRef.current;
      startYRef.current = event.clientY;
      onResize?.(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box ml={1.5} mt={isFirst ? 1.5 : 0.5} mb={0} sx={{ height: `${height}px`, display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: '#e0e0e0',
            borderRadius: '4px',
            bgcolor: '#ffffff',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #1976d2',
              px: 1.5,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box
                sx={{
                  width: 3,
                  height: 14,
                  bgcolor: color,
                  borderRadius: '2px',
                }}
              />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  fontSize: '0.8rem',
                  color: '#37474f',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
            </Box>
            {headerContent && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{headerContent}</Box>}
          </Box>
          <Box sx={{ p: 1.5, flex: 1, overflow: 'auto', position: 'relative' }}>
            {children}
            {disabled && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  zIndex: 10,
                }}
              >
                <FontAwesomeIcon icon={['fas', 'lock']} style={{ fontSize: '2rem', color: '#90a4ae' }} />
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#546e7a',
                    textAlign: 'center',
                  }}
                >
                  {disabledMessage || '비활성화됨'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      {!isLast && (
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            height: '12px',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDragging ? '#90caf9' : 'transparent',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: '#e3f2fd',
            },
          }}
        >
          <FontAwesomeIcon icon={['fas', 'grip-lines']} className="drag-icon" style={{ fontSize: '0.7rem', color: '#90a4ae' }} />
        </Box>
      )}
    </Box>
  );
};
