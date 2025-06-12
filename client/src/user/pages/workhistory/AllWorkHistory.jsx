import React, { useEffect, useState } from "react";
import api from "../../../axios";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaCheck,
  FaTimes,
  FaEdit,
  FaUserTie,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import moment from "moment";

const AllWorkHistory = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/work-histories");
      setWorkHistory(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch work history.");
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredItems = () => {
    let filtered = [...workHistory];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.company?.name &&
            item.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "company") {
          aValue = a.company?.name || "";
          bValue = b.company?.name || "";
        }

        if (["start_date", "end_date"].includes(sortConfig.key)) {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`api/work-histories/${id}`);
      setWorkHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.post(`api/work-histories/${id}/verify`);
      toast.success("Verified successfully!");
      fetchData(); // Refresh data after verification
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    return moment(dateString).format("MMM D, YYYY");
  };

  const sortedItems = getSortedAndFilteredItems();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <FaUserTie className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Work History Records
            </h2>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search positions or companies..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["id", "position", "company", "start_date", "end_date", "verified"].map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort(key)}
                    >
                      <div className="flex items-center capitalize">
                        {key.replace("_", " ")} {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.position}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.company?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.start_date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.end_date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.verified ? (
                          <span className="text-green-600 font-semibold">Verified</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 space-x-3">
                        {!item.verified && (
                          <button
                            onClick={() => handleVerify(item.id)}
                            title="Verify"
                            className="text-green-600 cursor-pointer hover:text-green-800"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllWorkHistory;
