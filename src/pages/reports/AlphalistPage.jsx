import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchAlphalist, resetAlphalistState } from '@/features/reports/alphalistSlice';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import AlphalistPrintView from './AlphalistPrintView';

const AlphalistPage = () => {
    const dispatch = useDispatch();
    const componentRef = useRef();
    const { funds } = useSelector((state) => state.funds);
    const { departments } = useSelector((state) => state.departments);
    const { alphalistData, isLoading } = useSelector((state) => state.alphalist);

    const [activeTab, setActiveTab] = useState('Annually');
    const [filters, setFilters] = useState({
        year: '',
        fundID: '',
        departmentID: '',
        quarter: '',
        month: '',
        taxTypes: {
            expanded: true,
            vat: true,
            percentage: true,
            other: true
        }
    });

    useEffect(() => {
        dispatch(resetAlphalistState());
        dispatch(fetchFunds());
        dispatch(fetchDepartments());
    }, [dispatch]);

    const tabs = ['Annually Report', 'Quarterly Report', 'Monthly Report'];

    const quarters = [
        { label: 'First Quarter', value: '1' },
        { label: 'Second Quarter', value: '2' },
        { label: 'Third Quarter', value: '3' },
        { label: 'Fourth Quarter', value: '4' },
    ];

    const months = [
        { label: 'January', value: '01' }, { label: 'February', value: '02' },
        { label: 'March', value: '03' }, { label: 'April', value: '04' },
        { label: 'May', value: '05' }, { label: 'June', value: '06' },
        { label: 'July', value: '07' }, { label: 'August', value: '08' },
        { label: 'September', value: '09' }, { label: 'October', value: '10' },
        { label: 'November', value: '11' }, { label: 'December', value: '12' },
    ];

    const years = Array.from({ length: 5 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { label: `Year ${y}`, value: y.toString() };
    });

    const columns = [
        { key: 'TIN', header: 'TIN', sortable: true },
        { key: 'Payee', header: 'Payee Name', sortable: true },
        { key: 'Tax Code', header: 'ATC', sortable: true },
        { key: 'Nature', header: 'Nature of Payment', sortable: true },
        { key: 'Sub-Total', header: 'Tax Base', sortable: true, className: 'text-right' },
        { key: 'Tax Rate', header: 'Tax Rate', sortable: true, className: 'text-right' },
        { key: 'Withheld Amount', header: 'Tax Withheld', sortable: true, className: 'text-right' },
    ];

    const handleTaxTypeChange = (type) => {
        setFilters({
            ...filters,
            taxTypes: {
                ...filters.taxTypes,
                [type]: !filters.taxTypes[type]
            }
        });
    };

    const handleView = () => {
        const { year, fundID, departmentID, quarter, month } = filters;

        if (!year) return toast.error('Please select a year');
        if (!fundID) return toast.error('Please select a fund');
        if (!departmentID) return toast.error('Please select a department');
        if (activeTab === 'Quarterly' && !quarter) return toast.error('Please select a quarter');
        if (activeTab === 'Monthly' && !month) return toast.error('Please select a month');

        dispatch(fetchAlphalist({ ...filters, reportType: activeTab }));
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Alphalist_${activeTab}_${filters.year}`,
    });

    const handleGenerateAlphalist = () => {
        if (!alphalistData || alphalistData.length === 0) {
            return toast.error('Please view the report first before generating the alphalist.');
        }
        handlePrint();
    };

    const handleExport = async () => {
        const { year, fundID, departmentID, quarter, month } = filters;

        if (!year) return toast.error('Please select a year');
        if (!fundID) return toast.error('Please select a fund');
        if (!departmentID) return toast.error('Please select a department');
        if (activeTab === 'Quarterly' && !quarter) return toast.error('Please select a quarter');
        if (activeTab === 'Monthly' && !month) return toast.error('Please select a month');

        try {
            toast.loading('Exporting to Excel...', { id: 'export-toast' });
            const API_URL = import.meta.env.VITE_API_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/alphalist/exportExcel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...filters, reportType: activeTab }),
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Alphalist_${activeTab}_${year}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Excel exported successfully', { id: 'export-toast' });
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export to Excel', { id: 'export-toast' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 border-none">Alpha List</h1>
                        <p className="text-sm text-neutral-600">
                            Generate and view Alphalist reports for tax withheld.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                {/* Tabs */}
                <div className="flex bg-neutral-50 border-b border-neutral-200">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.split(' ')[0])}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.split(' ')[0]
                                ? 'bg-white text-primary-600 border-b-2 border-b-primary-600'
                                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeTab === 'Quarterly' && (
                            <FormField
                                label="Quarter"
                                type="select"
                                options={quarters}
                                value={filters.quarter}
                                defaultOption="-- Select Quarter --"
                                onChange={(e) => setFilters({ ...filters, quarter: e.target.value })}
                            />
                        )}
                        {activeTab === 'Monthly' && (
                            <FormField
                                label="Month"
                                type="select"
                                options={months}
                                value={filters.month}
                                defaultOption="-- Select Month --"
                                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                            />
                        )}
                        <FormField
                            label="Year"
                            type="select"
                            options={years}
                            value={filters.year}
                            defaultOption="-- Select Year --"
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        />
                        <FormField
                            label="Fund"
                            type="select"
                            options={[{ label: 'All Funds', value: '%' }, ...funds.map(f => ({ label: f.Name, value: f.ID }))]}
                            value={filters.fundID}
                            defaultOption="-- Select Fund --"
                            onChange={(e) => setFilters({ ...filters, fundID: e.target.value })}
                        />
                        <FormField
                            label="Department"
                            type="select"
                            options={[{ label: 'All Departments', value: '%' }, ...departments.map(d => ({ label: d.Name, value: d.ID }))]}
                            value={filters.departmentID}
                            defaultOption="-- Select Department --"
                            onChange={(e) => setFilters({ ...filters, departmentID: e.target.value })}
                        />

                        <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
                            <button onClick={handleView} className="btn btn-secondary px-8">View</button>
                            <button onClick={handleGenerateAlphalist} className="btn btn-primary px-8">Generate Alphalist</button>
                            <button onClick={handleExport} className="btn btn-success px-8">Export to Excel</button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Tax Types</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.taxTypes.expanded}
                                    onChange={() => handleTaxTypeChange('expanded')}
                                    className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 leading-tight">Expanded Tax Withheld (WI and WC)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.taxTypes.vat}
                                    onChange={() => handleTaxTypeChange('vat')}
                                    className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 leading-tight">VAT Withheld (WV)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.taxTypes.percentage}
                                    onChange={() => handleTaxTypeChange('percentage')}
                                    className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 leading-tight">Percentage Tax Withheld (WB)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.taxTypes.other}
                                    onChange={() => handleTaxTypeChange('other')}
                                    className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 leading-tight">Other Taxes</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <DataTable columns={columns} data={alphalistData} pagination={true} showSearch={true} loading={isLoading} />
            </div>

            {/* Hidden Print View */}
            <div style={{ display: 'none' }}>
                <AlphalistPrintView
                    ref={componentRef}
                    data={alphalistData}
                    filters={filters}
                    reportType={activeTab}
                />
            </div>
        </div>
    );
};

export default AlphalistPage;
