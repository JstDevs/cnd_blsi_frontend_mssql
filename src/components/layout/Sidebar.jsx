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
      { name: "Modules", href: "/settings/modules" },
      {
        name: "Users",
        submenu: [
          { name: "Approval Matrix", href: "/settings/approval-matrix" },
          { name: "User Access", href: "/settings/user-access" },
          { name: "User Roles", href: "/settings/user-roles" },
          { name: "User", href: "/settings/users" },
        ],
      },
      {
        name: "Real Property",
        submenu: [
          { name: "Tax Declaration", href: "/settings/tax-declaration" },
          { name: "Base Unit Value", href: "/settings/base-unit-value" },
          { name: "General Revision", href: "/settings/general-revision" },
        ],
      },
      {
        name: "Accounting Settings",
        submenu: [
          {
            name: "Bank Details",
            submenu: [
              { name: "Bank", href: "/settings/bank" },
              { name: "Currency", href: "/settings/currency" },
            ],
          },
          {
            name: "Document Details",
            submenu: [
              { name: "Document Type", href: "/settings/document-details" },
              { name: "Document Type Category", href: "/settings/document-type-categories" },
            ],
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
              { name: "Project Details", href: "/settings/project-details" },
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
      { name: "Customer", href: "/settings/customer" },
      {
        name: "Chart of Accounts Settings",
        submenu: [
          { name: "Chart of Accounts", href: "/settings/chart-of-accounts" },
          { name: "Account Group", href: "/settings/account-group" },
          { name: "Major Account Group", href: "/settings/major-account-group" },
          { name: "Sub Major Account Group", href: "/settings/sub-major-account-group" },
        ],
      },
      {
        name: "Vendors",
        submenu: [
          { name: "Vendor Details", href: "/settings/vendors" },
          { name: "Vendor Customer Type", href: "/settings/vendor-customer-type" },
          { name: "Vendor Type", href: "/settings/vendor-type" },
        ],
      },
      {
        name: "Employees",
        submenu: [
          { name: "Employees", href: "/settings/employees" },
          { name: "Employment Status", href: "/settings/employmentStatus" },
          { name: "Positions", href: "/settings/positions" },
          { name: "Nationalities", href: "/settings/nationalities" },
        ],
      },
      {
        name: "PPE Settings",
        submenu: [
          { name: "PPE List", href: "/settings/ppe" },
          { name: "PPE Categories", href: "/settings/ppe-categories" },
          { name: "PPE Suppliers", href: "/settings/ppe-suppliers" },
        ],
      },
      { name: "LGU Maintenance", href: "/settings/lgu-maintenance" },
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
    name: "Applications",
    icon: DocumentTextIcon,
    submenu: [
      { name: "Business Permits", href: "/applications/business-permits" },
      { name: "Cheque Generator", href: "/applications/cheque-generator" },
    ],
  },
  {
    name: "Budget",
    icon: DocumentDuplicateIcon,
    submenu: [
      // { name: "Budget Management", href: "/budget" },
      { name: "Budget Details", href: "/budget/details" },
      { name: "Budget Allotment", href: "/budget/allotment" },
      { name: "Budget Summary", href: "/budget/summary" },
      { name: "Budget Supplemental", href: "/budget/supplemental" },
      { name: "Budget Transfer", href: "/budget/transfer" },
      { name: "Budget Report", href: "/budget/report" },
      { name: "Funds", href: "/budget/funds" },
      { name: "Sub-funds", href: "/budget/sub-funds" },
      { name: "Fund Transfer", href: "/budget/fund-transfer" },
      { name: "Statement of Comparison", href: "/budget/statement-comparison" },
      {
        name: "Statement of Appropriation, Allotment, Obligation, Balances",
        href: "/budget/statement-appropriation",
      },
    ],
  },
  {
    name: "Reports",
    icon: ChartBarIcon,
    submenu: [
      { name: "General Ledger", href: "/reports/general-ledger" },
      { name: "Financial Statements", href: "/reports/financial-statements" },
      // { name: "Budget Reports", href: "/reports/budget" },
      { name: "Subsidiary Ledger", href: "/reports/subsidiary-ledger" },
      { name: "Trial Balance", href: "/reports/trial-balance" },
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
  parentPath = "",
}) {
  return (
    <div
      className={clsx(
        "space-y-1",
        level > 0 && "ml-4 border-l-2 border-neutral-200 pl-3" // Added left border for child items
      )}
    >
      {items.map((item) => {
        const itemPath = parentPath ? `${parentPath}.${item.name}` : item.name;
        const isExpanded = expandedMenus[itemPath];
        const hasActiveChild = isSubMenuActive(item.submenu || []);

        return (
          <div key={itemPath} className="relative">
            {item.submenu ? (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu(itemPath);
                  }}
                  className={clsx(
                    "group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    hasActiveChild
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100",
                    isExpanded && "border-l-4 border-primary-500",
                    level > 0 && "pl-2" // Adjust padding for nested items
                  )}
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <item.icon
                        className={clsx(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          hasActiveChild
                            ? "text-primary-500"
                            : "text-neutral-400 group-hover:text-neutral-500"
                        )}
                      />
                    )}
                    <span className="text-left">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className={clsx(
                        "h-5 w-5 transform transition-transform flex-shrink-0",
                        isExpanded
                          ? "rotate-180 text-primary-500"
                          : "text-neutral-400"
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
                  </div>
                </button>
                {isExpanded && (
                  <div className="mt-1">
                    {" "}
                    {/* Added margin top for separation */}
                    <SidebarMenu
                      items={item.submenu}
                      expandedMenus={expandedMenus}
                      toggleMenu={toggleMenu}
                      isActive={isActive}
                      isSubMenuActive={isSubMenuActive}
                      level={level + 1}
                      parentPath={itemPath}
                    />
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href}
                className={clsx(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                  level > 0 && "pl-2" // Adjust padding for nested items
                )}
              >
                {item.icon && (
                  <item.icon
                    className={clsx(
                      "mr-3 h-5 w-5 flex-shrink-0",
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
        );
      })}
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
