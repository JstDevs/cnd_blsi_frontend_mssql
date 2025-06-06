import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  HomeIcon,
  Cog6ToothIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ReceiptRefundIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

// Main navigation items organized by module
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Settings",
    icon: Cog6ToothIcon,
    submenu: [
      { name: "Departments", href: "/settings/departments" },
      { name: "Subdepartments", href: "/settings/subdepartments" },
      {
        name: "Users",
        submenu: [
          { name: "Approval Matrix", href: "/settings/approval-matrix" },
          // { name: "User Access", href: "/settings/user-access" },
          { name: "User", href: "/settings/users" },
        ],
      },
      {
        name: "Accounting Settings",
        submenu: [
          {
            name: "Bank Details",
            href: "/settings/bank",
          },
          {
            name: "Document Details",
            href: "/settings/document-details",
          },
          {
            name: "Items Settings",
            submenu: [
              { name: "Item List", href: "/settings/items" },
              { name: "Item Units", href: "/settings/items/units" },
              {
                name: "Invoice Charge Accounts",
                href: "/settings/items/invoice-charge-accounts",
              },
            ],
          },
          {
            name: "Project Settings",
            submenu: [
              // { name: "Project Details", href: "/settings/project-details" },
              { name: "Project Type", href: "/settings/project-type" },
            ],
          },
          {
            name: "Financial Statement",
            href: "/settings/financial-statement",
          },
          { name: "Fiscal Year", href: "/settings/fiscal-year" },
          { name: "Tax Code", href: "/settings/tax-code" },
          { name: "Mode of Payment", href: "/settings/mode-of-payment" },
          { name: "Payment Terms", href: "/settings/payment-terms" },
          { name: "Industry", href: "/settings/industry" },
        ],
      },
      { name: "Locations", href: "/settings/locations" },
      { name: "Chart of Accounts", href: "/settings/chart-of-accounts" },
      { name: "Vendors", href: "/settings/vendors" },
      { name: "Employees", href: "/settings/employees" },
      { name: "PPE", href: "/settings/ppe" },
    ],
  },
  {
    name: "Disbursement",
    icon: CurrencyDollarIcon,
    submenu: [
      { name: "Obligation Request", href: "/disbursement/obligation-requests" },
      { name: "Disbursement Voucher", href: "/disbursement/vouchers" },
      { name: "Travel Order", href: "/disbursement/travel-orders" },
      {
        name: "Journal Entry Voucher",
        href: "/disbursement/journal-entry-vouchers",
      },
      {
        name: "Disbursement Journals",
        href: "/disbursement/disbursement-journals",
      },
      { name: "General Journals", href: "/disbursement/general-journals" },
      { name: "Beginning Balance", href: "/disbursement/beginning-balance" },
      { name: "Purchase Request", href: "/disbursement/purchase-requests" },
      {
        name: "Fund Utilization Request",
        href: "/disbursement/fund-utilization-requests",
      },
    ],
  },
  {
    name: "Collections",
    icon: ReceiptRefundIcon,
    submenu: [
      { name: "Community Tax", href: "/collections/community-tax" },
      {
        name: "Community Tax Corporation",
        href: "/collections/community-tax-corporation",
      },
      {
        name: "General Service Receipt",
        href: "/collections/general-service-receipts",
      },
      {
        name: "Burial Service Receipt",
        href: "/collections/burial-service-receipts",
      },
      {
        name: "Marriage Service Receipt",
        href: "/collections/marriage-service-receipts",
      },
      { name: "Real Property Tax", href: "/collections/real-property-tax" },
      { name: "CashBook", href: "/collections/cashbook" },
      { name: "Collection Report", href: "/collections/reports" },
      {
        name: "Public Market Ticket",
        href: "/collections/public-market-tickets",
      },
    ],
  },
  {
    name: "Budget",
    icon: DocumentDuplicateIcon,
    submenu: [
      { name: "Budget Management", href: "/budget" },
      { name: "Budget Details", href: "/budget/details" },
      { name: "Budget Allotment", href: "/budget/allotment" },
      { name: "Budget Summary", href: "/budget/summary" },
      { name: "Budget Supplemental", href: "/budget/supplemental" },
      { name: "Budget Transfer", href: "/budget/transfer" },
      { name: "Budget Report", href: "/budget/report" },
      { name: "Funds", href: "/budget/funds" },
      // { name: 'Sub-funds', href: '/budget/sub-funds' },
      { name: "Fund Transfer", href: "/budget/fund-transfer" },
      // { name: "Statement of Comparison", href: "/budget/statement-comparison" },
      // {
      //   name: "Statement of Appropriation, Allotment, Obligation, Balances",
      //   href: "/budget/statement-appropriation",
      // },
    ],
  },
  {
    name: "Applications",
    icon: DocumentTextIcon,
    submenu: [
      { name: "Business Permits", href: "/applications/business-permits" },
      { name: "Cheque Generator", href: "/applications/cheque-generator" },
    ],
  },
  {
    name: "Reports",
    icon: ChartBarIcon,
    submenu: [
      { name: "General Ledger", href: "/reports/general-ledger" },
      { name: "Financial Statements", href: "/reports/financial-statements" },
      { name: "Budget Reports", href: "/reports/budget" },
      // { name: "Subsidiary Ledger", href: "/reports/subsidiary-ledger" },
      // { name: "Trial Balance", href: "/reports/trial-balance" },
    ],
  },
  {
    name: "BIR Reports",
    href: "/reports/bir",
    icon: ChartBarIcon,
  },
];

function SidebarMenu({
  items,
  expandedMenus,
  toggleMenu,
  isActive,
  isSubMenuActive,
  level = 0,
}) {
  return (
    <div className={level > 0 ? `pl-${level * 4} space-y-1` : ""}>
      {items.map((item) => (
        <div key={item.name}>
          {item.submenu ? (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu(item.name);
                }}
                className={clsx(
                  "group flex items-center justify-between text-left px-3 py-2 text-sm font-medium rounded-md w-full transition-colors",
                  isSubMenuActive(item.submenu)
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
              >
                {item.icon && (
                  <item.icon
                    className={clsx(
                      "mr-3 h-5 w-5",
                      isSubMenuActive(item.submenu)
                        ? "text-primary-500"
                        : "text-neutral-400 group-hover:text-neutral-500"
                    )}
                  />
                )}
                <span className="text-left">{item.name}</span>
                <svg
                  className={clsx(
                    "h-5 w-5 transform transition-transform ml-auto",
                    expandedMenus[item.name] ? "rotate-180" : ""
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {expandedMenus[item.name] && (
                <SidebarMenu
                  items={item.submenu}
                  expandedMenus={expandedMenus}
                  toggleMenu={toggleMenu}
                  isActive={isActive}
                  isSubMenuActive={isSubMenuActive}
                  level={level + 1}
                />
              )}
            </>
          ) : (
            <Link
              to={item.href}
              className={clsx(
                "group flex items-center justify-start text-left px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              {item.icon && (
                <item.icon
                  className={clsx(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive(item.href)
                      ? "text-primary-500"
                      : "text-neutral-400 group-hover:text-neutral-500"
                  )}
                />
              )}
              <span className="text-left">{item.name}</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const isSubMenuActive = (submenuItems) => {
    return submenuItems.some((item) =>
      item.href
        ? location.pathname === item.href
        : item.children && isSubMenuActive(item.children)
    );
  };

  return (
    <div className="h-full flex flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 bg-primary-800">
        <h1 className="text-white text-xl font-bold px-4">LGU System</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <SidebarMenu
            items={navigation}
            expandedMenus={expandedMenus}
            toggleMenu={toggleMenu}
            isActive={isActive}
            isSubMenuActive={isSubMenuActive}
          />
        </nav>
      </div>

      {user && (
        <div className="flex items-center px-4 py-3 border-t border-neutral-200 bg-white">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium text-sm">
              {user.firstName?.charAt(0) || ""}
              {user.lastName?.charAt(0) || ""}
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-700 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user.department}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
