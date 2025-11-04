// store/slices/invoiceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Step 1: Setup
  invoiceType: "tracked_time", // 'tracked_time' | 'free_form' | 'recurring'
  selectedClient: null,
  selectedProjects: [],
  hoursToInclude: "all_uninvoiced", // 'all_uninvoiced' | 'none'
  hoursDisplay: "by_project", // 'by_task' | 'by_person' | 'by_project' | 'detailed'
  expensesToInclude: "all_uninvoiced", // 'all_uninvoiced' | 'none'
  expensesDisplay: "by_project", // 'by_category' | 'by_person' | 'by_project' | 'detailed'

  // Step 2: Details
  invoiceDetails: {
    invoiceId: "",
    poNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    paymentTerms: "net_30",
    subject: "",
    invoiceFor: null,
    tax: 0,
    taxType: "$", // '$' | '%'
    discount: 0,
    discountType: "%", // '$' | '%'
    currency: "USD",
  },
  lineItems: [],
  invoiceNotes: "",
  paymentInstructions: "",
  termsAndConditions: "",
  remittanceInformation: "",
  thankYouMessage: "",

  // Step 3: Review
  attachments: [],

  // Step 4: Send
  sendAs: "",
  recipients: [],
  ccRecipients: [],
  bccRecipients: [],
  messageSubject: "",
  messageBody: "",
  includePdf: true,

  // Calculations
  subtotal: 0,
  totalTax: 0,
  totalDiscount: 0,
  total: 0,

  // UI State
  currentStep: 0,
  showCalculation: true,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    // Step Navigation
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 3) state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },

    // Step 1: Setup Actions
    setInvoiceType: (state, action) => {
      state.invoiceType = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    setSelectedProjects: (state, action) => {
      state.selectedProjects = action.payload;
    },
    toggleProject: (state, action) => {
      const project = action.payload;
      const index = state.selectedProjects.findIndex(
        (p) => p.id === project.id
      );

      if (index > -1) {
        // Project already selected, remove it
        state.selectedProjects.splice(index, 1);
      } else {
        // Project not selected, add it
        state.selectedProjects.push(project);
      }
    },
    selectAllProjects: (state, action) => {
      state.selectedProjects = action.payload;
    },
    clearAllProjects: (state) => {
      state.selectedProjects = [];
    },
    setHoursToInclude: (state, action) => {
      state.hoursToInclude = action.payload;
    },
    setHoursDisplay: (state, action) => {
      state.hoursDisplay = action.payload;
    },
    setExpensesToInclude: (state, action) => {
      state.expensesToInclude = action.payload;
    },
    setExpensesDisplay: (state, action) => {
      state.expensesDisplay = action.payload;
    },

    // Step 2: Details Actions
    updateInvoiceDetails: (state, action) => {
      state.invoiceDetails = { ...state.invoiceDetails, ...action.payload };
    },
    setLineItems: (state, action) => {
      state.lineItems = action.payload;
    },
    addLineItem: (state, action) => {
      state.lineItems.push(action.payload);
    },
    updateLineItem: (state, action) => {
      const { index, data } = action.payload;
      state.lineItems[index] = { ...state.lineItems[index], ...data };
    },
    removeLineItem: (state, action) => {
      state.lineItems.splice(action.payload, 1);
    },
    setInvoiceNotes: (state, action) => {
      state.invoiceNotes = action.payload;
    },
    setPaymentInstructions: (state, action) => {
      state.paymentInstructions = action.payload;
    },
    setTermsAndConditions: (state, action) => {
      state.termsAndConditions = action.payload;
    },
    setRemittanceInformation: (state, action) => {
      state.remittanceInformation = action.payload;
    },
    setThankYouMessage: (state, action) => {
      state.thankYouMessage = action.payload;
    },

    // Step 3: Review Actions
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    removeAttachment: (state, action) => {
      state.attachments.splice(action.payload, 1);
    },

    // Step 4: Send Actions
    setSendAs: (state, action) => {
      state.sendAs = action.payload;
    },
    setRecipients: (state, action) => {
      state.recipients = action.payload;
    },
    addRecipient: (state, action) => {
      state.recipients.push(action.payload);
    },
    removeRecipient: (state, action) => {
      state.recipients.splice(action.payload, 1);
    },
    setCcRecipients: (state, action) => {
      state.ccRecipients = action.payload;
    },
    setBccRecipients: (state, action) => {
      state.bccRecipients = action.payload;
    },
    setMessageSubject: (state, action) => {
      state.messageSubject = action.payload;
    },
    setMessageBody: (state, action) => {
      state.messageBody = action.payload;
    },
    setIncludePdf: (state, action) => {
      state.includePdf = action.payload;
    },

    // Calculation Actions
    calculateTotals: (state) => {
      const subtotal = state.lineItems.reduce((sum, item) => {
        return sum + item.quantity * item.unitPrice;
      }, 0);

      state.subtotal = subtotal;

      let totalDiscount = 0;
      if (state.invoiceDetails.discountType === "%") {
        totalDiscount = (subtotal * state.invoiceDetails.discount) / 100;
      } else {
        totalDiscount = state.invoiceDetails.discount;
      }
      state.totalDiscount = totalDiscount;

      const afterDiscount = subtotal - totalDiscount;

      let totalTax = 0;
      if (state.invoiceDetails.taxType === "%") {
        totalTax = (afterDiscount * state.invoiceDetails.tax) / 100;
      } else {
        totalTax = state.invoiceDetails.tax;
      }
      state.totalTax = totalTax;

      state.total = afterDiscount + totalTax;
    },

    // Toggle UI
    toggleCalculation: (state) => {
      state.showCalculation = !state.showCalculation;
    },

    // Reset
    resetInvoice: () => initialState,
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setInvoiceType,
  setSelectedClient,
  setSelectedProjects,
  toggleProject,
  selectAllProjects,
  clearAllProjects,
  setHoursToInclude,
  setHoursDisplay,
  setExpensesToInclude,
  setExpensesDisplay,
  updateInvoiceDetails,
  setLineItems,
  addLineItem,
  updateLineItem,
  removeLineItem,
  setInvoiceNotes,
  setPaymentInstructions,
  setTermsAndConditions,
  setRemittanceInformation,
  setThankYouMessage,
  addAttachment,
  removeAttachment,
  setSendAs,
  setRecipients,
  addRecipient,
  removeRecipient,
  setCcRecipients,
  setBccRecipients,
  setMessageSubject,
  setMessageBody,
  setIncludePdf,
  calculateTotals,
  toggleCalculation,
  resetInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
