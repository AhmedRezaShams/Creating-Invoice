// components/CommonRichText.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const CommonRichText = ({
  label,
  value,
  onChange,
  placeholder,
  showOnPdf = false,
  enabled = true,
  onShowOnPdfChange,
  onEnabledChange,
  maxLength = 2500,
  minRows = 4,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onShowOnPdfChange && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnPdf}
                  onChange={(e) => {
                    e.stopPropagation();
                    onShowOnPdfChange(e.target.checked);
                  }}
                  size="small"
                />
              }
              label="Show on PDF/email"
              onClick={(e) => e.stopPropagation()}
              sx={{ mr: 0 }}
            />
          )}
          {onEnabledChange && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    onEnabledChange(e.target.checked);
                  }}
                  size="small"
                />
              }
              label="Enabled"
              onClick={(e) => e.stopPropagation()}
              sx={{ mr: 0 }}
            />
          )}
          <IconButton size="small">
            {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={minRows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            variant="outlined"
            inputProps={{ maxLength }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, textAlign: 'right' }}
          >
            {value.length}/{maxLength} characters • Markdown supported
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommonRichText;