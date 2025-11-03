// pages/invoice/create/index.jsx
'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  IconButton,
  Collapse,
  Paper,
} from '@mui/material';
import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconEye,
} from '@tabler/icons-react';
import { nextStep, previousStep, toggleCalculation } from '@/redux-store/slices/CreateInvoiceSlice';
import Setup from './Setup';
import Details from './Details';
import Review from './Review';
import Send from './Send';

const steps = [
  { label: 'Setup', component: Setup },
  { label: 'Details', component: Details },
  { label: 'Review', component: Review },
  { label: 'Send', component: Send },
];

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.invoice.currentStep);
  const showCalculation = useSelector((state) => state.invoice.showCalculation);
  const subtotal = useSelector((state) => state.invoice.subtotal);
  const total = useSelector((state) => state.invoice.total);

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const canGoNext = () => {
    // Add validation logic here based on current step
    return true;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Create Invoice
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<IconEye size={18} />}
              onClick={() => dispatch(toggleCalculation())}
              size="small"
            >
              {showCalculation ? 'Hide' : 'Show'} Calculation
            </Button>
            <IconButton size="small">
              <IconX size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Step Indicator */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Step {currentStep + 1} of {steps.length}
        </Typography>

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: currentStep === index ? 600 : 400,
                      fontSize: '0.95rem',
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Calculation Breakdown */}
        <Collapse in={showCalculation}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Calculation Breakdown
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1,
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Total:
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Collapse>

        {/* Main Content Area */}
        <Box sx={{ mb: 4 }}>
          <CurrentStepComponent />
        </Box>

        {/* Navigation Buttons */}
        <Paper
          elevation={0}
          sx={{
            position: 'sticky',
            bottom: 0,
            p: 2,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<IconChevronLeft size={18} />}
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Typography variant="body2" color="text.secondary">
            Step {currentStep + 1} of {steps.length}
          </Typography>

          {currentStep === steps.length - 1 ? (
            <Button variant="contained" color="primary">
              Send Invoice
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<IconChevronRight size={18} />}
              onClick={handleNext}
              disabled={!canGoNext()}
            >
              Next
            </Button>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateInvoice;