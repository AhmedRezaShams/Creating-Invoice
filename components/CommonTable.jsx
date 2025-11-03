// components/CommonTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';

const CommonTable = ({
  columns,
  data,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  showSelectAll = false,
}) => {
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {selectable && (
              <TableCell padding="checkbox">
                {showSelectAll && (
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                )}
              </TableCell>
            )}
            {columns.map((column, index) => (
              <TableCell
                key={index}
                align={column.align || 'left'}
                sx={{ fontWeight: 600, color: '#666' }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => {
              const isSelected = selectedRows.some(
                (selected) => selected.id === row.id
              );

              return (
                <TableRow
                  key={row.id || rowIndex}
                  hover
                  sx={{
                    cursor: selectable ? 'pointer' : 'default',
                    backgroundColor: isSelected ? '#f0f7ff' : 'transparent',
                  }}
                  onClick={() => selectable && onSelectRow && onSelectRow(row)}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} align={column.align || 'left'}>
                      {column.render
                        ? column.render(row, rowIndex)
                        : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;








