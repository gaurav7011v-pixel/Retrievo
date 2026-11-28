import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";
import {
  Package,
  Search,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import {
  getAllItemsAdmin,
  updateItemStatus,
  deleteItemAdmin
} from "../api/itemService";


function ManageItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllItemsAdmin();

      const formattedItems = data.map((item) => ({
        id: item.id,
        name: item.itemName,
        category: item.category,
        type: item.itemType === "LOST" ? "Lost" : "Found",
        location: item.location,
        date: item.itemDate
          ? new Date(item.itemDate).toLocaleDateString("en-IN")
          : "N/A",
        reportedBy: item.reporterName || "Unknown",
        status: item.status,
        description: item.description,
        imageUrl: item.imageUrl
      }));

      setItems(formattedItems);

    } catch (error) {
      console.error("Error fetching items:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load items. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Delete an item
  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setActionLoading(true);

      await deleteItemAdmin(deleteItem.id);

      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== deleteItem.id)
      );

      setDeleteItem(null);
      setSelectedItem(null);

    } catch (error) {
      console.error("Error deleting item:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete item. Please try again."
      );

    } finally {
      setActionLoading(false);
    }
  };

  // Statistics
  const totalItems = items.length;

  const lostItems = items.filter(
    (item) => item.type === "Lost"
  ).length;

  const foundItems = items.filter(
    (item) => item.type === "Found"
  ).length;

  const recoveredItems = items.filter(
    (item) => item.status === "RETURNED"
  ).length;

  // Search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "All" || item.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "RETURNED":
        return "bg-green-50 text-green-700";

      case "CLAIMED":
        return "bg-blue-50 text-blue-700";

      case "CLOSED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "RETURNED":
        return <CheckCircle size={14} />;

      case "CLAIMED":
        return <AlertCircle size={14} />;

      default:
        return <Clock size={14} />;
    }
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      setActionLoading(true);

      const updatedItem = await updateItemStatus(itemId, newStatus);

      const formattedItem = {
        id: updatedItem.id,
        name: updatedItem.itemName,
        category: updatedItem.category,
        type: updatedItem.itemType === "LOST" ? "Lost" : "Found",
        location: updatedItem.location,
        date: updatedItem.itemDate
          ? new Date(updatedItem.itemDate).toLocaleDateString("en-IN")
          : "N/A",
        reportedBy: updatedItem.reporterName || "Unknown",
        status: updatedItem.status,
        description: updatedItem.description,
        imageUrl: updatedItem.imageUrl
      };

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? formattedItem : item
        )
      );

      setSelectedItem(formattedItem);

    } catch (error) {
      console.error("Error updating item status:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update item status."
      );

    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Page Heading */}
        <div>
          <p className="text-sm font-semibold text-[#6254C7]">
            ITEM MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
            Manage Items
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor and manage all lost and found reports submitted by students.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Items</p>
              <Package className="text-[#6254C7]" size={22} />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {totalItems}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Lost Items</p>
              <AlertCircle className="text-red-600" size={22} />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {lostItems}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Found Items</p>
              <Package className="text-blue-600" size={22} />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {foundItems}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Recovered Items</p>
              <CheckCircle className="text-green-600" size={22} />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {recoveredItems}
            </h2>
          </div>
        </div>

        {/* Items Management Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Heading and Search */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#20213A]">
                All Reported Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search, filter, and review submitted item reports.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search items or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6254C7]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter size={17} className="text-gray-400" />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6254C7]"
              >
                <option value="All">All Types</option>
                <option value="Lost">Lost Items</option>
                <option value="Found">Found Items</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6254C7]"
            >
              <option value="All">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RETURNED">Returned</option>
              <option value="CLOSED">Closed</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="text-sm font-semibold text-[#6254C7] hover:underline"
            >
              Clear Filters
            </button>
          </div>

          {/* Items Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-4 font-semibold">Item</th>
                  <th className="pb-4 font-semibold">Reported By</th>
                  <th className="pb-4 font-semibold">Type</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      Loading items...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-red-500">
                      {errorMessage}
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-5">
                        <div className="flex items-center gap-3">

                          {/* Item Image */}
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-purple-50">
                            {item.imageUrl ? (
                              <img
                                src={
                                  item.imageUrl.startsWith("http")
                                    ? item.imageUrl
                                    : `${api.defaults.baseURL.replace("/api", "")}${item.imageUrl}`
                                }
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#6254C7]">
                                <Package size={22} />
                              </div>
                            )}
                          </div>

                          {/* Item Information */}
                          <div>
                            <p className="font-semibold text-[#20213A]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {item.category}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {item.reportedBy}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${item.type === "Lost"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                            }`}
                        >
                          {item.type}
                        </span>
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {item.location}
                      </td>

                      <td className="py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </td>

                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            title="View Details"
                            className="rounded-lg border border-gray-200 p-2 text-[#6254C7] transition hover:bg-purple-50"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => setDeleteItem(item)}
                            title="Delete Item"
                            className="rounded-lg border border-gray-200 p-2 text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <Package
                        size={40}
                        className="mx-auto mb-3 text-gray-300"
                      />

                      <p className="font-semibold text-[#20213A]">
                        No Items Found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-gray-400">
            Showing {filteredItems.length} of {totalItems} items
          </p>
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6254C7]">
                    ITEM INFORMATION
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#20213A]">
                    Item Details
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl bg-purple-50">

                {/* Item Image */}
                {selectedItem.imageUrl ? (
                  <img
                    src={
                      selectedItem.imageUrl.startsWith("http")
                        ? selectedItem.imageUrl
                        : `${api.defaults.baseURL.replace("/api", "")}${selectedItem.imageUrl}`
                    }
                    alt={selectedItem.name}
                    className="h-56 w-full object-contain bg-gray-100"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center">
                    <Package size={45} className="text-[#6254C7]" />
                  </div>
                )}

                {/* Item Information */}
                <div className="p-5">
                  <h3 className="font-bold text-[#20213A]">
                    {selectedItem.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedItem.category}
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Report Type</span>
                  <span className="font-semibold text-[#20213A]">
                    {selectedItem.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Reported By</span>
                  <span className="font-semibold text-[#20213A]">
                    {selectedItem.reportedBy}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    Location
                  </span>

                  <span className="font-semibold text-[#20213A]">
                    {selectedItem.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    Date
                  </span>

                  <span className="font-semibold text-[#20213A]">
                    {selectedItem.date}
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Description
                  </p>

                  <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedItem.status
                    )}`}
                  >
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Update Item Status
                </label>

                <select
                  value={selectedItem.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedItem.id, e.target.value)
                  }
                  disabled={actionLoading}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6254C7] disabled:opacity-50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="CLAIMED">Claimed</option>
                  <option value="RETURNED">Returned</option>
                  <option value="CLOSED">Closed</option>
                </select>

                {actionLoading && (
                  <p className="mt-2 text-xs text-gray-400">
                    Updating status...
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="mt-6 w-full rounded-xl bg-[#6254C7] py-3 font-semibold text-white transition hover:bg-[#5143B5]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteItem && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={25} />
              </div>

              <h2 className="mt-4 text-center text-xl font-bold text-[#20213A]">
                Delete Item?
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#20213A]">
                  {deleteItem.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteItem(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageItems;