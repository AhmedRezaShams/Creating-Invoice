// components/CommonSection.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CommonSection = ({ title, subtitle, children, sx = {} }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', ...sx }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
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