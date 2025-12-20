
"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useRef, useState } from "react";
import Add from "./add";
import { useAuth } from "@/app/context/AuthContext";
import { FaChevronDown, FaRegCheckCircle, FaSpinner } from "react-icons/fa";
import Edit from "./edit";


type Staff = {
  id?: string;
  user_id: string;
  status: string;
  staff_name: string;
  first_name: string;
  mobile: string;
  address: string;
  email: string;
  branch_id: string;
  branch_name: string;
  date_of_joining: string;
  name: string;
  place: string;
  password: string;
  text: string;
};



const page = () => {

  const { state } = useAuth();

  const [showmodal, setShowmodal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null);

  const [filteredData, setFilteredData] = useState<Staff[]>([]);

  const [searchTerm, setSearchTerm] = useState('');


  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [searchStaff, setSearchStaff] = useState("");

  const [searchStaffData, setSearchStaffData] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState("");

  const [searchBranchData, setSearchBranchData] = useState<Staff[]>([]);
  const [filteredBranch, setFilteredBranch] = useState<Staff[]>([]);
  const [isbranchDropdownOpen, setIsbranchDropdownOpen] = useState(false);
  const staffDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const togglemodal = (mode: 'add' | 'edit', staff: Staff | null = null) => {
    setModalMode(mode);
    setEditedStaff(staff);
    setShowmodal((prev) => !prev);
    fetchStaffData();
  };


  // Function to remove duplicates based on mobile + name combination use in fetchStaffData
  const removeDuplicatesByMobileAndName = (data: Staff[]): Staff[] => {
    const seen = new Map<string, Staff>();

    data.forEach(staff => {
      const key = `${staff.mobile}_${staff.first_name}`;
      if (!seen.has(key)) {
        seen.set(key, staff);
      }
    });

    return Array.from(seen.values());
  };

  // fetch all staff data
  const fetchStaffData = async () => {
    try {

      const response = await fetch('/api/admin/settings/get_all_staff', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({user_type:"staff"}),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("all staff data", data);


      if (data.message.status === true) {

        const uniqueData = removeDuplicatesByMobileAndName(data.message.data || []);

        console.log(`Original: ${data.message.data?.length || 0} records`);
        console.log(`After deduplication: ${uniqueData.length} records`);

        setStaffData(uniqueData);
        setFilteredData(uniqueData);

      } else {
        console.error("API error: Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  useEffect(() => {
    fetchStaffData();
  }, [state]);



  const handleEdit = (staff: Staff) => {
    setEditedStaff(staff);
    setShowmodal(true);
  };




  // searchTerm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    //console.log(value);


    const searchFilteredData = staffData.filter((item) =>

      item.mobile?.toLowerCase().includes(value.toLowerCase()) ||
      item.status?.toLowerCase().includes(value.toLowerCase()) ||
      item.first_name?.toLowerCase().includes(value.toLowerCase()) ||
      item.address?.toLowerCase().includes(value.toLowerCase())
    );
    //console.log(searchFilteredData);


    setFilteredData(searchFilteredData);
  };


  // filter functions

  const applyFilters = () => {
    let newFilteredData = staffData;

    // Apply form filters
    if (selectedStaff) {
      newFilteredData = newFilteredData.filter(
        (item) => item.first_name === selectedStaff
      );
    }
    if (selectedBranch) {
      newFilteredData = newFilteredData.filter(
        (item) => item.branch_name === selectedBranch
      );
    }
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter(
        (item) => item.status === selectedStatus
      );
    }

    return newFilteredData;
  };

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Simulate a delay to show the loader (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newFilteredData = applyFilters();
    setFilteredData(newFilteredData);
    setIsLoading(false); // Stop loading
  };

  // reset function
  const handleReset = async () => {
    setIsLoading(true); // Start loading

    // Simulate a delay to show the loader (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSearchTerm("");
    setSelectedStaff("");
    setSelectedBranch("");
    setSelectedStatus("");
    setFilteredData(staffData);
    setIsLoading(false); // Stop loading
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);


  // update status
  const updateAccountStatus = async (user_id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/settings/inactivate_staff', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({
          id: user_id,
          status: status,
          table: "daily_accounts"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {

        fetchStaffData();
      } else {
        console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };


  // staff names for filtering
  const fetchSearchStaff = async () => {
    try {
      const response = await fetch("/api/admin/report/get_staff_autocomplete", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("Search mobile data", data.data);

      if (data.success) {
        setSearchStaffData(data.data.staff_details || []);
        setFilteredStaff(data.data.staff_details || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSearchStaff();
  }, [state]);

  const handleSearchStaff = (e: any) => {
    const value = e.target.value;
    setSearchStaff(value);

    const searchData = searchStaffData.filter(
      (item) =>
        item.text.toLowerCase().includes(value.toLowerCase())

    );

    setFilteredStaff(searchData);
  };


  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff.text);
    setSearchStaff("");
    setIsDropdownOpen(false);
  };



  //  brach names for filtering
  const fetchSearchBranch = async () => {
    try {
      const response = await fetch("/api/admin/settings/get_branches_data", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("all branch names data", data.message.data);

      if (data.message.status) {
        setSearchBranchData( data.message.data || []);
        setFilteredBranch(data.message.data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSearchBranch();
  }, [state]);

  const handleSearchBranch = (e: any) => {
    const value = e.target.value;
    setSearchBranch(value);

    const searchData = searchBranchData.filter(
      (item) =>
        item.text.toLowerCase().includes(value.toLowerCase())

    );

    setFilteredBranch(searchData);
  };


  const handleSelectBranch = (branch: Staff) => {
    setSelectedBranch(branch.text);

    setSearchBranch("");
    setIsbranchDropdownOpen(false);
  };




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (staffDropdownRef.current && event.target instanceof Node) {
        if (!staffDropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }

      if (branchDropdownRef.current && event.target instanceof Node) {
        if (!branchDropdownRef.current.contains(event.target)) {
          setIsbranchDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className=" w-full  pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Staff Management
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="#"
            >
              Home
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>Master</li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <li>Staff</li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">


            <form>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">



                {/* Staff Select */}

                <div className="relative w-full" ref={staffDropdownRef}>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Staff Name
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedStaff || "Select a Staff"}
                    <span className="ml-2 dark:text-slate-400/70">
                      <FaChevronDown />
                    </span>
                  </div>

                  {/* Dropdown Content */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                      {/* Search Bar Inside Dropdown */}
                      <input
                        type="text"
                        value={searchStaff}
                        onChange={handleSearchStaff}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />

                      {/* Dropdown Options */}
                      <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                        {filteredStaff.length > 0 ? (
                          filteredStaff.map((staff) => (
                            <li
                              key={staff.id}
                              onClick={() => handleSelectStaff(staff)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                            >
                              {staff.text}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>



                {/* Branch Select */}

                <div className="relative w-full" ref={branchDropdownRef}>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Branch Name
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsbranchDropdownOpen(!isbranchDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedBranch || "Select a Branch"}
                    <span className="ml-2 dark:text-slate-400/70">
                      <FaChevronDown />
                    </span>
                  </div>

                  {/* Dropdown Content */}
                  {isbranchDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                      {/* Search Bar Inside Dropdown */}
                      <input
                        type="text"
                        value={searchBranch}
                        onChange={handleSearchBranch}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />

                      {/* Dropdown Options */}
                      <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                        {filteredBranch.length > 0 ? (
                          filteredBranch.map((branch) => (
                            <li
                              key={branch.id}
                              onClick={() => handleSelectBranch(branch)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                            >
                              {branch.text}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>



                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 dark:text-navy-100"
                  >
                    Status
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={handleFilterSubmit}
                >
                  <i
                    className="fa fa-filter"
                    style={{ marginTop: "3px", marginRight: "3px" }}
                  ></i>
                  Filter
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={handleReset}
                >
                  <i
                    className="fa fa-refresh"
                    style={{ marginTop: "3px", marginRight: "3px" }}
                  ></i>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-5 lg:py-6">
        <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
          Staff Details
        </span>
        <button
          className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md"
          onClick={() => togglemodal('add')}
        >
          Add Staff
        </button>

      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <div className="card px-4 pb-4 sm:px-5">
          <div className="mt-5">
            <div className="gridjs-head">

              <div className="gridjs-search">
                <input type="search"
                  placeholder="Type a keyword..."
                  aria-label="Type a keyword..."
                  className="text-sm pl-2 gridjs-input gridjs-search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="is-hoverable w-full text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      #
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Staff Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Branch Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Mobile
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Place
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Email
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
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentEntries.length > 0 ? (
                        currentEntries.map((item, index) => {
                          const formattedDate = new Date(item.date_of_joining).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          });

                          return (
                            <tr
                              key={item.id}
                              className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"
                            >
                              <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                                {index + indexOfFirstEntry + 1}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.first_name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.branch_name}
                              </td>
                              <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                {item.mobile}
                              </td>
                              <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                {item.address}
                              </td>
                              <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {/* {item.date_of_joining} */}
                                {formattedDate}
                              </td>
                              <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                                <span>
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => togglemodal('edit', item)}
                                      className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                                      <i className="fa fa-edit" />
                                    </button>



                                    <button
                                      className={`btn size-8 p-0 ${item.status === 'active' ? 'text-error' : 'text-primary'} hover:bg-${item.status === 'active' ? 'error' : 'primary'}/20 focus:bg-${item.status === 'active' ? 'error' : 'primary'}/20 active:bg-${item.status === 'active' ? 'error' : 'primary'}/25`}
                                      onClick={() => updateAccountStatus(item.user_id!, item.status)} // Pass the current status
                                    >
                                      <i className={`fa ${item.status === 'active' ? 'fa-trash-alt' : 'fa-check-circle'}`} />
                                    </button>

                                  </div>
                                </span>
                              </td>
                            </tr>

                          );
                        })
                      ) : (

                        <tr>
                          <td colSpan={7} className="text-center py-4 text-gray-500">
                            No data available
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
              {/* Entries Info */}
              <div className="text-center sm:text-left">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap justify-center sm:justify-end gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border rounded-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border rounded-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-[#4f46e5] text-white' : ''
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border rounded-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showmodal && (
        modalMode === 'edit' ? (
          <Edit
            showmodal={showmodal}
            togglemodal={() => togglemodal('add')}
            staffData={editedStaff}
            onSave={(updatedStaff) => {


              setStaffData((prevData) =>
                prevData.map((staff) =>
                  staff.id === updatedStaff.id ? updatedStaff : staff
                )
              );

            }}


          />
        ) : (
          <Add showmodal={showmodal} togglemodal={() => togglemodal('add')} />
        )
      )}
    </div>
  );
};
export default page;
// export default withAuth(page,["admin"],);




