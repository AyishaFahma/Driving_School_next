'use client';

import { useAuth } from '@/app/context/AuthContext';
import { resolve } from 'path';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CgNotes } from 'react-icons/cg';
import { FaSpinner } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import { RiBillFill } from 'react-icons/ri';

type Payment = {
  id: string;
  payment_status: string;
  service_name: string;
  amount: string;
  added_date: string;
  mobile: string;
  service_id: string;
  user_id: string;
  cus_service_id: string;
  student_id: string;
  amount_total: string;
  discount: string;
  pay_amount: string;
  pending_amount: string;
  payment_method: string;
};

const Page = () => {
  const { state } = useAuth();
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);


  // Fetch payment history from API
  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/report/payment_history', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
          'Content-Type': 'application/json', // Added missing content type
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('data', data);       
        const uniqueData = removeDuplicates(data.data || []);
        setPaymentData(uniqueData);
        setFilteredData(uniqueData);
      } else {
        console.error('API error:', data.msg || 'Unknown error');
        setPaymentData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setPaymentData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove duplicates based on mobile + service_name combination
  const removeDuplicates = (data: Payment[]): Payment[] => {
    const seen = new Set<string>();
    return data.filter((item) => {
      const key = `${item.mobile}-${item.service_name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

 

  // Handle search input changes
  // start debouncing apply

  // Add this inside your component
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    console.log('search term updated' , value);
    

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
         
      // this will log only after debounce
      console.log('actual search executing with' , value);
      
      const searchFilteredData = paymentData.filter((item) => {
        // Convert payment_status values for better search matching
        let payStatus = item.payment_status?.toLowerCase() || '';

        // Map API status to display status for search
        if (payStatus === "completed") {
          payStatus = "fully paid";
        } else if (payStatus === "remaining") {
          payStatus = "partially paid";
        } else if (payStatus === "pending") {
          payStatus = "pending";
        }

        return (
          item.service_name.toLowerCase().includes(value.toLowerCase()) ||
          item.mobile.toLowerCase().includes(value.toLowerCase()) ||
          payStatus.includes(value.toLowerCase())
        );
      });

      setFilteredData(searchFilteredData);
      setCurrentPage(1); // Reset to first page when searching
    }, 300); // 300ms delay
  }, [paymentData]); // Add dependencies as needed

  //end of debouncing



  // Handle filter form submission
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      const newFilteredData = applyFilters();
      setFilteredData(newFilteredData);
      setCurrentPage(1); // Reset to first page when filtering
    } finally {
      setIsLoading(false);
    }
  };


   // Apply status filter
  const applyFilters = (): Payment[] => {
    let newFilteredData = paymentData;
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter(
        (item) => item.payment_status === selectedStatus
      );
    }
    return newFilteredData;
  };


  // Reset all filters
  const handleReset = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      setSearchTerm('');
      setSelectedStatus('');
      setFilteredData(paymentData);
      setCurrentPage(1); // Reset to first page when resetting
    } finally {
      setIsLoading(false);
    }
  };

  // Open payment details in new tab
  const handleOpenPaymentPage = (item: Payment) => {
    try {
      // store payment data in sessionstorage
      sessionStorage.setItem('viewPaymentData', JSON.stringify({
        user_id: item.user_id,  // these data from the clicked row
        cus_service_id: item.cus_service_id,
        mobile: item.mobile,
        service_name: item.service_name
      }));

      // open new tab with view-payment page
      window.open(`/admin/report/view-payment`, '_blank');
    } catch (error) {
      console.error('Error opening payment page:', error);
      // Fallback: open with URL parameters
      window.open(`/admin/report/view-payment?user_id=${item.user_id}&cus_service_id=${item.cus_service_id}`, '_blank');
    }
  };

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Fetch data on component mount
  useEffect(() => {
    fetchPaymentHistory();
  }, [state]);

  // Add this useEffect for cleanup in debouncing
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);



  return (
    <div className="w-full pb-8">
      {/* Header Section */}
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Payment History
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">
              Home
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>Reports</li>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <li>Payment History</li>
        </ul>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
            <form onSubmit={handleFilterSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Status Filter */}
                <div className='flex-1'>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Status
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="remaining">Remaining</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className='flex-1 mt-6'>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <i className='fa fa-filter' style={{ marginTop: '3px', marginRight: '3px' }}></i>
                    {isLoading ? 'Filtering...' : 'Filter'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <i className='fa fa-refresh' style={{ marginTop: '3px', marginRight: '3px' }}></i>
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search and Table Section */}
      <div className="flex items-center justify-between py-5 lg:py-6">
        <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
          Payment History
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <div className="card px-4 pb-4 sm:px-5">
          <div className="mt-5">
            {/* Search Bar */}
            <div className="gridjs-head mb-2 ">
              <div className="gridjs-search">
                <input
                  type="search"
                  placeholder="Search by mobile, service, or status..."
                  aria-label="Search payments"
                  className="text-sm gridjs-input gridjs-search-input w-full p-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto w-full">
              <table className="is-hoverable w-full text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      #
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Mobile
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Service Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Amount
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Status
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Date
                    </th>
                    <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Loading payment data...</p>
                      </td>
                    </tr>
                  ) : currentEntries.length > 0 ? (
                    currentEntries.map((item, index) => (
                      <tr key={`${item.id}-${index}`} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                        <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                          {index + indexOfFirstEntry + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {item.mobile}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {item.service_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          ₹{parseFloat(item.amount || '0').toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {item.payment_status === "completed" && (
                            <div className="badge space-x-2.5 rounded-full bg-success/10 text-success">
                              <IoMdCheckmark />
                              <span>Fully paid</span>
                            </div>
                          )}
                          {item.payment_status === "pending" && (
                            <div className="badge space-x-2.5 rounded-full bg-error/10 text-error">
                              <FiClock />
                              <span>Pending</span>
                            </div>
                          )}
                          {item.payment_status === "remaining" && (
                            <div className="badge space-x-2.5 rounded-full bg-info/10 text-info">
                              <CgNotes />
                              <span>Partially paid</span>
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {new Date(item.added_date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleOpenPaymentPage(item)}
                              className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25"
                              title="View Payment Details"
                            >
                              <RiBillFill />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          <p className="text-lg font-medium">No payments found</p>
                          <p className="text-sm mt-1">
                            {paymentData.length === 0 ? 'No payment data available' : 'Try adjusting your search or filters'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalEntries > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                {/* Entries Info */}
                <div className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        className={`px-3 py-2 border rounded-md text-sm min-w-[40px] ${currentPage === pageNum
                          ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                          : "border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;