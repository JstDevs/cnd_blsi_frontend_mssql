import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, logout } from './features/auth/authSlice';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Settings pages
import DepartmentPage from './pages/settings/DepartmentPage';
import CurrencyPage from './pages/settings/CurrencyPage';
import SubdepartmentPage from './pages/settings/SubdepartmentPage';
import UserPage from './pages/settings/UserPage';
import ChartOfAccountsPage from './pages/settings/ChartOfAccountsPage';
import AccountGroupPage from './pages/settings/AccountGroupPage';
import MajorAccountGroupPage from './pages/settings/MajorAccountGroupPage';
import SubMajorAccountGroupPage from './pages/settings/SubMajorAccountGroupPage';
import VendorDetailsPage from './pages/settings/VendorDetailsPage';
import VendorCustomerTypePage from './pages/settings/VendorCustomerTypePage';
import VendorTypePage from './pages/settings/VendorTypePage';
import ModulesPage from './pages/settings/ModulesPage';

import EmployeePage from './pages/settings/EmployeePage';
import EmploymentStatus from './pages/settings/EmploymentStatus';
import PositionPage from './pages/settings/PositionPage';
import UserrolesPage from './pages/settings/UserrolesPage';
import NationalitiesPage from './pages/settings/NationalitiesPage';
import LocationPage from './pages/settings/LocationPage';
import PPEPage from './pages/settings/PPE/PPEPage';
import PpeCategoriesPage from './pages/settings/PpeCategoriesPage';
import PpeSuppliersPage from './pages/settings/PpeSuppliersPage';

import ApprovalMatrixPage from './pages/settings/ApprovalMatrixPage';
import BankPage from './pages/settings/BankPage';
import DocumentDetailsPage from './pages/settings/DocumentDetailsPage';
import DocumentTypeCategoriesPage from './pages/settings/DocumentTypeCategoriesPage';
import ItemPage from './pages/settings/ItemPage';
import InvoiceChargeAccountsPage from './pages/settings/InvoiceChargeAccountsPage';
import ItemUnitPage from './pages/settings/ItemUnitPage';
import ProjectTypePage from './pages/settings/Accounting/Project/ProjectTypePage';
import ProjectDetailsPage from './pages/settings/ProjectDetailsPage';
import FinancialStatementPage from './pages/settings/FinancialStatementPage';
import FiscalYearPage from './pages/settings/FiscalYearPage';
import TaxCodePage from './pages/settings/TaxCodePage';
import ModeOfPaymentPage from './pages/settings/ModeOfPaymentPage';
import PaymentTermsPage from './pages/settings/PaymentTermsPage';
import IndustryPage from './pages/settings/IndustryPage';
import Customer from './pages/settings/Customer';
// Setting --> real Prohject
// import TaxDeclaration from "./pages/settings/RealProject/TaxDeclaration";
import TaxDeclarationPage from './pages/settings/TaxDeclarationPage';
import GeneralRevision from './pages/settings/RealProject/GeneralRevision';
import BaseUnitValue from './pages/settings/RealProject/BaseUnitValue';
// Disbursement pages
import ObligationRequestPage from './pages/disbursement/ObligationRequestPage';
import DisbursementVoucherPage from './pages/disbursement/DisbursementVoucherPage';
import TravelOrderPage from './pages/disbursement/TravelOrderPage';
import JournalEntryPage from './pages/disbursement/JournalEntryPage';
import DisbursementJournalPage from './pages/disbursement/DisbursementJournalPage';
import GeneralJournalPage from './pages/disbursement/GeneralJournalPage';
import BeginningBalancePage from './pages/disbursement/BeginningBalancePage';
import PurchaseRequestPage from './pages/disbursement/PurchaseRequestPage';
import FundUtilizationRequestPage from './pages/fund-utilization/FundUtilizationRequestPage';
import FundUtilizationPage from './pages/disbursement/FundUtilizationPage';

// Collections pages
// import GeneralReceiptPage from './pages/collections/GeneralReceiptPage';
import CommunityTaxPage from './pages/collections/CommunityTax/CommunityTaxPage';
import CommunityTaxCorporationPage from './pages/collections/CommunityTaxCorporation/CommunityTaxCorporationPage';
// import RealPropertyTaxPage from './pages/collections/RealPropertyTaxPage';
import MarketCollectionsPage from './pages/collections/MarketCollectionsPage';
import BurialServiceReceiptPage from './pages/collections/BurialServiceReceiptPage';
import MarriageServiceReceiptPage from './pages/collections/MarriageServiceReceiptPage';
// import CashbookPage from './pages/collections/Cashbook/CashbookPage';
// import CollectionReportPage from './pages/collections/CollectionReport/CollectionReportPage';
import PublicMarketTicketPage from './pages/collections/PublicMarketTicketPage';

// Budget pages
import BudgetAllotment from './pages/budget/form-budget/BudgetAllotment';
import BudgetReport from './pages/budget/form-budget/BudgetReport';
import BudgetTransfer from './pages/budget/form-budget/BudgetTransfer';
import BudgetDetails from './pages/budget/form-budget/BudgetDetails';
import NewBudgetPage from './pages/budget/newBudget';
import BudgetSummary from './pages/budget/form-budget/BudgetSummary';
import BudgetSupplemental from './pages/budget/form-budget/BudgetSupplemental';
import FundsManagement from './pages/budget/form-budget/FundsManagement';
import SubFundsPage from './pages/budget/SubFundsPage';
import FundTransfer from './pages/budget/form-budget/FundTransfer';
// import TrialBalance from './pages/reports/TrialBalance';
import BudgetPage from './pages/budget/BudgetPage';
import StatementComparison from './pages/budget/form-budget/StatementComparison';
import StatementAppropriation from './pages/budget/form-budget/StatementAppropriation';
import LGUMaintenance from './pages/settings/LGUMaintenance';

// Applications pages
import BusinessPermitPage from './pages/applications/BusinessPermitPage';
import ChequeGeneratorPage from './pages/applications/ChequeGeneratorPage';

// Reports pages
import GeneralLedgerPage from './pages/reports/GeneralLedgerPage';
import SubsidiaryLedger from './pages/reports/SubsidiaryLedger';
import FinancialStatementsPage from './pages/reports/FinancialStatementsPage';
import BudgetReportPage from './pages/reports/BudgetReportPage';
import BirReportPage from './pages/reports/BirReportPage';
// User Access
import UserAccessPage from './pages/userAccess';
import ChangePassword from './pages/auth/ChangePassword';
import UserProfilePage from './pages/userProfile';
import BudgetDashboardPage from './pages/budget/BudgetDashboardPage';
import DisbursementDashboardPage from './pages/disbursement/DisbursementDashboardPage';
import CollectionDashboardPage from './pages/collections/CollectionDashboardPage';
import GeneralReceiptPage from './pages/collections/GeneralReceipt/GeneralReceiptPage';
import RealPropertyTaxPage from './pages/collections/RealProprtyTax/RealPropertyTaxPage';
import TrialBalance from './pages/reports/TrialBalance';
import TrialBalancePage from './pages/reports/TrialBalancePage';
import BudgetAllotmentPage from './pages/budget/BudgetAllotmentPage';
import BudgetDetailsPage from './pages/budget/BudgetDetailsPage';
import BudgetSummaryPage from './pages/budget/BudgetSummaryPage';
import BudgetSupplementalPage from './pages/budget/BudgetSupplementalPage';
import BudgetTransferPage from './pages/budget/BudgetTransferPage';
import BudgetFundsPage from './pages/budget/BudgetFundsPage';
import BudgetSummaryOfComparison from './pages/budget/BudgetSummaryOfComparison';
import BudgetStatementOfAppropriation from './pages/budget/BudgetStatementOfAppropriation';
import BudgetSubFundsPage from './pages/budget/BudgetSubFundsPage';
import BudgetFundTransferPage from './pages/budget/BudgetFundTransferPage';
import CollectionReportPage from './pages/collections/CollectionReport/CollectionReportPage';
import CashbookPage from './pages/collections/Cashbook/CashbookPage';

function App() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  // const [isAuthLayout, setIsAuthLayout] = useState(false);

  useEffect(() => {
    // Check if user is already logged in via token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile(token));
    }
  }, [dispatch]);

  useEffect(() => {
    // Check if the current route is part of the AuthLayout
    const authRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
    ];
    // setIsAuthLayout(authRoutes.includes(location.pathname));
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <RegistrationPage />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <ForgotPasswordPage />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <ResetPasswordPage />
              )
            }
          />
        </Route>

        {/* Dashboard Layout Routes (Protected) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* user profile */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/budget-dashboard" element={<BudgetDashboardPage />} />
          <Route
            path="/disbursement-dashboard"
            element={<DisbursementDashboardPage />}
          />
          <Route
            path="/collection-dashboard"
            element={<CollectionDashboardPage />}
          />

          {/*-------------------------- Settings module-------------------- */}
          <Route path="/settings/departments" element={<DepartmentPage />} />
          <Route path="/settings/customer" element={<Customer />} />
          <Route
            path="/settings/lgu-maintenance"
            element={<LGUMaintenance />}
          />
          <Route
            path="/settings/subdepartments"
            element={<SubdepartmentPage />}
          />
          {/* // TODO REMOVE THIS ......  */}
          <Route path="/settings/modules" element={<ModulesPage />} />
          <Route path="/settings/users" element={<UserPage />} />
          <Route path="/settings/user-roles" element={<UserrolesPage />} />
          <Route path="/settings/user-access" element={<UserAccessPage />} />
          <Route
            path="/settings/chart-of-accounts"
            element={<ChartOfAccountsPage />}
          />
          <Route
            path="/settings/account-group"
            element={<AccountGroupPage />}
          />
          <Route
            path="/settings/major-account-group"
            element={<MajorAccountGroupPage />}
          />
          <Route
            path="/settings/sub-major-account-group"
            element={<SubMajorAccountGroupPage />}
          />
          <Route path="/settings/vendors" element={<VendorDetailsPage />} />
          <Route
            path="/settings/vendor-customer-type"
            element={<VendorCustomerTypePage />}
          />
          <Route path="/settings/vendor-type" element={<VendorTypePage />} />
          <Route path="/settings/employees" element={<EmployeePage />} />
          <Route
            path="/settings/employmentStatus"
            element={<EmploymentStatus />}
          />
          <Route path="/settings/positions" element={<PositionPage />} />
          <Route
            path="/settings/nationalities"
            element={<NationalitiesPage />}
          />
          <Route path="/settings/locations" element={<LocationPage />} />
          <Route path="/settings/ppe" element={<PPEPage />} />
          <Route
            path="/settings/ppe-categories"
            element={<PpeCategoriesPage />}
          />
          <Route
            path="/settings/ppe-suppliers"
            element={<PpeSuppliersPage />}
          />

          <Route
            path="/settings/approval-matrix"
            element={<ApprovalMatrixPage />}
          />
          <Route path="/settings/bank" element={<BankPage />} />
          <Route path="/settings/currency" element={<CurrencyPage />} />
          <Route
            path="/settings/document-details"
            element={<DocumentDetailsPage />}
          />
          <Route
            path="/settings/document-type-categories"
            element={<DocumentTypeCategoriesPage />}
          />
          <Route path="/settings/items" element={<ItemPage />} />
          {/* <Route
            path="/settings/items/invoice-charge-accounts"
            element={<InvoiceChargeAccountsPage />}
          /> */}
          <Route path="/settings/items/units" element={<ItemUnitPage />} />
          <Route path="/settings/project-type" element={<ProjectTypePage />} />
          <Route
            path="/settings/financial-statement"
            element={<FinancialStatementPage />}
          />
          <Route path="/settings/fiscal-year" element={<FiscalYearPage />} />
          <Route path="/settings/tax-code" element={<TaxCodePage />} />
          <Route
            path="/settings/mode-of-payment"
            element={<ModeOfPaymentPage />}
          />
          <Route
            path="/settings/payment-terms"
            element={<PaymentTermsPage />}
          />
          <Route path="/settings/industry" element={<IndustryPage />} />
          <Route
            path="/settings/project-details"
            element={<ProjectDetailsPage />}
          />
          {/* ---SETTING--REAL--PROJECT------> */}
          <Route
            path="/settings/tax-declaration"
            element={<TaxDeclarationPage />}
          />
          <Route path="/settings/base-unit-value" element={<BaseUnitValue />} />
          <Route
            path="/settings/general-revision"
            element={<GeneralRevision />}
          />

          {/*------------------------ Disbursement module----------------------- */}
          <Route
            path="/disbursement/obligation-requests"
            element={<ObligationRequestPage />}
          />
          <Route
            path="/disbursement/vouchers"
            element={<DisbursementVoucherPage />}
          />
          <Route
            path="/disbursement/travel-orders"
            element={<TravelOrderPage />}
          />
          <Route
            path="/disbursement/journal-entry-vouchers"
            element={<JournalEntryPage />}
          />
          <Route
            path="/disbursement/disbursement-journals"
            element={<DisbursementJournalPage />}
          />
          <Route
            path="/disbursement/general-journals"
            element={<GeneralJournalPage />}
          />
          <Route
            path="/disbursement/beginning-balance"
            element={<BeginningBalancePage />}
          />
          <Route
            path="/disbursement/purchase-requests"
            element={<PurchaseRequestPage />}
          />
          <Route
            path="/disbursement/fund-utilization-requests"
            element={<FundUtilizationPage />}
          />

          {/* Collections module */}
          {/* <Route
            path="/collections/receipts"
            element={<GeneralReceiptPage />}
          /> */}
          <Route
            path="/collections/community-tax"
            element={<CommunityTaxPage />}
          />
          <Route
            path="/collections/community-tax-corporation"
            element={<CommunityTaxCorporationPage />}
          />
          <Route
            path="/collections/real-property-tax"
            element={<RealPropertyTaxPage />}
          />
          <Route
            path="/collections/market"
            element={<MarketCollectionsPage />}
          />
          <Route
            path="/collections/general-service-receipts"
            // element={<GeneralServiceReceiptPage />}
            element={<GeneralReceiptPage />}
          />
          <Route
            path="/collections/burial-service-receipts"
            element={<BurialServiceReceiptPage />}
          />
          <Route
            path="/collections/marriage-service-receipts"
            element={<MarriageServiceReceiptPage />}
          />
          <Route path="/collections/cashbook" element={<CashbookPage />} />
          <Route
            path="/collections/reports"
            element={<CollectionReportPage />}
          />
          <Route
            path="/collections/public-market-tickets"
            element={<PublicMarketTicketPage />}
          />

          {/* Budget module */}
          <Route path="/budget" element={<BudgetPage />} />

          <Route path="/budget/allotment" element={<BudgetAllotmentPage />} />
          <Route path="/budget/details" element={<BudgetDetailsPage />} />
          <Route path="/budget/new" element={<NewBudgetPage />} />
          <Route path="/budget/summary" element={<BudgetSummaryPage />} />
          <Route
            path="/budget/supplemental"
            element={<BudgetSupplementalPage />}
          />
          <Route path="/budget/transfer" element={<BudgetTransferPage />} />
          <Route path="/budget/report" element={<BudgetReportPage />} />
          <Route path="/budget/funds" element={<BudgetFundsPage />} />
          <Route path="/budget/sub-funds" element={<BudgetSubFundsPage />} />

          <Route
            path="/budget/fund-transfer"
            element={<BudgetFundTransferPage />}
          />
          <Route
            path="/budget/statement-comparison"
            element={<StatementComparison />}
          />
          <Route
            path="/budget/statement-appropriation"
            element={<BudgetStatementOfAppropriation />}
          />

          {/*----------------------- Applications module ----------------------------*/}
          <Route
            path="/applications/business-permits"
            element={<BusinessPermitPage />}
          />
          <Route
            path="/applications/cheque-generator"
            element={<ChequeGeneratorPage />}
          />

          {/*-------------------------- Reports module --------------------------*/}
          <Route
            path="/reports/general-ledger"
            element={<GeneralLedgerPage />}
          />
          <Route
            path="/reports/subsidiary-ledger"
            element={<SubsidiaryLedger />}
          />
          <Route
            path="/reports/financial-statements"
            element={<FinancialStatementsPage />}
          />
          <Route path="/reports/budget" element={<BudgetReportPage />} />
          <Route path="/reports/bir" element={<BirReportPage />} />
          {/* <Route path="/reports/trial-balance" element={<TrialBalance />} /> */}
          <Route path="/reports/trial-balance" element={<TrialBalancePage />} />

          {/* ---------------------------CHANGE PASSWORD------------------- */}
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard\" replace />} />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
