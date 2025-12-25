
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaEdit, FaEye, FaSpinner } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { RiBillFill, RiCurrencyLine } from "react-icons/ri";
import { FiClock } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { useAuth } from "@/app/context/AuthContext";
import Create from "./Create";
import Edit from "./edit";
import Payment from "./payment";


type Admission = {
  id?: string;
  pay_status: string;
  user_name: string;
  email: string;
  blood_group: string;
  gender: string;
  service_name: string;
  due_amount: string;
  added_date: string;
  amount: string;
  pay_amount: string;
  payed_amount: string;
  customer_id: string;
  service_id: string;
  type: string;
  branch_id: string;
  name: string;
  mobile: string;
  document_type: string;
  userfile: File;
  document: File;
  total_amount: string;
  payment_method: string;
  status: string;
  tax: string;
  pucc: string;
  first_name: string;
  old_rc: File | null;
  adhar: File | null;
  insurence: File | null;
  user_photo: File | null;
  documents: File | null;
  branch_name: string;
  address: string;
  dob: string;
  text: string;
  admission_no: string;
  app_no: string;
  billno: string;
  discounted_amount: string;
  discount: string;
};


const Admission = () => {

  const { state } = useAuth();
  const [showmodals, setShowmodals] = useState(false);
  const [showmodal, setShowmodal] = useState(false);

  
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [AdmissionData, setAdmissionData] = useState<Admission[]>([]);
  const [filteredData, setFilteredData] = useState<Admission[]>([]);

  const [selectedCost, setSelectedCost] = useState<Admission | null>(null);
  
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);

  const [editedAdmission, setEditedAdmission] = useState<Admission | null>(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [mobileData, setMobileData] = useState([]);
 
  const [filteredMobile, setFilteredMobile] = useState<Admission[]>([]);
  const [searchMobile, setSearchMobile] = useState("");
  const [selectedMobile, setSelectedMobile] = useState("");



  const [searchBranchData, setSearchBranchData] = useState<Admission[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isadmissionDropdownOpen, setIsadmissionDropdownOpen] = useState(false);
  const admissionDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Add refresh trigger state
  //To automatically refresh the admission data when a new admission is added - this will pass to create component also
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  


  const togglemodal = (
    mode: "add" | "edit",
    admission: Admission | null = null
  ) => {
    setModalMode(mode);
    setEditedAdmission(admission);
    setShowmodal((prev) => !prev);
    // after editing or adding automatic updates
    fetchAdmissionData()
    console.log('modal opens then fetch again works');
    
  };

  const togglemodals = () => {
    setShowmodals((prev) => !prev);
  };


  // Refresh function
  const refreshAdmissionData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);






 // function to get all admission data
  const fetchAdmissionData = async () => {
    try {
      const response = await fetch("/api/admin/signup/get_admission_details", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",

          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({ user_id: null }),
      });
      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"
          }`
        );
      }

      // console.log(`response ${response}`);


      const data = await response.json();
      console.log(data);


      if (data.success) {

        console.log("all data" , data.data);
        
        // remove dulicate
        const uniqueData = removeDuplicates( data.data || [] )
        console.log("after removing duplicates" , uniqueData);
        
        setAdmissionData(uniqueData);
        setFilteredData(uniqueData);

      } else {
        console.log("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // remove dulicate function
  const removeDuplicates = (data: Admission[])=> {

    const uniqueMap = new Map();

    data.forEach( (item) => {

    // Create a unique key combining multiple fields
    const uniqueKey = `${item.customer_id}-${item.service_id}-${item.added_date}`;

    if(! uniqueMap.has(uniqueKey)){

      uniqueMap.set(uniqueKey , item)
    }
    });

    return Array.from(uniqueMap.values());

  };

  useEffect(() => {
    fetchAdmissionData();
  }, [state , refreshTrigger ]); // add refreshTrigger




  // mobile - name related part
  // const fetchMobileData = async (searchTerm = null) => {
  const fetchMobileData = async (searchTerm: string | null = null) => {
    try {
      const response = await fetch(
        "/api/admin/report/get_mobile_user_autocomplete",
        {
          method: "POST",
          headers: {
            authorizations: state?.accessToken ?? "",
            api_key: "10f052463f485938d04ac7300de7ec2b",
          },
          body: JSON.stringify({ term: searchTerm }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("all name and mobile data", data.data);

      if (data.success) {
        setMobileData(data.data.mobile_details || []);
        setFilteredMobile(data.data.mobile_details || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch default mobile - name data on load
  useEffect(() => {
    fetchMobileData();
  }, [state]);

  // search for name or mobile
  const handleSearchMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchMobile(value);
    fetchMobileData(value || null);
  };
 
  // selected name - mobile for filtering
  const handleSelectMobile = (mobile: Admission) => {
    setSelectedMobile(mobile.text);
    setIsDropdownOpen(false);
    setSearchMobile(""); // Reset search field
  };




  // filter records
  const applyFilters = () => {
    let newFilteredData = AdmissionData;

    if (selectedMobile) {
      console.log(selectedMobile, "selectedMobile for filtering");
      newFilteredData = newFilteredData.filter( (item) => item.first_name === selectedMobile || item.mobile === selectedMobile );
    }
    return newFilteredData;
  };

  // filter function
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Simulate a delay to show the loader (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 300));
    const newFilteredData = applyFilters();
    setFilteredData(newFilteredData);
    setIsLoading(false); // Stop loading
    setCurrentPage(1);
  };

  // reset filtering
  const handleReset = async () => {
    setIsLoading(true); // Start loading

    // Simulate a delay to show the loader (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 300));
    setSearchTerm("");

    setSelectedMobile("");
    setSelectedStatus("");
    setFilteredData(AdmissionData);
    setIsLoading(false); // Stop loading
    setCurrentPage(1);
  };




  // search records by field 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    console.log("Search Term:", value);
    setSearchTerm(value);

    const searchFilteredData = AdmissionData.filter((item) => {
      // Convert pay_status values before filtering
      let payStatus = item.pay_status?.toLowerCase() || "";

      if (payStatus === "completed") {
          payStatus = "fully paid";
        } else if (payStatus === "remaining") {
          payStatus = "partially paid";
        } else if (payStatus === "pending") {
          payStatus = "pending";
        }

      return (
        (item.service_name?.toLowerCase() || "").includes(value) ||
        (item.first_name?.toLowerCase() || "").includes(value) ||
        (item.email?.toLowerCase() || "").includes(value) ||
        (item.mobile?.toLowerCase() || "").includes(value) ||
        (item.due_amount?.toLowerCase() || "").includes(value) ||
        payStatus.includes(value) // Compare transformed pay_status
      );
    });

    console.log("Filtered Data:", searchFilteredData);
    setFilteredData(searchFilteredData); // Update filtered data in real-time
  };


 
  //button for only for fee to reamining 
  const handleEdit = (staff: Admission) => {
    setSelectedCost(staff);
    setShowmodals(true);
  };
 

  //pagination properties
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

 
  // dropdown 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (admissionDropdownRef.current && event.target instanceof Node) {
        if (!admissionDropdownRef.current.contains(event.target)) {
          setIsadmissionDropdownOpen(false);
        }
      }

      if (dropdownRef.current && event.target instanceof Node) {
        if (!dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className=" w-full pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Customer Management
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

          <li>Admission</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
            <form>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* mobile Select */}

                <div className="relative w-full" ref={dropdownRef}>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700 dark:text-navy-100"
                  >
                    Mobile
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedMobile || "Select a Mobile / Name"}
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
                        value={searchMobile}
                        onChange={handleSearchMobile}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />

                      {/* Dropdown Options */}
                      <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                        {filteredMobile.length > 0 ? (
                          filteredMobile.map((mobile) => (
                            <li
                              key={mobile.id}
                              onClick={() => handleSelectMobile(mobile)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                            >
                              {mobile.text}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>


                {/* filter and reset */}
                <div className="flex-1 mt-6">
                  <button
                    type="submit"
                    onClick={handleFilterSubmit}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >
                    <i className="fa fa-filter" style={{ marginTop: "3px", marginRight: "3px" }}> </i>
                    Filter
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >
                    <i className="fa fa-refresh" style={{ marginTop: "3px", marginRight: "3px" }}></i>
                    Reset
                  </button>

                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 lg:py-6">
        <span className="text-lg font-medium text-slate-800 dark:text-navy-50">Customer Records</span>

        <button
          className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md"
          onClick={() => togglemodal("add")} >
          Add Admission
        </button>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <div className="card px-4 pb-4 sm:px-5">
          <div className="mt-5">
            
            {/* search records */}
            <div className="gridjs-head">
              <div className="gridjs-search">
                <input
                  type="search"
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
                    <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      #
                    </th>
                    <th className="max-w-[110px] break-words bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Mobile Number
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Info
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Service Name
                    </th>
                    <th className="max-w-[110px] break-words bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Due Amount
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Pay Status
                    </th>

                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Created Date
                    </th>

                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Updated Date
                    </th>

                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Return Date
                    </th>

                    <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Action
                    </th>
                  </tr>
                </thead>
                {/*  */}
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
                        currentEntries.map((item, index) => (
                          <tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500" key={index}>

                            <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                              {indexOfFirstEntry + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.user_name}
                              <p className="text-slate-400 dark:text-navy-300">
                                Name: {item.first_name}

                              </p>
                              <p className="text-slate-400 dark:text-navy-300">

                                Admission No:{item.admission_no}
                              </p>
                            </td>
                            {/* <td className="max-w-[550px] px-4 py-3"> */}
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  D-O-B:
                                </span>
                                {item.dob ? item.dob : "null"}
                              </p>
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  Address:
                                </span>{" "}
                                {item.address ? item.address : "null"}
                              </p>
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  Email:{" "}
                                </span>
                                {item.email}
                              </p>
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  Blood Group:
                                </span>
                                {item.blood_group}
                              </p>
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  Gender:
                                </span>
                                {item.gender}
                              </p>
                              <p className="text-slate-400 dark:text-navy-300">
                                <span className="font-bold mr-2 dark:text-navy-100">
                                  Branch:
                                </span>
                                {item.branch_name}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.service_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.due_amount}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.pay_status === "completed" && (
                                <div className="badge space-x-2.5 rounded-lg bg-success/10 text-success">
                                  <span className="badge bg-orange-transparent">
                                    <IoMdCheckmark className="mr-2" />
                                    Fully Paid
                                  </span>
                                </div>
                              )}
                              {item.pay_status === "pending" && (
                                <div className="badge space-x-2.5 rounded-lg bg-error/10 text-error">
                                  <span className="badge bg-orange-transparent">
                                    <FiClock className="mr-2" />
                                    Pending
                                  </span>
                                </div>
                              )}
                              {item.pay_status === "remaining" && (
                                <div className="badge space-x-2.5 rounded-lg bg-info/10 text-info">
                                  <span className="badge bg-orange-transparent">
                                    <CgNotes className="mr-2" />
                                    Partially Paid
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* created date */}
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {/* {item.added_date} */}
                              <div className="flex flex-col">
                                <span>{item.added_date.split(" ")[0]}</span>{" "}
                                {/* Date */}
                                <span>{item.added_date.split(" ")[1]}</span>{" "}
                                {/* Time */}
                              </div>
                            </td>

                            {/* updated date */}

                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {/* {item.added_date} */}
                              <div className="flex flex-col">
                                <span>{item.added_date.split(" ")[0]}</span>{" "}
                                {/* Date */}
                                <span>{item.added_date.split(" ")[1]}</span>{" "}
                                {/* Time */}
                              </div>
                            </td>

                            {/* return date */}

                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {/* {item.added_date} */}
                              <div className="flex flex-col">
                                <span>{item.added_date.split(" ")[0]}</span>{" "}
                                {/* Date */}
                                <span>{item.added_date.split(" ")[1]}</span>{" "}
                                {/* Time */}
                              </div>
                            </td>

                            {/* action button column */}
                            <td className="whitespace-nowrap rounded-r-lg py-3 sm:px-5">
                              <div className="flex flex-wrap gap-2 justify-evenly">

                                <button
                                  onClick={() => togglemodal("edit", item)}
                                  className="btn  p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                                  <i className="fa fa-edit" />
                                </button>

                                {item.pay_status !== "completed" && (
                                  <button className="btn  p-0 text-error focus:bg-error/20 active:bg-error/25 border border-error rounded"
                                    onClick={() => handleEdit(item)} >
                                    <RiCurrencyLine />
                                  </button>
                                )}


                                <button
                                  onClick={() => {
                                    sessionStorage.setItem('viewPaymentData', JSON.stringify({
                                      user_id: item.customer_id,
                                      cus_service_id: item.id
                                    }));
                                    window.open(`/branch/report/view-payment`, '_blank');
                                  }}
                                  className="btn  p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                                  <RiBillFill />
                                </button>

                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-4 text-gray-500"
                          >
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
                Showing {indexOfFirstEntry + 1} to{" "}
                {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries}{" "}
                entries
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap justify-center sm:justify-end gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border rounded-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border rounded-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 border rounded-md ${currentPage === i + 1 ? "bg-[#4f46e5] text-white" : ""
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md ${currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                    }`}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border rounded-md ${currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                    }`}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Payment
        showmodals={showmodals}
        togglemodals={togglemodals}
        formData={
          selectedCost
            ? {
              pay_amount: selectedCost.pay_amount,
              payed_amount: selectedCost.payed_amount,
              due_amount: selectedCost.due_amount,
              customer_id: selectedCost.customer_id,
              service_id: selectedCost.service_id,
              type: selectedCost.type,
              amount: selectedCost.amount,
              service_name: selectedCost.service_name,
              payment_method: selectedCost.payment_method ?? "",
              total_amount: selectedCost.total_amount ?? "",
              id: selectedCost.id || "",
              billno: selectedCost.billno || "",
            }
            : undefined
        }
        isEditing={!!selectedCost}
      />

      
      {showmodal &&
        (modalMode === "edit" ? (
          <Edit
            showmodal={showmodal}
            togglemodal={() => togglemodal("add")}
            AdmissionData={editedAdmission}
            onSave={(updatedAdmission) => {
              setAdmissionData((prevData) =>
                prevData.map((admission) =>
                  admission.id === updatedAdmission.id
                    ? (updatedAdmission as Admission)
                    : admission
                )
              );
              togglemodal("add");
            }}
          />
        ) : (
          <Create
            showmodal={showmodal}
            togglemodal={() => togglemodal("add")}
            // refresh 
            onAdmissionAdded={refreshAdmissionData}
          />
        ))}


    </div>
  );
};

export default Admission;