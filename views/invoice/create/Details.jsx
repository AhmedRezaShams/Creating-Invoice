// pages/invoice/create/Details.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import { IconX, IconPlus } from "@tabler/icons-react";
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
  setRemittanceInformation,
  setLineItems,
} from "@/redux-store/slices/CreateInvoiceSlice";
import CommonSection from "@/components/CommonSection";
import CommonRichText from "@/components/CommonRichText";

const Details = () => {
  const dispatch = useDispatch();
  const invoiceDetails = useSelector((state) => state.invoice.invoiceDetails);
  const lineItems = useSelector((state) => state.invoice.lineItems);
  const selectedClient = useSelector((state) => state.invoice.selectedClient);
  const selectedProjects = useSelector(
    (state) => state.invoice.selectedProjects
  );
  const subtotal = useSelector((state) => state.invoice.subtotal);
  const totalDiscount = useSelector((state) => state.invoice.totalDiscount);
  const totalTax = useSelector((state) => state.invoice.totalTax);
  const total = useSelector((state) => state.invoice.total);
  const invoiceNotes = useSelector((state) => state.invoice.invoiceNotes);
  const paymentInstructions = useSelector(
    (state) => state.invoice.paymentInstructions
  );
  const termsAndConditions = useSelector(
    (state) => state.invoice.termsAndConditions
  );
  const remittanceInformation = useSelector(
    (state) => state.invoice.remittanceInformation
  );
  const thankYouMessage = useSelector((state) => state.invoice.thankYouMessage);

  useEffect(() => {
    // Initialize line items from selected projects only once when coming from Setup step
    // Clear existing items and rebuild from selected projects
    if (selectedProjects.length > 0) {
      // Check if line items need to be synced with selected projects
      const projectIds = selectedProjects
        .map((p) => p.id)
        .sort()
        .join(",");
      const existingProjectIds = lineItems
        .filter((item) => item.linkedProject)
        .map((item) => {
          const project = selectedProjects.find(
            (p) => p.name === item.linkedProject
          );
          return project?.id;
        })
        .filter(Boolean)
        .sort()
        .join(",");

      // Only rebuild if projects have changed
      if (projectIds !== existingProjectIds) {
        // Clear existing project-linked items
        const nonProjectItems = lineItems.filter((item) => !item.linkedProject);

        // Build new items from selected projects
        const newItems = [];
        selectedProjects.forEach((project, index) => {
          const timestamp = Date.now();

          // Add service line item with unique ID
          newItems.push({
            id: `service-${project.id}-${timestamp}-${index}`,
            type: "Service",
            description: `${project.name} - Development Services`,
            linkedProject: project.name,
            quantity: project.uninvoicedHours,
            unitPrice: 75,
            amount: project.uninvoicedAmount,
          });

          // Add expenses if any with unique ID
          if (project.uninvoicedExpenses > 0) {
            newItems.push({
              id: `expense-${project.id}-${timestamp}-${index}`,
              type: "Product",
              description: `${project.name} - Project Expenses`,
              linkedProject: project.name,
              quantity: 1,
              unitPrice: project.uninvoicedExpenses,
              amount: project.uninvoicedExpenses,
            });
          }
        });

        // Set line items (non-project items + new project items)
        dispatch(setLineItems([...nonProjectItems, ...newItems]));
      }
    } else if (lineItems.some((item) => item.linkedProject)) {
      // If no projects selected, remove all project-linked items
      const nonProjectItems = lineItems.filter((item) => !item.linkedProject);
      dispatch(setLineItems(nonProjectItems));
    }
  }, [selectedProjects, dispatch]);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [lineItems, invoiceDetails.tax, invoiceDetails.discount, dispatch]);

  const handleAddLineItem = () => {
    dispatch(
      addLineItem({
        id: `item-${Date.now()}`,
        type: "Service",
        description: "",
        linkedProject: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      })
    );
  };

  const handleUpdateLineItem = (index, field, value) => {
    const item = { ...lineItems[index] };
    item[field] = value;

    if (field === "quantity" || field === "unitPrice") {
      item.amount = item.quantity * item.unitPrice;
    }

    dispatch(updateLineItem({ index, data: item }));
  };

  return (
    <Box>
      {/* Invoice Details */}
      <CommonSection
        title={`New Invoice for ${selectedClient?.name || "Client"}`}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Invoice Details
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            {/* Invoice ID */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                alignItems="center"
                justifyContent="right"
                sx={{ textAlign: "right" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Invoice ID
                </Typography>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <TextField
                  fullWidth
                  value={invoiceDetails.invoiceId}
                  onChange={(e) =>
                    dispatch(
                      updateInvoiceDetails({ invoiceId: e.target.value })
                    )
                  }
                  placeholder="INV-202511-678"
                />
              </Grid>
            </Grid>

            {/* Invoice Date */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                alignItems="center"
                justifyContent="right"
                sx={{ textAlign: "right" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Invoice Date
                </Typography>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={invoiceDetails.invoiceDate}
                  onChange={(e) =>
                    dispatch(
                      updateInvoiceDetails({ invoiceDate: e.target.value })
                    )
                  }
                />
              </Grid>
            </Grid>

            {/* Due Date */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                alignItems="center"
                justifyContent="right"
                sx={{ textAlign: "right" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Due Date
                </Typography>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={invoiceDetails.dueDate}
                  onChange={(e) =>
                    dispatch(updateInvoiceDetails({ dueDate: e.target.value }))
                  }
                />
              </Grid>
            </Grid>

            {/* Currency */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                alignItems="center"
                justifyContent="right"
                sx={{ textAlign: "right" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Currency
                </Typography>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <TextField
                  fullWidth
                  value={invoiceDetails.currency}
                  onChange={(e) =>
                    dispatch(updateInvoiceDetails({ currency: e.target.value }))
                  }
                  placeholder="USD"
                />
              </Grid>
            </Grid>

            {/* Payment Terms */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                alignItems="center"
                justifyContent="right"
                sx={{ textAlign: "right" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Payment Terms
                </Typography>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <TextField
                  fullWidth
                  value={invoiceDetails.paymentTerms}
                  onChange={(e) =>
                    dispatch(
                      updateInvoiceDetails({ paymentTerms: e.target.value })
                    )
                  }
                  placeholder="Net 30"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            {/* Invoice For */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Invoice For
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {selectedClient?.name || "TechCorp Solutions"}
                </Typography>
                <Button variant="text" size="small">
                  Change
                </Button>
              </Box>
            </Box>

            {/* Tax */}
            <Grid container alignItems="center" sx={{ mb: 2 }} columns={16}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Tax
                </Typography>
              </Grid>
              <Grid size={{ sm: 16, md: 12, lg: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  value={invoiceDetails.tax}
                  onChange={(e) =>
                    dispatch(
                      updateInvoiceDetails({
                        tax: parseFloat(e.target.value) || 0,
                      })
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={invoiceDetails.taxType}
                          onChange={(e) =>
                            dispatch(
                              updateInvoiceDetails({ taxType: e.target.value })
                            )
                          }
                          size="small"
                          sx={{
                            border: "none",
                            "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                          }}
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

            {/* Discount */}
            <Grid container alignItems="center" sx={{ mb: 2 }} columns={16}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Discount
                </Typography>
              </Grid>
              <Grid size={{ sm: 16, md: 12, lg: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  value={invoiceDetails.discount}
                  onChange={(e) =>
                    dispatch(
                      updateInvoiceDetails({
                        discount: parseFloat(e.target.value) || 0,
                      })
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={invoiceDetails.discountType}
                          onChange={(e) =>
                            dispatch(
                              updateInvoiceDetails({
                                discountType: e.target.value,
                              })
                            )
                          }
                          size="small"
                          sx={{
                            border: "none",
                            "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                          }}
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

            {/* Currency */}
            <Grid container alignItems="center" sx={{ mt: 2 }} columns={16}>
              <Grid
                size={{ sm: 12, md: 4, lg: 4 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Currency
                </Typography>
              </Grid>
              <Grid size={{ sm: 16, md: 12, lg: 12 }}>
                <FormControl fullWidth>
                  <Select
                    value={invoiceDetails.currency}
                    onChange={(e) =>
                      dispatch(
                        updateInvoiceDetails({ currency: e.target.value })
                      )
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
          </Grid>
        </Grid>

        {/* Line Items Table */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 100px 100px 120px 40px",
              gap: 2,
              mb: 2,
              pb: 1,
              borderBottom: "2px solid #e0e0e0",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              ITEM TYPE
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              DESCRIPTION
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              align="right"
            >
              QUANTITY
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              align="right"
            >
              UNIT PRICE
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              align="right"
            >
              AMOUNT
            </Typography>
            <Box />
          </Box>

          {lineItems.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 100px 100px 120px 40px",
                gap: 2,
                mb: 2,
                alignItems: "start",
              }}
            >
              <Select
                size="small"
                value={item.type}
                onChange={(e) =>
                  handleUpdateLineItem(index, "type", e.target.value)
                }
              >
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="Product">Product</MenuItem>
              </Select>

              <Box>
                <TextField
                  fullWidth
                  size="small"
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateLineItem(index, "description", e.target.value)
                  }
                  placeholder="Description"
                />
                {item.linkedProject && (
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Linked project: {item.linkedProject}
                  </Typography>
                )}
              </Box>

              <TextField
                size="small"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleUpdateLineItem(
                    index,
                    "quantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                inputProps={{ style: { textAlign: "right" } }}
              />

              <TextField
                size="small"
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  handleUpdateLineItem(
                    index,
                    "unitPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                inputProps={{ style: { textAlign: "right" } }}
              />

              <TextField
                size="small"
                value={`$${item.amount.toFixed(2)}`}
                inputProps={{ style: { textAlign: "right" }, readOnly: true }}
                sx={{ backgroundColor: "#f5f5f5" }}
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
          <Grid container spacing={2}>
            {/* Left Section - Subtotal and Adjustments */}
            <Grid item size={{ sm: 12, md: 10, lg: 10 }}>
              <Grid
                spacing={2}
                border={1}
                width="100%"
                height="100%"
                borderRadius={2}
                p={2}
              >
                <Grid item xs={6} alignContent="center">
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>

                  <Typography variant="h5" fontWeight={600} align="right">
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Divider sx={{ mb: 2, mt: 2 }} />

                <Grid item xs={6}>
                  <Typography variant="h6" color="text.secondary">
                    Adjustments
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Button variant="outlined" size="small" color="success">
                      + Add addition
                    </Button>
                    <Button variant="outlined" size="small" color="error">
                      + Add deduction
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Section - Summary */}
            <Grid
              item
              size={{ sm: 12, md: 2, lg: 2 }}
              border={1}
              width="100%"
              height="100%"
              borderRadius={2}
              p={2}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Discount (0%)</Typography>
                <Typography variant="body2" color="error">
                  -${totalDiscount.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">${totalTax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={700}>
                  Amount due
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
        onEnabledChange={true}
        onShowOnPdfChange={true}
      />

      <CommonRichText
        label="Payment Instructions"
        value={paymentInstructions}
        onChange={(value) => dispatch(setPaymentInstructions(value))}
        placeholder="Please remit payment within the specified terms. Wire transfer details available upon request."
        showOnPdf={true}
        enabled={true}
        onEnabledChange={true}
        onShowOnPdfChange={true}
      />

      <CommonRichText
        label="Terms & Conditions"
        value={termsAndConditions}
        onChange={(value) => dispatch(setTermsAndConditions(value))}
        placeholder="Enter terms & conditions..."
        showOnPdf={true}
        enabled={false}
        onEnabledChange={true}
        onShowOnPdfChange={true}
      />

      <CommonRichText
        label="Remittance Information"
        value={remittanceInformation}
        onChange={(value) => dispatch(setRemittanceInformation(value))}
        placeholder="Enter Remittance Information..."
        showOnPdf={true}
        enabled={false}
        onEnabledChange={true}
        onShowOnPdfChange={true}
      />

      <CommonRichText
        label="Thank You Message"
        value={thankYouMessage}
        onChange={(value) => dispatch(setThankYouMessage(value))}
        placeholder="Thank you for your business! We appreciate the opportunity to work with you."
        showOnPdf={true}
        enabled={true}
        onEnabledChange={true}
        onShowOnPdfChange={true}
      />
    </Box>
  );
};

export default Details;
