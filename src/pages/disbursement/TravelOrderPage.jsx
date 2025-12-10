// export default TravelOrderPage;
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import { toast } from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import TravelOrderForm from '../../components/forms/TravelOrderForm';
import {
  fetchTravelOrders,
  addTravelOrder,
  updateTravelOrder,
  deleteTravelOrder,
} from '../../features/disbursement/travelOrderSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { CheckLine, Eye, View, X } from 'lucide-react';

function TravelOrderPage() {
  const dispatch = useDispatch();
  const { travelOrders, isLoading } = useSelector(
    (state) => state.travelOrders
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTravelOrder, setCurrentTravelOrder] = useState(null);
  const [isTOPActionLoading, setIsTOPActionLoading] = useState(false);
  // ---------------------USE MODULE PERMISSIONS------------------START (TravelOrderPage - MODULE ID = 80 )
  const { Add, Edit, Delete } = useModulePermissions(80);

  useEffect(() => {
    dispatch(fetchTravelOrders());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      if (currentTravelOrder) {
        await dispatch(
          updateTravelOrder({ ...values, ID: currentTravelOrder.ID })
        ).unwrap();
      } else {
        await dispatch(addTravelOrder(values)).unwrap();
      }

      setIsCreateModalOpen(false);
      setCurrentTravelOrder(null);
      toast.success('Success');
    } catch (error) {
      toast.error(error || 'Failed');
      throw error;
    }
  };

  const handleCreateTO = () => {
    setCurrentTravelOrder(null);
    setIsCreateModalOpen(true);
  };

  const handleViewTO = (to) => {
    setCurrentTravelOrder(to);
    setIsViewModalOpen(true);
  };

  const handleEditTO = (to) => {
    setCurrentTravelOrder(to);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (travelOrder) => {
    setCurrentTravelOrder(travelOrder);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (currentTravelOrder) {
      try {
        await dispatch(deleteTravelOrder(currentTravelOrder.ID)).unwrap();
        toast.success('Deleted');
      } catch (error) {
        console.error('Failed to delete travel order:', error);
        toast.error('Failed to delete travel order');
      } finally {
        setIsDeleteModalOpen(false);
        setCurrentTravelOrder(null);
      }
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentTravelOrder(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentTravelOrder(null);
  };

  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Table columns definition
  const columns = [
    {
      key: 'TransactionStatus',
      header: 'Status',
      sortable: true,
      render: (value) => {
        let bgColor = 'bg-neutral-100 text-neutral-800';

        switch (value) {
          case 'Requested':
            bgColor = 'bg-warning-100 text-warning-800';
            break;
          case 'Approval Progress':
            bgColor = 'bg-primary-100 text-primary-800';
            break;
          case 'Rejected':
            bgColor = 'bg-error-100 text-error-800';
            break;
          default:
            break;
        }

        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: 'BudgetDepartmentName',
      header: 'Office',
      sortable: true,
    },
    {
      key: 'DateCreated',
      header: 'Date of Filing',
      sortable: true,
    },
    {
      key: 'InvoiceNumber',
      header: 'Travel Order No.',
      sortable: true,
    },
    {
      key: 'No_of_Days',
      header: 'No. of Days',
      sortable: true,
    },
  ];

  const handleView = (values) => {
    handleViewTO(values);
  };

  // Travel Order Details Component
  const TravelOrderDetailsView = ({ travelOrder, onClose, onEdit }) => {
    const getTransportationMethods = () => {
      const methods = [];
      if (travelOrder.Plane) methods.push('Airplane');
      if (travelOrder.PUV) methods.push('Public Utility Vehicle');
      if (travelOrder.ServiceVehicle) methods.push('Service Vehicle');
      if (travelOrder.RentedVehicle) methods.push('Rented Vehicle');
      if (travelOrder.Vessels) methods.push('Vessel');
      return methods.length > 0 ? methods.join(', ') : 'Not specified';
    };

    const getTotalAmount = () => {
      return (
        travelOrder.TravelPayments?.reduce((total, payment) => {
          return total + parseFloat(payment.Amount || 0);
        }, 0) || 0
      );
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Requested':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Approval Progress':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-900">
                {travelOrder.InvoiceNumber}
              </h2>
              <p className="text-primary-700 mt-1">Travel Order Details</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  travelOrder.TransactionStatus
                )}`}
              >
                {travelOrder.TransactionStatus}
              </span>
              <p className="text-sm text-primary-600">
                Filed on {formatDate(travelOrder.DateCreated)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Travel Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
              Travel Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Destination
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.Place || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Venue
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.Venue || 'Not specified'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Start Date
                  </label>
                  <p className="text-gray-900 mt-1">
                    {formatDate(travelOrder.DateStart)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    End Date
                  </label>
                  <p className="text-gray-900 mt-1">
                    {formatDate(travelOrder.DateEnd)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Duration
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.No_of_Days} days
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Inclusive Dates
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.InclusivesDate || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Purpose & Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
              Purpose & Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Purpose
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.Purpose || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Office/Department
                </label>
                <p className="text-gray-900 mt-1">
                  {travelOrder.BudgetDepartmentName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Transportation
                </label>
                <p className="text-gray-900 mt-1">
                  {getTransportationMethods()}
                </p>
              </div>
              {travelOrder.Remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Remarks
                  </label>
                  <p className="text-gray-900 mt-1">{travelOrder.Remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Financial Information
            </h3>
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-primary-700 font-medium">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary-900">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>
              {travelOrder.TravelPayments &&
                travelOrder.TravelPayments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Payment Breakdown
                    </label>
                    <div className="space-y-2">
                      {travelOrder.TravelPayments.map((payment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                        >
                          <span className="text-gray-700">
                            {payment.Type ? 'Advance' : 'Reimbursement'}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(payment.Amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Travelers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
              Travelers
            </h3>
            <div className="space-y-3">
              {travelOrder.Travelers && travelOrder.Travelers.length > 0 ? (
                travelOrder.Travelers.map((traveler, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Traveler ID: {traveler.TravelerID}
                      </p>
                      <p className="text-sm text-gray-500">
                        Link ID: {traveler.LinkID}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No travelers specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        {((travelOrder.TravelDocuments &&
          travelOrder.TravelDocuments.length > 0) ||
          (travelOrder.Attachments && travelOrder.Attachments.length > 0)) && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <DocumentArrowDownIcon className="w-5 h-5 mr-2 text-primary-600" />
              Documents & Attachments
            </h3>

            {/* Travel Documents */}
            {travelOrder.TravelDocuments &&
              travelOrder.TravelDocuments.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Travel Documents
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {travelOrder.TravelDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 border border-gray-200 rounded-lg"
                      >
                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 truncate">
                          {doc.Name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Attachments */}
            {travelOrder.Attachments && travelOrder.Attachments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Attachments
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {travelOrder.Attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 truncate">
                          {attachment.DataName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.DataType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Close
          </button>
          {Edit && travelOrder.TransactionStatus === 'Rejected' && (
            <button type="button" onClick={onEdit} className="btn btn-primary">
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Travel Order
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleTOPAction = async (dv, action) => {
    setIsTOPActionLoading(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Travel Order ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Travel Order:`, error);
      toast.error(`Error ${action}ing Travel Order`);
    } finally {
      setIsTOPActionLoading(false);
    }
  };

  const actions = (row) => {
    const actionList = [];

    if (row?.TransactionStatus?.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditTO,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row?.TransactionStatus?.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleTOPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleTOPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center gap-4 max-sm:flex-col">
          <div>
            <h1>Travel Orders</h1>
            <p>Manage travel orders and authorizations</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleCreateTO}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Create Travel Order
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={travelOrders}
          actions={actions}
          loading={isLoading || isTOPActionLoading}
        />
      </div>

      {/* Travel Order Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentTravelOrder ? 'Edit Travel Order' : 'Create Travel Order'}
        size="xl"
      >
        <TravelOrderForm
          initialData={currentTravelOrder}
          onSubmit={handleSubmit}
          onClose={handleCloseCreateModal}
        />
      </Modal>

      {/* Travel Order View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Travel Order Details"
        size="2xl"
      >
        {currentTravelOrder && (
          <TravelOrderDetailsView
            travelOrder={currentTravelOrder}
            onClose={handleCloseViewModal}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the travel order "
            {currentTravelOrder?.InvoiceNumber}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TravelOrderPage;
