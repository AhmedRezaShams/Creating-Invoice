// components/CommonSection.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Popover, 
  Tooltip 
} from '@mui/material';
import { IconHelpCircle } from '@tabler/icons-react';

const CommonSection = ({ 
  title, 
  subtitle, 
  children, 
  learnMoreText, // New prop for popup content
  sx = {} 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'learn-more-popover' : undefined;

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', ...sx }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            {title && (
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 0 }}>
                {title}
              </Typography>
            )}
            {learnMoreText && (
              <>
                <Tooltip title="Learn more">
                  <IconButton
                    aria-describedby={id}
                    onClick={handleClick}
                    size="small"
                    sx={{ 
                      mt: -0.5, 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    <IconHelpCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: { 
                      maxWidth: 300,
                      p: 2 
                    }
                  }}
                >
                  <Typography variant="body2">
                    {learnMoreText}
                  </Typography>
                </Popover>
              </>
            )}
          </Box>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Paper>
  );
};

export default CommonSection;