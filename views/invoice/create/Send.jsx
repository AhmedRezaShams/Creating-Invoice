// pages/invoice/create/Send.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
} from '@mui/material';
import { IconX, IconDownload, IconPrinter, IconEye } from '@tabler/icons-react';
import {
  setSendAs,
  setRecipients,
  addRecipient,
  removeRecipient,
  setCcRecipients,
  setBccRecipients,
  setMessageSubject,
  setMessageBody,
  setIncludePdf,
} from '@/redux-store/slices/CreateInvoiceSlice';
import CommonSection from '@/components/CommonSection';

const Send = () => {
  const dispatch = useDispatch();
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [recipientInput, setRecipientInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');

  const invoiceDetails = useSelector((state) => state.invoice.invoiceDetails);
  const selectedClient = useSelector((state) => state.invoice.selectedClient);
  const total = useSelector((state) => state.invoice.total);
  const sendAs = useSelector((state) => state.invoice.sendAs);
  const recipients = useSelector((state) => state.invoice.recipients);
  const ccRecipients = useSelector((state) => state.invoice.ccRecipients);
  const bccRecipients = useSelector((state) => state.invoice.bccRecipients);
  const messageSubject = useSelector((state) => state.invoice.messageSubject);
  const messageBody = useSelector((state) => state.invoice.messageBody);
  const includePdf = useSelector((state) => state.invoice.includePdf);

  const handleAddRecipient = () => {
    if (recipientInput.trim()) {
      dispatch(addRecipient(recipientInput.trim()));
      setRecipientInput('');
    }
  };

  const handleAddCc = () => {
    if (ccInput.trim()) {
      dispatch(setCcRecipients([...ccRecipients, ccInput.trim()]));
      setCcInput('');
    }
  };

  const handleAddBcc = () => {
    if (bccInput.trim()) {
      dispatch(setBccRecipients([...bccRecipients, bccInput.trim()]));
      setBccInput('');
    }
  };

  return (
    <Box>
      {/* Top Action Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          p: 2,
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" color="success" size="large">
            Send invoice
          </Button>
          <Button variant="outlined">Copy invoice link</Button>
          <Button variant="outlined">Edit invoice</Button>
          <Button variant="outlined">Actions</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Balance: ${total.toFixed(2)}
          </Typography>
          <Button variant="outlined" color="primary">
            Record payment
          </Button>
        </Box>
      </Box>

      {/* Invoice Info */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Invoice {invoiceDetails.invoiceId || 'INV-202511-678'}
          </Typography>
          <Chip label="Draft" size="small" sx={{ mt: 0.5 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<IconEye size={16} />}>
            Preview
          </Button>
          <Button variant="outlined" size="small" startIcon={<IconDownload size={16} />}>
            PDF
          </Button>
          <Button variant="outlined" size="small" startIcon={<IconPrinter size={16} />}>
            Print
          </Button>
        </Box>
      </Box>

      {/* Send Invoice Form */}
      <CommonSection title="Send Invoice">
        <Box>
          {/* Send As */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Send as
            </Typography>
            <Select
              value={sendAs || `Pitec Clinical <billing@pitecclinical.com>`}
              onChange={(e) => dispatch(setSendAs(e.target.value))}
              displayEmpty
            >
              <MenuItem value="Pitec Clinical <billing@pitecclinical.com>">
                Pitec Clinical &lt;billing@pitecclinical.com&gt;
              </MenuItem>
              <MenuItem value="sales@pitecclinical.com">
                Sales &lt;sales@pitecclinical.com&gt;
              </MenuItem>
            </Select>
          </FormControl>

          {/* Recipients */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Recipients <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={recipientInput || 'billing@techcorp.com'}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
              placeholder="Enter email addresses"
            />
            {recipients.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recipients.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={() => dispatch(removeRecipient(index))}
                    size="small"
                  />
                ))}
              </Box>
            )}
            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowCc(!showCc)}
              >
                Add CC
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowBcc(!showBcc)}
              >
                Add BCC
              </Button>
            </Box>
          </Box>

          {/* CC */}
          {showCc && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                CC
              </Typography>
              <TextField
                fullWidth
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCc()}
                placeholder="Enter CC email addresses"
              />
              {ccRecipients.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ccRecipients.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => {
                        const newCc = [...ccRecipients];
                        newCc.splice(index, 1);
                        dispatch(setCcRecipients(newCc));
                      }}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* BCC */}
          {showBcc && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                BCC
              </Typography>
              <TextField
                fullWidth
                value={bccInput}
                onChange={(e) => setBccInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddBcc()}
                placeholder="Enter BCC email addresses"
              />
              {bccRecipients.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {bccRecipients.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => {
                        const newBcc = [...bccRecipients];
                        newBcc.splice(index, 1);
                        dispatch(setBccRecipients(newBcc));
                      }}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Message Subject */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Message subject <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={
                messageSubject ||
                `Invoice %invoice_id% from %company_name%`
              }
              onChange={(e) => dispatch(setMessageSubject(e.target.value))}
              placeholder="Invoice subject"
            />
          </Box>

          {/* Message Body */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Message body <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={
                messageBody ||
                `Dear %client_contact_name%,\n\nPlease find attached invoice %invoice_id% for %invoice_amount%.\n\nDue date: %invoice_due_date%\n\nThank you for your business!`
              }
              onChange={(e) => dispatch(setMessageBody(e.target.value))}
              placeholder="Enter message body"
            />
          </Box>

          {/* Include PDF */}
          <FormControlLabel
            control={
              <Checkbox
                checked={includePdf}
                onChange={(e) => dispatch(setIncludePdf(e.target.checked))}
              />
            }
            label="Include a PDF version of the invoice"
          />

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" size="large">
              Send invoice
            </Button>
            <Button variant="outlined" size="large">
              View preview
            </Button>
            <Button variant="text" size="large">
              Cancel
            </Button>
          </Box>
        </Box>
      </CommonSection>
    </Box>
  );
};

export default Send;