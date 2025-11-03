// pages/invoice/create/Setup.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Button,
} from '@mui/material';
import { IconSearch, IconCheck } from '@tabler/icons-react';

import CommonSection from '@/components/CommonSection';
import CommonTable from '@/components/CommonTable';
import { clearAllProjects, selectAllProjects, setExpensesDisplay, setExpensesToInclude, setHoursDisplay, setHoursToInclude, setInvoiceType, setSelectedClient, toggleProject } from '@/redux-store/slices/CreateInvoiceSlice';


// Mock data
const mockClients = [
  { id: 1, name: 'TechCorp Solutions', email: 'billing@techcorp.com', contact: 'John Smith' },
  { id: 2, name: 'Digital Innovations', email: 'accounts@digital.com', contact: 'Jane Doe' },
  { id: 3, name: 'Global Systems Inc', email: 'finance@global.com', contact: 'Bob Wilson' },
];

const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'Active',
    uninvoicedHours: 45.5,
    uninvoicedAmount: 3412.50,
    uninvoicedExpenses: 250.00,
  },
  {
    id: 2,
    name: 'Mobile App Development',
    status: 'Active',
    uninvoicedHours: 120.0,
    uninvoicedAmount: 9600.00,
    uninvoicedExpenses: 500.00,
  },
];

const Setup = () => {
  const dispatch = useDispatch();
  const [clientSearch, setClientSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const invoiceType = useSelector((state) => state.invoice.invoiceType);
  const selectedClient = useSelector((state) => state.invoice.selectedClient);
  const selectedProjects = useSelector((state) => state.invoice.selectedProjects);
  const hoursToInclude = useSelector((state) => state.invoice.hoursToInclude);
  const hoursDisplay = useSelector((state) => state.invoice.hoursDisplay);
  const expensesToInclude = useSelector((state) => state.invoice.expensesToInclude);
  const expensesDisplay = useSelector((state) => state.invoice.expensesDisplay);

  const handleClientSearch = (value) => {
    setClientSearch(value);
    if (value.trim()) {
      const filtered = mockClients.filter(
        (client) =>
          client.name.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowClientDropdown(true);
    } else {
      setFilteredClients([]);
      setShowClientDropdown(false);
    }
  };

  const handleSelectClient = (client) => {
    dispatch(setSelectedClient(client));
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const projectColumns = [
    { label: 'PROJECT', field: 'name' },
    { label: 'UNINVOICED HOURS', field: 'uninvoicedHours', align: 'right' },
    { label: 'UNINVOICED AMOUNT', field: 'uninvoicedAmount', align: 'right', render: (row) => `$${row.uninvoicedAmount.toFixed(2)}` },
    { label: 'UNINVOICED EXPENSES', field: 'uninvoicedExpenses', align: 'right', render: (row) => `$${row.uninvoicedExpenses.toFixed(2)}` },
  ];

  const totalHours = selectedProjects.reduce((sum, p) => sum + p.uninvoicedHours, 0);
  const totalAmount = selectedProjects.reduce((sum, p) => sum + p.uninvoicedAmount, 0);
  const totalExpenses = selectedProjects.reduce((sum, p) => sum + p.uninvoicedExpenses, 0);

  return (
    <Box>
      {/* Invoice Type Section */}
      <CommonSection title="Invoice Type">
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={invoiceType}
            onChange={(e) => dispatch(setInvoiceType(e.target.value))}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: invoiceType === 'tracked_time' ? 'primary.main' : '#e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <FormControlLabel
                  value="tracked_time"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Tracked time & expenses (T&M)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Include billable hours and expenses from selected projects
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box
                sx={{
                  border: '2px solid',
                  borderColor: invoiceType === 'free_form' ? 'primary.main' : '#e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <FormControlLabel
                  value="free_form"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Free-form
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create invoice with custom line items
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box
                sx={{
                  border: '2px solid',
                  borderColor: invoiceType === 'recurring' ? 'primary.main' : '#e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: '#fffbea',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <FormControlLabel
                  value="recurring"
                  control={<Radio disabled />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Recurring invoice
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Automatically generate this invoice on a schedule
                        </Typography>
                      </Box>
                      <Chip label="Pro Feature" size="small" color="warning" />
                    </Box>
                  }
                />
              </Box>
            </Box>
          </RadioGroup>
        </FormControl>
      </CommonSection>

      {/* Client Selection */}
      <CommonSection title="Client Selection">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select Client <span style={{ color: '#d32f2f' }}>*</span> (Required to proceed)
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="Search clients..."
            value={clientSearch}
            onChange={(e) => handleClientSearch(e.target.value)}
            onFocus={() => clientSearch && setShowClientDropdown(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            }}
          />
          {showClientDropdown && filteredClients.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mt: 0.5,
                maxHeight: 200,
                overflow: 'auto',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              {filteredClients.map((client) => (
                <Box
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {client.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.contact} • {client.email}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {selectedClient && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: '#e3f2fd',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <IconCheck size={20} color="#1976d2" />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {selectedClient.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedClient.contact} • {selectedClient.email}
              </Typography>
            </Box>
          </Box>
        )}
      </CommonSection>

      {/* Projects */}
      {invoiceType === 'tracked_time' && (
        <>
          <CommonSection title="Projects" subtitle="Select projects to include in this invoice">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="text"
                size="small"
                onClick={() => dispatch(selectAllProjects(mockProjects))}
              >
                Select All
              </Button>
            </Box>
            <CommonTable
              columns={projectColumns}
              data={mockProjects}
              selectable
              selectedRows={selectedProjects}
              onSelectRow={(project) => dispatch(toggleProject(project))}
              showSelectAll
              onSelectAll={(checked) => {
                if (checked) {
                  dispatch(selectAllProjects(mockProjects));
                } else {
                  dispatch(clearAllProjects());
                }
              }}
            />
          </CommonSection>

          {selectedProjects.length > 0 && (
            <CommonSection
              title="Preview: What will be included"
              sx={{ backgroundColor: '#f0f7ff' }}
            >
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {totalHours.toFixed(1)} hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      from {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      ${totalAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      billable amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      ${totalExpenses.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      in expenses
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CommonSection>
          )}

          {/* Hours Settings */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CommonSection title="Hours to Include">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={hoursToInclude}
                    onChange={(e) => dispatch(setHoursToInclude(e.target.value))}
                  >
                    <FormControlLabel
                      value="all_uninvoiced"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">All uninvoiced billable hours</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Include all unbilled time entries
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="none"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Do not include any hours</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Skip time entries, expenses only
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CommonSection>
            </Grid>

            <Grid item xs={12} md={6}>
              <CommonSection title="Hours Display">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={hoursDisplay}
                    onChange={(e) => dispatch(setHoursDisplay(e.target.value))}
                  >
                    <FormControlLabel
                      value="by_task"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By task</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Each task as separate line
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="by_person"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By person</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Group by team member
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="by_project"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By project</Typography>
                          <Typography variant="body2" color="text.secondary">
                            One line per project
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="detailed"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Detailed (each entry)</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Every time entry listed
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CommonSection>
            </Grid>

            {/* Expenses Settings */}
            <Grid item xs={12} md={6}>
              <CommonSection title="Expenses to Include">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={expensesToInclude}
                    onChange={(e) => dispatch(setExpensesToInclude(e.target.value))}
                  >
                    <FormControlLabel
                      value="all_uninvoiced"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">All uninvoiced billable expenses</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Include all unbilled expense entries
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="none"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Do not include any expenses</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Skip expenses, time only
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CommonSection>
            </Grid>

            <Grid item xs={12} md={6}>
              <CommonSection title="Expenses Display">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={expensesDisplay}
                    onChange={(e) => dispatch(setExpensesDisplay(e.target.value))}
                  >
                    <FormControlLabel
                      value="by_category"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By category</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Group by expense type
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="by_person"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By person</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Group by team member
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="by_project"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">By project</Typography>
                          <Typography variant="body2" color="text.secondary">
                            One line per project
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="detailed"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Detailed (each entry)</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Every expense listed
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CommonSection>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Setup;