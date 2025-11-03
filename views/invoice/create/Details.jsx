// pages/invoice/create/Details.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Button,
  InputAdornment,
  Divider,
} from '@mui/material';
import { IconX, IconPlus } from '@tabler/icons-react';
import {
  updateInvoiceDetails,
  addLineItem,
  updateLineItem,
  removeLineItem,
  setInvoiceNotes,
  setPaymentInstructions,
  setTermsAndConditions,
  setThankYouMessage,
  calculateTotals,
} from '@/redux-store/slices/CreateInvoiceSlice';
import CommonSection from '@/components/CommonSection';
import CommonRichText from '@/components/CommonRichText';

const Details = () => {
  const dispatch = useDispatch();
  const invoiceDetails = useSelector((state) => state.invoice.invoiceDetails);
  const lineItems = useSelector((state) => state.invoice.lineItems);
  const selectedClient = useSelector((state) => state.invoice.selectedClient);
  const selectedProjects = useSelector((state) => state.invoice.selectedProjects);
  const subtotal = useSelector((state) => state.invoice.subtotal);
  const totalDiscount = useSelector((state) => state.invoice.totalDiscount);
  const totalTax = useSelector((state) => state.invoice.totalTax);
  const total = useSelector((state) => state.invoice.total);
  const invoiceNotes = useSelector((state) => state.invoice.invoiceNotes);
  const paymentInstructions = useSelector((state) => state.invoice.paymentInstructions);
  const termsAndConditions = useSelector((state) => state.invoice.termsAndConditions);
  const thankYouMessage = useSelector((state) => state.invoice.thankYouMessage);

  useEffect(() => {
    // Initialize line items from selected projects
    if (selectedProjects.length > 0 && lineItems.length === 0) {
      selectedProjects.forEach((project) => {
        // Add service line item
        dispatch(
          addLineItem({
            id: `service-${project.id}`,
            type: 'Service',
            description: `${project.name} - Development Services`,
            linkedProject: project.name,
            quantity: project.uninvoicedHours,
            unitPrice: 75,
            amount: project.uninvoicedAmount,
          })
        );
        
        // Add expenses if any
        if (project.uninvoicedExpenses > 0) {
          dispatch(
            addLineItem({
              id: `expense-${project.id}`,
              type: 'Product',
              description: `${project.name} - Project Expenses`,
              linkedProject: project.name,
              quantity: 1,
              unitPrice: project.uninvoicedExpenses,
              amount: project.uninvoicedExpenses,
            })
          );
        }
      });
    }
  }, [selectedProjects, lineItems.length, dispatch]);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [lineItems, invoiceDetails.tax, invoiceDetails.discount, dispatch]);

  const handleAddLineItem = () => {
    dispatch(
      addLineItem({
        id: `item-${Date.now()}`,
        type: 'Service',
        description: '',
        linkedProject: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      })
    );
  };

  const handleUpdateLineItem = (index, field, value) => {
    const item = { ...lineItems[index] };
    item[field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      item.amount = item.quantity * item.unitPrice;
    }
    
    dispatch(updateLineItem({ index, data: item }));
  };

  return (
    <Box>
      {/* Calculation Breakdown */}
      <CommonSection>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Calculation Breakdown
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            ${subtotal.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" fontWeight={600}>
            Total:
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </CommonSection>

      {/* Invoice Details */}
      <CommonSection title={`New Invoice for ${selectedClient?.name || 'Client'}`}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Invoice Details
        </Typography>
        
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice ID"
              value={invoiceDetails.invoiceId}
              onChange={(e) =>
                dispatch(updateInvoiceDetails({ invoiceId: e.target.value }))
              }
              placeholder="INV-202511-678"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="PO Number"
              value={invoiceDetails.poNumber}
              onChange={(e) =>
                dispatch(updateInvoiceDetails({ poNumber: e.target.value }))
              }
              placeholder="Enter PO number"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Issue Date"
              type="date"
              value={invoiceDetails.issueDate}
              onChange={(e) =>
                dispatch(updateInvoiceDetails({ issueDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                value={invoiceDetails.paymentTerms}
                label="Payment Terms"
                onChange={(e) =>
                  dispatch(updateInvoiceDetails({ paymentTerms: e.target.value }))
                }
              >
                <MenuItem value="net_15">Net 15</MenuItem>
                <MenuItem value="net_30">Net 30</MenuItem>
                <MenuItem value="net_45">Net 45</MenuItem>
                <MenuItem value="net_60">Net 60</MenuItem>
                <MenuItem value="due_on_receipt">Due on Receipt</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Subject"
              value={invoiceDetails.subject}
              onChange={(e) =>
                dispatch(updateInvoiceDetails({ subject: e.target.value }))
              }
              placeholder="Invoice for TechCorp Solutions"
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Invoice For
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {selectedClient?.name || 'TechCorp Solutions'}
                </Typography>
                <Button variant="text" size="small" sx={{ mt: 1 }}>
                  Change
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Tax"
                  type="number"
                  value={invoiceDetails.tax}
                  onChange={(e) =>
                    dispatch(updateInvoiceDetails({ tax: parseFloat(e.target.value) || 0 }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={invoiceDetails.taxType}
                          onChange={(e) =>
                            dispatch(updateInvoiceDetails({ taxType: e.target.value }))
                          }
                          size="small"
                          sx={{ border: 'none', '& .MuiOutlinedInput-notchedOutline': { border: 0 } }}
                        >
                          <MenuItem value="$">$</MenuItem>
                          <MenuItem value="%">%</MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Applies to subtotal"
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  value={invoiceDetails.discount}
                  onChange={(e) =>
                    dispatch(updateInvoiceDetails({ discount: parseFloat(e.target.value) || 0 }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={invoiceDetails.discountType}
                          onChange={(e) =>
                            dispatch(updateInvoiceDetails({ discountType: e.target.value }))
                          }
                          size="small"
                          sx={{ border: 'none', '& .MuiOutlinedInput-notchedOutline': { border: 0 } }}
                        >
                          <MenuItem value="$">$</MenuItem>
                          <MenuItem value="%">%</MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Applies to subtotal (max 100%)"
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={invoiceDetails.currency}
                label="Currency"
                onChange={(e) =>
                  dispatch(updateInvoiceDetails({ currency: e.target.value }))
                }
              >
                <MenuItem value="USD">🇺🇸 USD - US Dollar</MenuItem>
                <MenuItem value="EUR">🇪🇺 EUR - Euro</MenuItem>
                <MenuItem value="GBP">🇬🇧 GBP - British Pound</MenuItem>
                <MenuItem value="CAD">🇨🇦 CAD - Canadian Dollar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Line Items Table */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 100px 100px 120px 40px',
              gap: 2,
              mb: 2,
              pb: 1,
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              ITEM TYPE
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              DESCRIPTION
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" align="right">
              QUANTITY
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" align="right">
              UNIT PRICE
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" align="right">
              AMOUNT
            </Typography>
            <Box />
          </Box>

          {lineItems.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 100px 100px 120px 40px',
                gap: 2,
                mb: 2,
                alignItems: 'start',
              }}
            >
              <Select
                size="small"
                value={item.type}
                onChange={(e) => handleUpdateLineItem(index, 'type', e.target.value)}
              >
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="Product">Product</MenuItem>
              </Select>

              <Box>
                <TextField
                  fullWidth
                  size="small"
                  value={item.description}
                  onChange={(e) => handleUpdateLineItem(index, 'description', e.target.value)}
                  placeholder="Description"
                />
                {item.linkedProject && (
                  <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                    Linked project: {item.linkedProject}
                  </Typography>
                )}
              </Box>

              <TextField
                size="small"
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <TextField
                size="small"
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleUpdateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <TextField
                size="small"
                value={`$${item.amount.toFixed(2)}`}
                inputProps={{ style: { textAlign: 'right' }, readOnly: true }}
                sx={{ backgroundColor: '#f5f5f5' }}
              />

              <IconButton
                size="small"
                onClick={() => dispatch(removeLineItem(index))}
                color="error"
              >
                <IconX size={18} />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="text"
            startIcon={<IconPlus size={18} />}
            onClick={handleAddLineItem}
            sx={{ mt: 1 }}
          >
            Add Line Item
          </Button>
        </Box>

        {/* Totals */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Grid container>
            <Grid item xs={12} md={6} />
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Discount (0%)</Typography>
                <Typography variant="body2" color="success.main">
                  -${totalDiscount.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">
                  ${totalTax.toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>
                  Amount due
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" color="success">
              + Add addition
            </Button>
            <Button variant="outlined" size="small" color="error">
              + Add deduction
            </Button>
          </Box>
        </Box>
      </CommonSection>

      {/* Rich Text Sections */}
      <CommonRichText
        label="Invoice Notes"
        value={invoiceNotes}
        onChange={(value) => dispatch(setInvoiceNotes(value))}
        placeholder="Enter invoice notes..."
        showOnPdf={true}
        enabled={true}
      />

      <CommonRichText
        label="Payment Instructions"
        value={paymentInstructions}
        onChange={(value) => dispatch(setPaymentInstructions(value))}
        placeholder="Please remit payment within the specified terms. Wire transfer details available upon request."
        showOnPdf={true}
        enabled={true}
      />

      <CommonRichText
        label="Terms & Conditions"
        value={termsAndConditions}
        onChange={(value) => dispatch(setTermsAndConditions(value))}
        placeholder="Enter terms & conditions..."
        showOnPdf={true}
        enabled={false}
      />

      <CommonRichText
        label="Thank You Message"
        value={thankYouMessage}
        onChange={(value) => dispatch(setThankYouMessage(value))}
        placeholder="Thank you for your business! We appreciate the opportunity to work with you."
        showOnPdf={true}
        enabled={true}
      />
    </Box>
  );
};

export default Details;