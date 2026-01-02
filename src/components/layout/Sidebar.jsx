import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
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
  EllipsisHorizontalIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { CalculatorIcon, ChartBar, CoinsIcon, Ellipsis, LayoutDashboardIcon, ReceiptTextIcon, BanknoteIcon, Settings, HandCoinsIcon } from 'lucide-react';

const DashboardIcon = LayoutDashboardIcon;
const DisbursementIcon = BanknoteIcon;
const CollectionsIcon = ReceiptTextIcon;
const BudgetIcon = HandCoinsIcon;
const SettingsIcon = Settings;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon }, // public, no moduleId
  {
    name: 'Disbursement',
    icon: DisbursementIcon,
    submenu: [
      { name: 'Obligation Request',       href: '/disbursement/obligation-requests',    moduleId: 62, },
      { name: 'Disbursement Voucher',     href: '/disbursement/vouchers',               moduleId: 40, },
      { name: 'Journal Entry Voucher',    href: '/disbursement/journal-entry-vouchers', moduleId: 57, },
      { name: 'Purchase Request',         href: '/disbursement/purchase-requests',      moduleId: 69, },
      { name: 'Fund Utilization Request', href: '/disbursement/fund-utilization-requests',  moduleId: 47, },
      { name: 'Beginning Balance',        href: '/disbursement/beginning-balance',      moduleId: 21, },
      { name: 'Travel Order',             href: '/applications/travel-orders',          moduleId: 80, },
      {
        name: 'Reports',
        submenu: [
          { name: 'Disbursement Journals',  href: '/disbursement/disbursement-journals',  moduleId: 32, }, // Check & Cash Disbursement?
          { name: 'General Journals',       href: '/disbursement/general-journals',       moduleId: 49, },
          { name: 'General Ledger',         href: '/reports/general-ledger',              moduleId: 50, },
          { name: 'Subsidiary Ledger',      href: '/reports/subsidiary-ledger',           moduleId: 77, },
          { name: 'Trial Balance',          href: '/reports/trial-balance',               moduleId: 81, },
          { name: 'Financial Statements',   href: '/reports/financial-statements' }, // no mapping
          { name: 'BIR Reports',            href: '/reports/bir',                         moduleId: 16, },
        ]
      }
    ],
  },
  {
    name: 'Collections',
    icon: CollectionsIcon,
    submenu: [
      { name: 'Community Tax Individual',   href: '/collections/community-tax',             moduleId: 34, },
      { name: 'Community Tax Corporate',    href: '/collections/community-tax-corporation', moduleId: 35, },
      { name: 'General Service Invoice',    href: '/collections/general-service-receipts',  moduleId: 52, },
      { name: 'Burial Service Receipt',     href: '/collections/burial-service-receipts',   moduleId: 28, },
      { name: 'Marriage Service Receipt',   href: '/collections/marriage-service-receipts', moduleId: 59, },
      { name: 'Real Property Tax Receipt',  href: '/collections/real-property-tax',         moduleId: 70, },
      { name: 'Public Market Ticket',       href: '/collections/public-market-tickets',     moduleId: 68, },
      { name: 'Business Permits',           href: '/applications/business-permits',         moduleId: 29, },
      {
        name: 'Reports',
        submenu: [
          { name: 'Cashbook', href: '/collections/cashbook', moduleId: 30 },
          { name: 'Collection Report', href: '/collections/reports' },
        ]
      }
    ],
  },
  {
    name: 'Budget',
    icon: BudgetIcon,
    submenu: [
      { name: 'Funds',                href: '/budget/funds',          moduleId: 48 },
      // { name: 'Sub-funds',            href: '/budget/sub-funds',      moduleId: 97 },
      { name: 'Budget Appropriation', href: '/budget/details',        moduleId: 22 },
      { name: 'Budget Allotment',     href: '/budget/allotment',      moduleId: 23 },
      { name: 'Budget Supplemental',  href: '/budget/supplemental',   moduleId: 26 },
      { name: 'Budget Transfer',      href: '/budget/transfer',       moduleId: 27 },
      { name: 'Budget Summary',       href: '/budget/summary',        moduleId: 25 },
      { name: 'Fund Transfer',        href: '/budget/fund-transfer',  moduleId: 46 },
      {
        name: 'Reports',
        submenu: [
          { name: 'Budget Report',              href: '/budget/report',                  moduleId: 24 },
          { name: 'Statement of Comparison',    href: '/budget/statement-comparison',    moduleId: 73 },
          { name: 'Statement of Appropriation', href: '/budget/statement-appropriation', moduleId: 72 },
        ] 
      },
    ],
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    submenu: [
      { name: 'Departments',        href: '/settings/departments',        moduleId: 39, },
      { name: 'Subdepartments',     href: '/settings/subdepartments',     moduleId: 76, },
      { name: 'LGU Maintenance',    href: '/settings/lgu-maintenance',    moduleId: 58, },
      { name: 'Locations',          href: '/settings/locations' }, // no mapping DONE
      {
        name: 'User Settings',
        submenu: [
          { name: 'User Details',   href: '/settings/users',        moduleId: 82, },
          { name: 'User Access',    href: '/settings/user-access',  moduleId: 83, },
        ],
      },
      {
        name: 'Employee Settings',
        submenu: [
          { name: 'Employee Details',   href: '/settings/employees',        moduleId: 43, },
          { name: 'Employment Status',  href: '/settings/employmentStatus', moduleId: 93, },
          { name: 'Positions',          href: '/settings/positions',        moduleId: 36, },
          { name: 'Roles',              href: '/settings/user-roles',       moduleId: 84, }, // no mapping
          { name: 'Nationalities',      href: '/settings/nationalities',    moduleId: 94, },
          { name: 'Approval Matrix',    href: '/settings/approval-matrix',  moduleId: 17, },
        ],
      },
      {
        name: 'Partner Settings',
        submenu: [
          { name: 'Vendors',      href: '/settings/vendors',  moduleId: 86, },
          { name: 'Individuals',  href: '/settings/customer', moduleId: 38, },
        ],
      },
      {
        name: 'Accounting Settings',
        submenu: [
          {
            name: 'Bank Details',
            submenu: [
              { name: 'Bank',     href: '/settings/bank',     moduleId: 18 },
              { name: 'Currency', href: '/settings/currency', moduleId: 37 },
            ],
          },
          {
            name: 'Document Details',
            submenu: [
              { name: 'Document Type',          href: '/settings/document-details',         moduleId: 41, },
              { name: 'Document Type Category', href: '/settings/document-type-categories', moduleId: 42, },
            ],
          },
          {
            name: 'Items Settings',
            submenu: [
              { name: 'Item List',  href: '/settings/items',        moduleId: 55 },
              { name: 'Item Units', href: '/settings/items/units',  moduleId: 56, },
            ],
          },
          {
            name: 'Project Settings',
            submenu: [
              { name: 'Project Details',  href: '/settings/project-details',  moduleId: 65, },
              { name: 'Project Type',     href: '/settings/project-type',     moduleId: 87, },
            ],
          },
          { name: 'Financial Statement',  href: '/settings/financial-statement',  moduleId: 44, },
          { name: 'Fiscal Year',          href: '/settings/fiscal-year',          moduleId: 45, },
          { name: 'Tax Code',             href: '/settings/tax-code',             moduleId: 78, },
          { name: 'Mode of Payment',      href: '/settings/mode-of-payment',      moduleId: 60, },
          { name: 'Payment Terms',        href: '/settings/payment-terms',        moduleId: 63, },
          { name: 'Industry',             href: '/settings/industry',             moduleId: 53, },
        ],
      },
      {
        name: 'Chart of Accounts Settings',
        submenu: [
          { name: 'Chart of Accounts',        href: '/settings/chart-of-accounts',        moduleId: 31, },
          { name: 'Account Group',            href: '/settings/account-group',            moduleId: 88, },
          { name: 'Major Account Group',      href: '/settings/major-account-group',      moduleId: 89, },
          { name: 'Sub Major Account Group',  href: '/settings/sub-major-account-group',  moduleId: 90, },
        ],
      },
      {
        name: 'Real Property Settings',
        submenu: [
          { name: 'Tax Declaration',    href: '/settings/tax-declaration',    moduleId: 79, },
          { name: 'Base Unit Value',    href: '/settings/base-unit-value',    moduleId: 20, },
          { name: 'General Revision',   href: '/settings/general-revision',   moduleId: 51, },
        ],
      },
      {
        name: 'PPE Settings',
        submenu: [
          { name: 'PPE List',         href: '/settings/ppe',            moduleId: 64, },
          { name: 'PPE Categories',   href: '/settings/ppe-categories', moduleId: 95, },
          { name: 'PPE Suppliers',    href: '/settings/ppe-suppliers',  moduleId: 96, },
        ],
      },
    ],
  },
];

function SidebarMenu({
  items,
  expandedMenus,
  toggleMenu,
  isActive,
  isSubMenuActive,
  level = 0,
  parentPath = '',
  hasViewPermission,
}) {
  return (
    <div
      className={clsx(
        'space-y-1',
        level > 0 && 'ml-4 border-l-2 border-neutral-200 pl-3' // Added left border for child items
      )}
    >
      {items.map((item) => {
        const itemPath = parentPath ? `${parentPath}.${item.name}` : item.name;
        const isExpanded = expandedMenus[itemPath];
        const hasActiveChild = isSubMenuActive(item.submenu || []);
        // Skip rendering if no view permission
        if (!hasViewPermission(item.moduleId)) return null;

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
                    'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    hasActiveChild
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100',
                    isExpanded && 'border-l-4 border-primary-500',
                    level > 0 && 'pl-2' // Adjust padding for nested items
                  )}
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <item.icon
                        className={clsx(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          hasActiveChild
                            ? 'text-primary-500'
                            : 'text-neutral-400 group-hover:text-neutral-500'
                        )}
                      />
                    )}
                    <span className="text-left">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className={clsx(
                        'h-5 w-5 transform transition-transform flex-shrink-0',
                        isExpanded
                          ? 'rotate-180 text-primary-500'
                          : 'text-neutral-400'
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
                    {' '}
                    {/* Added margin top for separation */}
                    <SidebarMenu
                      items={item.submenu}
                      expandedMenus={expandedMenus}
                      toggleMenu={toggleMenu}
                      isActive={isActive}
                      isSubMenuActive={isSubMenuActive}
                      level={level + 1}
                      parentPath={itemPath}
                      hasViewPermission={hasViewPermission}
                    />
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href}
                className={clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
                  level > 0 && 'pl-2' // Adjust padding for nested items
                )}
              >
                {item.icon && (
                  <item.icon
                    className={clsx(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive(item.href)
                        ? 'text-primary-500'
                        : 'text-neutral-400 group-hover:text-neutral-500'
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
  const { user, selectedRole } = useSelector((state) => state.auth);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isActive = (href) => {
    return location.pathname === href || location.pathname === href + '/';
  };

  const isSubMenuActive = (submenuItems) => {
    return submenuItems.some((item) =>
      item.href
        ? location.pathname === item.href
        : item.children && isSubMenuActive(item.children)
    );
  };
  // console.log('selectedRole', selectedRole);
  // Check if the user is an admin
  const isAdmin = selectedRole?.Description === 'Administrator';

  // Check if the user has view permission for a specific module
  function hasViewPermission(moduleId) {
    if (isAdmin) return true;
    if (!moduleId) return true; // Public
    if (!selectedRole?.ModuleAccesses) return false;
    const mod = selectedRole.ModuleAccesses.find(
      (m) => m.ModuleID === moduleId
    );

    return mod?.View;
  }

  // Filter navigation items based on permissions
  const filteredNavigation = navigation
    .map((item) => {
      if (item.submenu) {
        const filteredSubs = item.submenu.filter((sub) => {
          if (sub.submenu) {
            const filteredSubSubs = sub.submenu.filter((ss) =>
              hasViewPermission(ss.moduleId)
            );
            return filteredSubSubs.length > 0;
          }
          return hasViewPermission(sub.moduleId);
        });
        if (filteredSubs.length > 0) {
          return { ...item, submenu: filteredSubs };
        }
        return null;
      }
      return hasViewPermission(item.moduleId) ? item : null;
    })
    .filter(Boolean);

  return (
    <div className="h-full flex flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 bg-primary-800">
        <h1 className="text-white text-xl font-bold px-4">LGU System</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <SidebarMenu
            items={filteredNavigation}
            expandedMenus={expandedMenus}
            toggleMenu={toggleMenu}
            isActive={isActive}
            isSubMenuActive={isSubMenuActive}
            hasViewPermission={hasViewPermission}
          />
        </nav>
      </div>

      {user && (
        <div className="flex items-center px-4 py-3 border-t border-neutral-200 bg-white">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium text-sm">
              {user.firstName?.charAt(0) || ''}
              {user.lastName?.charAt(0) || ''}
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-700 truncate">
              {user.UserName || 'User'}
            </p>
            <p className="hidden text-xs text-neutral-500 truncate">
              {user.department}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
