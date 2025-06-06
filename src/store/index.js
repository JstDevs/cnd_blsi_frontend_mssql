import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import departmentReducer from '../features/settings/departmentSlice';
import subdepartmentReducer from '../features/settings/subdepartmentSlice';
import userReducer from '../features/settings/userSlice';
import chartOfAccountsReducer from '../features/settings/chartOfAccountsSlice';
import vendorReducer from '../features/settings/vendorSlice';
import employeeReducer from '../features/settings/employeeSlice';
import obligationRequestReducer from '../features/disbursement/obligationRequestSlice';
import disbursementVoucherReducer from '../features/disbursement/disbursementVoucherSlice';
import travelOrderReducer from '../features/disbursement/travelOrderSlice';
import generalReceiptReducer from '../features/collections/generalReceiptSlice';
import ppeReducer from '../features/settings/ppeSlice';
import approvalMatrixReducer from '../features/settings/approvalMatrixSlice';
import bankReducer from '../features/settings/bankSlice';
import documentDetailsReducer from '../features/settings/documentDetailsSlice';
import itemReducer from '../features/settings/itemSlice';
import invoiceChargeAccountsReducer from '../features/settings/invoiceChargeAccountsSlice';
import { itemUnitsReducer } from '../features/settings/itemUnitsSlice';
import { projectDetailsReducer } from '../features/settings/projectDetailsSlice';
import { projectTypesReducer } from '../features/settings/projectTypesSlice';
import { financialStatementsReducer } from '../features/settings/financialStatementSlice';
import { fiscalYearsReducer } from '../features/settings/fiscalYearSlice';
import { taxCodesReducer } from '../features/settings/taxCodeSlice';
import { modeOfPaymentsReducer } from '../features/settings/modeOfPaymentSlice';
import { paymentTermsReducer } from '../features/settings/paymentTermsSlice';
import { industryReducer } from '../features/settings/industrySlice';
import communityTaxReducer from '../features/communityTax/communityTaxSlice';
import generalServiceReceiptsReducer from '../features/collections/generalServiceReceiptsSlice';
import disbursementJournalReducer from '../features/disbursement/disbursementJournalSlice';
import generalJournalReducer from '../features/disbursement/generalJournalSlice';
import realPropertyTaxReducer from '../features/collections/realPropertyTaxSlice';
import budgetReducer from '../features/budget/budgetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    subdepartments: subdepartmentReducer,
    users: userReducer,
    chartOfAccounts: chartOfAccountsReducer,
    vendors: vendorReducer,
    employees: employeeReducer,
    obligationRequests: obligationRequestReducer,
    disbursementVouchers: disbursementVoucherReducer,
    travelOrders: travelOrderReducer,
    generalReceipts: generalReceiptReducer,
    ppes: ppeReducer,
    approvalMatrix: approvalMatrixReducer,
    banks: bankReducer,
    documentDetails: documentDetailsReducer,
    items: itemReducer,
    invoiceChargeAccounts: invoiceChargeAccountsReducer,
    itemUnits: itemUnitsReducer,
    projectDetails: projectDetailsReducer,
    projectTypes: projectTypesReducer,
    financialStatements: financialStatementsReducer,
    fiscalYears: fiscalYearsReducer,
    taxCodes: taxCodesReducer,
    modeOfPayments: modeOfPaymentsReducer,
    paymentTerms: paymentTermsReducer,
    industries: industryReducer,
    communityTax: communityTaxReducer,
    generalServiceReceipts: generalServiceReceiptsReducer,
    disbursementJournal: disbursementJournalReducer,
    generalJournal: generalJournalReducer,
    realPropertyTax: realPropertyTaxReducer,
    budget: budgetReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;