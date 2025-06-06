import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "./features/auth/authSlice";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

// Settings pages
import DepartmentPage from "./pages/settings/DepartmentPage";
import SubdepartmentPage from "./pages/settings/SubdepartmentPage";
import UserPage from "./pages/settings/UserPage";
import ChartOfAccountsPage from "./pages/settings/ChartOfAccountsPage";
import VendorPage from "./pages/settings/VendorPage";
import EmployeePage from "./pages/settings/EmployeePage";
import LocationPage from "./pages/settings/LocationPage";
import PPEPage from "./pages/settings/PPE/PPEPage";
import ApprovalMatrixPage from "./pages/settings/ApprovalMatrixPage";
import BankPage from "./pages/settings/BankPage";
import DocumentDetailsPage from "./pages/settings/DocumentDetailsPage";
import ItemPage from "./pages/settings/ItemPage";
import InvoiceChargeAccountsPage from "./pages/settings/InvoiceChargeAccountsPage";
import ItemUnitPage from "./pages/settings/ItemUnitPage";
import ProjectTypePage from "./pages/settings/ProjectTypePage";
import FinancialStatementPage from "./pages/settings/FinancialStatementPage";
import FiscalYearPage from "./pages/settings/FiscalYearPage";
import TaxCodePage from "./pages/settings/TaxCodePage";
import ModeOfPaymentPage from "./pages/settings/ModeOfPaymentPage";
import PaymentTermsPage from "./pages/settings/PaymentTermsPage";
import IndustryPage from "./pages/settings/IndustryPage";

// Disbursement pages
import ObligationRequestPage from "./pages/disbursement/ObligationRequestPage";
import DisbursementVoucherPage from "./pages/disbursement/DisbursementVoucherPage";
import TravelOrderPage from "./pages/disbursement/TravelOrderPage";
import JournalEntryPage from "./pages/disbursement/JournalEntryPage";
import DisbursementJournalPage from "./pages/disbursement/DisbursementJournalPage";
import GeneralJournalPage from "./pages/disbursement/GeneralJournalPage";
import BeginningBalancePage from "./pages/disbursement/BeginningBalancePage";
import PurchaseRequestPage from "./pages/disbursement/PurchaseRequestPage";
import FundUtilizationRequestPage from "./pages/fund-utilization/FundUtilizationRequestPage";

// Collections pages
import GeneralReceiptPage from "./pages/collections/GeneralReceiptPage";
import CommunityTaxPage from "./pages/collections/CommunityTaxPage";
import CommunityTaxCorporationPage from "./pages/collections/CommunityTaxCorporationPage";
import RealPropertyTaxPage from "./pages/collections/RealPropertyTaxPage";
import MarketCollectionsPage from "./pages/collections/MarketCollectionsPage";
import GeneralServiceReceiptPage from "./pages/collections/GeneralServiceReceiptPage";
import BurialServiceReceiptPage from "./pages/collections/BurialServiceReceiptPage";
import MarriageServiceReceiptPage from "./pages/collections/MarriageServiceReceiptPage";
import CashbookPage from "./pages/collections/CashbookPage";
import CollectionReportPage from "./pages/collections/CollectionReportPage";
import PublicMarketTicketPage from "./pages/collections/PublicMarketTicketPage";

// Budget pages
import AnnualBudgetPage from "./pages/budget/AnnualBudgetPage";
import AllotmentPage from "./pages/budget/AllotmentPage";
import FundsPage from "./pages/budget/FundsPage";
import BudgetTransferPage from "./pages/budget/BudgetTransferPage";
import BudgetPage from "./pages/budget/BudgetPage";

// Applications pages
import BusinessPermitPage from "./pages/applications/BusinessPermitPage";
import ChequeGeneratorPage from "./pages/applications/ChequeGeneratorPage";

// Reports pages
import GeneralLedgerPage from "./pages/reports/GeneralLedgerPage";
import FinancialStatementsPage from "./pages/reports/FinancialStatementsPage";
import BudgetReportPage from "./pages/reports/BudgetReportPage";
import BirReportPage from "./pages/reports/BirReportPage";
import BudgetAllotment from "./pages/budget/form-budget/BudgetAllotment";
import BudgetReport from "./pages/budget/form-budget/BudgetReport";
import BudgetTransfer from "./pages/budget/form-budget/BudgetTransfer";
import Dashboard from "./pages/budget/form-budget/Dashboard";
import BudgetDetails from "./pages/budget/form-budget/BudgetDetails";
import BudgetSummary from "./pages/budget/form-budget/BudgetSummary";
import BudgetSupplemental from "./pages/budget/form-budget/BudgetSupplemental";
import FundsManagement from "./pages/budget/form-budget/FundsManagement";
import FundTransfer from "./pages/budget/form-budget/FundTransfer";
import TrialBalance from "./pages/budget/form-budget/TrialBalance";

function App() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isAuthLayout, setIsAuthLayout] = useState(false);

  useEffect(() => {
    // Check if user is already logged in via token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserProfile(token));
    }
  }, [dispatch]);

  useEffect(() => {
    // Check if the current route is part of the AuthLayout
    const authRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];
    setIsAuthLayout(authRoutes.includes(location.pathname));
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
        <Route
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Settings module */}
          <Route path="/settings/departments" element={<DepartmentPage />} />
          <Route
            path="/settings/subdepartments"
            element={<SubdepartmentPage />}
          />
          <Route path="/settings/users" element={<UserPage />} />
          <Route
            path="/settings/chart-of-accounts"
            element={<ChartOfAccountsPage />}
          />
          <Route path="/settings/vendors" element={<VendorPage />} />
          <Route path="/settings/employees" element={<EmployeePage />} />
          <Route path="/settings/locations" element={<LocationPage />} />
          <Route path="/settings/ppe" element={<PPEPage />} />
          <Route
            path="/settings/approval-matrix"
            element={<ApprovalMatrixPage />}
          />
          <Route path="/settings/bank" element={<BankPage />} />
          <Route
            path="/settings/document-details"
            element={<DocumentDetailsPage />}
          />
          <Route path="/settings/items" element={<ItemPage />} />
          <Route
            path="/settings/items/invoice-charge-accounts"
            element={<InvoiceChargeAccountsPage />}
          />
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

          {/* Disbursement module */}
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
            element={<FundUtilizationRequestPage />}
          />

          {/* Collections module */}
          <Route
            path="/collections/receipts"
            element={<GeneralReceiptPage />}
          />
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
            element={<GeneralServiceReceiptPage />}
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
          {/* <Route path="/budget/annual" element={<AnnualBudgetPage />} />
          <Route path="/budget/allotment" element={<AllotmentPage />} />
          <Route path="/budget/funds" element={<FundsPage />} />
          <Route path="/budget/transfers" element={<BudgetTransferPage />} /> */}
          <Route path="/budget/allotment" element={<BudgetAllotment />} />
          <Route path="/budget/details" element={<BudgetDetails />} />
          <Route path="/budget/summary" element={<BudgetSummary />} />
          <Route path="/budget/supplemental" element={<BudgetSupplemental />} />
          <Route path="/budget/transfer" element={<BudgetTransfer />} />
          <Route path="/budget/report" element={<BudgetReport />} />
          <Route path="/budget/funds" element={<FundsManagement />} />
          {/* <Route path="/budget/sub-funds" element={<SubFunds />} /> */}
          <Route path="/budget/fund-transfer" element={<FundTransfer />} />
          {/* <Route
            path="/budget/statement-comparison"
            element={<StatementComparison />}
          /> */}
          {/* <Route
            path="/budget/statement-appropriation"
            element={<StatementAppropriation />}
          /> */}

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
          {/* <Route
            path="reports/trial-balance"
            element={<TrialBalance />}
          /> */}
          <Route
            path="/reports/financial-statements"
            element={<FinancialStatementsPage />}
          />
          <Route path="/reports/budget" element={<BudgetReportPage />} />
          <Route path="/reports/bir" element={<BirReportPage />} />
          {/* <Route path="/reports/tail-balance" element={<TrialBalance />} /> */}
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
