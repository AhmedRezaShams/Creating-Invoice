// pages/invoice/create/Review.jsx
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  IconPaperclip,
  IconFileInvoice,
  IconDownload,
  IconPrinter,
  IconEye,
  IconCalendar,
} from '@tabler/icons-react';
import { addAttachment, removeAttachment } from '@/redux-store/slices/CreateInvoiceSlice';
import CommonSection from '@/components/CommonSection';

const Review = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const selectedClient = useSelector((state) => state.invoice.selectedClient);
  const invoiceDetails = useSelector((state) => state.invoice.invoiceDetails);
  const lineItems = useSelector((state) => state.invoice.lineItems);
  const subtotal = useSelector((state) => state.invoice.subtotal);
  const totalDiscount = useSelector((state) => state.invoice.totalDiscount);
  const totalTax = useSelector((state) => state.invoice.totalTax);
  const total = useSelector((state) => state.invoice.total);
  const attachments = useSelector((state) => state.invoice.attachments);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      dispatch(
        addAttachment({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
        })
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const calculateDueDate = () => {
    if (!invoiceDetails.issueDate) return '';
    const issueDate = new Date(invoiceDetails.issueDate);
    const daysMap = {
      net_15: 15,
      net_30: 30,
      net_45: 45,
      net_60: 60,
      due_on_receipt: 0,
    };
    const days = daysMap[invoiceDetails.paymentTerms] || 30;
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }) + ` (${invoiceDetails.paymentTerms.replace('_', ' ')})`;
  };

  return (
    <Box>
      {/* Calculation Breakdown */}
      <CommonSection sx={{ backgroundColor: '#f0f7ff' }}>
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

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" size="large">
          Send invoice
        </Button>
        <Button variant="outlined">Copy invoice link</Button>
        <Button variant="outlined">Edit invoice</Button>
        <Button variant="outlined">Actions</Button>
        
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Balance: ${total.toFixed(2)}
          </Typography>
          <Button variant="outlined" color="primary">
            Record payment
          </Button>
        </Box>
      </Box>

      {/* Invoice Preview */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {/* Invoice Header */}
        <Box sx={{ p: 4, backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: '#1976d2',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                PC
              </Avatar>
              <Typography variant="h5" fontWeight={700} color="primary">
                PITEC IT
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label="Draft"
                size="small"
                sx={{ mb: 1, backgroundColor: '#f5f5f5' }}
              />
              <Typography variant="body2" color="text.secondary">
                Invoice {invoiceDetails.invoiceId || 'INV-202511-678'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Invoice Details */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Invoice for
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {selectedClient?.name || 'TechCorp Solutions'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                25 Second Street, 5th Floor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cambridge, MA 12345
              </Typography>
              <Button variant="text" size="small" sx={{ mt: 1, px: 0 }}>
                Edit info
              </Button>

              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Subject
                </Typography>
                <Typography variant="body1">
                  {invoiceDetails.subject || 'Invoice for TechCorp Solutions'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Invoice ID
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {invoiceDetails.invoiceId || 'INV-202511-678'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Issue date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(invoiceDetails.issueDate) || '11/2/2025'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Due date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {calculateDueDate() || '12/2/2025 (Net 45)'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Line Items */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: 2,
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                fontWeight: 600,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" align="right">
                Quantity
              </Typography>
              <Typography variant="body2" color="text.secondary" align="right">
                Unit price
              </Typography>
              <Typography variant="body2" color="text.secondary" align="right">
                Amount
              </Typography>
            </Box>

            {lineItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: 2,
                  py: 2,
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Typography variant="body2">{item.description}</Typography>
                <Typography variant="body2" align="right">
                  {item.quantity.toFixed(2)}
                </Typography>
                <Typography variant="body2" align="right">
                  ${item.unitPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" align="right" fontWeight={600}>
                  ${item.amount.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Totals */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: 300 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              {totalDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Discount
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    -${totalDiscount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {totalTax > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${totalTax.toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>
                  Amount due
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Attachments Section */}
        <Box sx={{ p: 3, backgroundColor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              multiple
            />
            <Button
              variant="outlined"
              startIcon={<IconPaperclip size={18} />}
              onClick={() => fileInputRef.current?.click()}
            >
              Attach file
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconFileInvoice size={18} />}
            >
              Attach expense report
            </Button>
          </Box>

          {attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Attachments
              </Typography>
              {attachments.map((attachment, index) => (
                <Chip
                  key={attachment.id}
                  label={attachment.name}
                  onDelete={() => dispatch(removeAttachment(index))}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Preview Actions */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#fff',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button variant="outlined" startIcon={<IconEye size={18} />}>
            Preview
          </Button>
          <Button variant="outlined" startIcon={<IconDownload size={18} />}>
            PDF
          </Button>
          <Button variant="outlined" startIcon={<IconPrinter size={18} />}>
            Print
          </Button>
        </Box>
      </Paper>

      {/* Invoice History */}
      <CommonSection title="Invoice history">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: '#424242' }}>PC</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Invoice created
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pitec Clinical on 09/11/2025 at 10:50am
            </Typography>
          </Box>
        </Box>
      </CommonSection>
    </Box>
  );
};

export default Review;


