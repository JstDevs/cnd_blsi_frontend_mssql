import Modal from '@/components/common/Modal';
import React from 'react';

const RealPropertyTaxViewModal = ({
  isOpen,
  onClose,
  property,
  onEdit,
  Edit, // permission prop
}) => {
  if (!property) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH');
  };

  const getStatusBadge = (status) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (status) {
      case 'Posted':
      case 'Active':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Requested':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Rejected':
        bgColor = 'bg-error-100 text-error-800';
        break;
      default:
        break;
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}
      >
        {status}
      </span>
    );
  };

  const getFundName = (fundId) => {
    switch (fundId) {
      case 1:
        return 'General Fund';
      case 2:
        return 'Special Education Fund';
      default:
        return `Fund ${fundId}` || 'N/A';
    }
  };

  const getPaymentMode = () => {
    if (property.ModeofPayment) return property.ModeofPayment;
    if (property.CheckNumber && property.CheckNumber !== '0') return 'Check';
    if (property.MoneyOrder) return 'Money Order';
    return 'Cash';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Real Property Tax Details"
      size="xl"
    >
      <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Details */}
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Property Tax Details
            </h3>
            <dl className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">
                  Link ID
                </dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2 font-mono">
                  {property.LinkID || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">
                  TD Number
                </dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2 font-mono">
                  {property.T_D_No || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">
                  Municipality
                </dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2">
                  {property.Municipality || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">
                  General Revision
                </dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2">
                  {property.GeneralRevision || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">Status</dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2">
                  {getStatusBadge(property.Status)}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-neutral-500">
                  Created Date
                </dt>
                <dd className="text-sm text-neutral-900 sm:col-span-2">
                  {formatDate(property.CreatedDate)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Customer Information */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              Customer Information
            </h3>
            <dl className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-blue-700">Name</dt>
                <dd className="text-sm text-blue-900 sm:col-span-2 font-medium">
                  {property.CustomerName || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-blue-700">
                  Received From
                </dt>
                <dd className="text-sm text-blue-900 sm:col-span-2">
                  {property.ReceivedFrom || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-blue-700">
                  Billing Address
                </dt>
                <dd className="text-sm text-blue-900 sm:col-span-2">
                  {property.BillingAddress || 'N/A'}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-blue-700">TIN</dt>
                <dd className="text-sm text-blue-900 sm:col-span-2">
                  {property.TIN || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <h3 className="text-lg font-medium text-green-900 mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">
                Amount Received
              </dt>
              <dd className="text-lg font-bold text-green-900">
                {formatCurrency(parseFloat(property.AmountReceived || 0))}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">
                Remaining Balance
              </dt>
              <dd className="text-lg font-bold text-orange-700">
                {formatCurrency(parseFloat(property.RemainingBalance || 0))}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">
                Previous Payment
              </dt>
              <dd className="text-lg font-bold text-green-900">
                {formatCurrency(parseFloat(property.PreviousPayment || 0))}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">Fund</dt>
              <dd className="text-sm text-green-900">
                {getFundName(property.FundsID)}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">
                Payment Mode
              </dt>
              <dd className="text-sm text-green-900">{getPaymentMode()}</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-sm font-medium text-green-700">
                Check Number
              </dt>
              <dd className="text-sm text-green-900 font-mono">
                {property.CheckNumber && property.CheckNumber !== '0'
                  ? property.CheckNumber
                  : 'N/A'}
              </dd>
            </div>
          </div>
          {property.AmountinWords && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <dt className="text-sm font-medium text-green-700 mb-1">
                Amount in Words
              </dt>
              <dd className="text-sm text-green-900 italic">
                {property.AmountinWords}
              </dd>
            </div>
          )}
        </div>

        {/* Advanced Payment Information */}
        {property.AdvanceFunds && parseFloat(property.AdvanceFunds) > 0 && (
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h3 className="text-lg font-medium text-purple-900 mb-4">
              Advanced Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <dt className="text-sm font-medium text-purple-700">
                  Advanced Year
                </dt>
                <dd className="text-sm text-purple-900">
                  {property.AdvancedYear || 'N/A'}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-purple-700">
                  Advanced Funds
                </dt>
                <dd className="text-lg font-bold text-purple-900">
                  {formatCurrency(parseFloat(property.AdvanceFunds || 0))}
                </dd>
              </div>
            </div>
          </div>
        )}

        {/* Properties List */}
        {property.properties && property.properties.length > 0 && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-medium text-orange-900 mb-4">
              Property Details ({property.properties.length} properties)
            </h3>
            <div className="space-y-4">
              {property.properties.map((prop, index) => (
                <div
                  key={prop.ID || index}
                  className={`p-4 bg-white rounded-lg border-2 ${
                    prop.Present ? 'border-green-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">
                      Property {index + 1}
                      {prop.Present && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-700">
                        {formatCurrency(parseFloat(prop.Total || 0))}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Owner:</span>
                      <div className="text-gray-900">{prop.Owner || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Location:
                      </span>
                      <div className="text-gray-900">
                        {prop.Location || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Lot & Block:
                      </span>
                      <div className="text-gray-900">
                        {prop.Lot && prop.Block
                          ? `${prop.Lot}, ${prop.Block}`
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Land Price:
                      </span>
                      <div className="text-gray-900">
                        {formatCurrency(parseFloat(prop.LandPrice || 0))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Improvement:
                      </span>
                      <div className="text-gray-900">
                        {formatCurrency(parseFloat(prop.ImprovementPrice || 0))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Assessed Value:
                      </span>
                      <div className="text-gray-900 font-medium">
                        {formatCurrency(
                          parseFloat(prop.TotalAssessedValue || 0)
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Tax Due:
                      </span>
                      <div className="text-gray-900">
                        {formatCurrency(parseFloat(prop.TaxDue || 0))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Penalty:
                      </span>
                      <div className="text-red-600">
                        {formatCurrency(parseFloat(prop.Penalty || 0))}
                      </div>
                    </div>
                    {prop.Discount && parseFloat(prop.Discount) > 0 && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Discount:
                        </span>
                        <div className="text-green-600">
                          -{formatCurrency(parseFloat(prop.Discount || 0))}
                        </div>
                      </div>
                    )}
                  </div>

                  {prop.InstallmentPayment &&
                    parseFloat(prop.InstallmentPayment) > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">
                              Installment Payment:
                            </span>
                            <div className="text-blue-600 font-medium">
                              {formatCurrency(
                                parseFloat(prop.InstallmentPayment || 0)
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Full Payment:
                            </span>
                            <div className="text-green-600 font-medium">
                              {formatCurrency(
                                parseFloat(prop.FullPayment || 0)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remarks */}
        {property.Remarks && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Remarks</h4>
            <p className="text-sm text-gray-600">{property.Remarks}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Close
          </button>
          {Edit && (
            <button
              type="button"
              onClick={() => onEdit(property)}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RealPropertyTaxViewModal;
