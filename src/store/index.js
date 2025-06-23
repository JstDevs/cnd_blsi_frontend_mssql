import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import departmentReducer from '../features/settings/departmentSlice';
import currencyReducer from '../features/settings/currencySlice';
import subdepartmentReducer from '../features/settings/subdepartmentSlice';
import userReducer from '../features/settings/userSlice';
import chartOfAccountsReducer from '../features/settings/chartOfAccountsSlice';
import accountGroupReducer from '../features/settings/accountGroupSlice';
import majorAccountGroupReducer from '../features/settings/majorAccountGroupSlice';
import subMajorAccountGroupReducer from '../features/settings/subMajorAccountGroupSlice';
import vendorReducer from '../features/settings/vendorSlice';
import employeeReducer from '../features/settings/employeeSlice';
import obligationRequestReducer from '../features/disbursement/obligationRequestSlice';
import disbursementVoucherReducer from '../features/disbursement/disbursementVoucherSlice';
import travelOrderReducer from '../features/disbursement/travelOrderSlice';
import generalReceiptReducer from '../features/collections/generalReceiptSlice';
import ppeReducer from '../features/settings/ppeSlice';
import approvalMatrixReducer from '../features/settings/approvalMatrixSlice';
import bankReducer from '../features/settings/bankSlice';
import {documentDetailsReducer} from '../features/settings/documentDetailsSlice';
import {itemReducer} from '../features/settings/itemSlice';
import invoiceChargeAccountsReducer from '../features/settings/invoiceChargeAccountsSlice';
import { itemUnitsReducer } from '../features/settings/itemUnitsSlice';
import { projectDetailsReducer } from '../features/settings/projectDetailsSlice';
import { projectTypesReducer } from '../features/settings/projectTypesSlice';
import financialStatementReducer from '../features/settings/financialStatementSlice';
import { fiscalYearsReducer } from '../features/settings/fiscalYearSlice';
import { taxCodesReducer } from '../features/settings/taxCodeSlice';
import { modeOfPaymentsReducer } from '../features/settings/modeOfPaymentSlice';
import { paymentTermsReducer } from '../features/settings/paymentTermsSlice';
import { industriesReducer } from '../features/settings/industrySlice';
import { employmentStatusReducer } from '../features/settings/employmentStatusSlice';
import { positionReducer } from '../features/settings/positionSlice';
import { documentTypeCategoriesReducer } from '../features/settings/documentTypeCategoriesSlice';
import { userrolesReducer } from '../features/settings/userrolesSlice';
import { nationalityReducer } from '../features/settings/nationalitiesSlice';
import { vendorCustomerTypesReducer } from '../features/settings/vendorCustomerTypeSlice';
import { vendorTypesReducer } from '../features/settings/vendorTypeSlice';
import { regionsReducer } from '../features/settings/regionsSlice';
import { provincesReducer } from '../features/settings/provincesSlice';
import { municipalitiesReducer } from '../features/settings/municipalitiesSlice';
import { barangaysReducer } from '../features/settings/barangaysSlice';
import { generalRevisionsReducer } from '../features/settings/generalRevisionSlice';
import { modulesReducer } from '../features/settings/modulesSlice';
import { ppeCategoriesReducer } from '../features/settings/ppeCategoriesSlice';
import { ppeSuppliersReducer } from '../features/settings/ppeSuppliersSlice';

import { subFundsReducer } from '../features/budget/subFundsSlice';
import { budgetDashboardReducer } from '../features/budget/budgetDashboardSlice';
import { vendorDetailsReducer } from '../features/settings/vendorDetailsSlice';

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
    currencies: currencyReducer,
    subdepartments: subdepartmentReducer,
    users: userReducer,
    chartOfAccounts: chartOfAccountsReducer,
    accountGroups: accountGroupReducer,
    majorAccountGroups: majorAccountGroupReducer,
    subMajorAccountGroups: subMajorAccountGroupReducer,
    vendors: vendorReducer,
    employees: employeeReducer,
    obligationRequests: obligationRequestReducer,
    disbursementVouchers: disbursementVoucherReducer,
    travelOrders: travelOrderReducer,
    generalReceipts: generalReceiptReducer,
    ppes: ppeReducer,
    ppeCategories: ppeCategoriesReducer,
    ppeSuppliers: ppeSuppliersReducer,
    approvalMatrix: approvalMatrixReducer,
    banks: bankReducer,
    documentDetails: documentDetailsReducer,
    documentTypeCategories: documentTypeCategoriesReducer,
    items: itemReducer,
    invoiceChargeAccounts: invoiceChargeAccountsReducer,
    itemUnits: itemUnitsReducer,
    projectDetails: projectDetailsReducer,
    projectTypes: projectTypesReducer,
    financialStatements: financialStatementReducer,
    fiscalYears: fiscalYearsReducer,
    taxCodes: taxCodesReducer,
    modeOfPayments: modeOfPaymentsReducer,
    paymentTerms: paymentTermsReducer,
    industries: industriesReducer,
    employmentStatuses: employmentStatusReducer,
    positions: positionReducer,
    userroles: userrolesReducer,
    nationalities: nationalityReducer,
    vendorCustomerTypes: vendorCustomerTypesReducer,
    vendorTypes: vendorTypesReducer,
    regions: regionsReducer,
    provinces: provincesReducer,
    municipalities: municipalitiesReducer,
    barangays: barangaysReducer,
    generalRevisions: generalRevisionsReducer,
    modules: modulesReducer,
    communityTax: communityTaxReducer,
    generalServiceReceipts: generalServiceReceiptsReducer,
    disbursementJournal: disbursementJournalReducer,
    generalJournal: generalJournalReducer,
    realPropertyTax: realPropertyTaxReducer,
    budget: budgetReducer,
    subFunds: subFundsReducer,
    budgetDashboard: budgetDashboardReducer,
    vendorDetails: vendorDetailsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;