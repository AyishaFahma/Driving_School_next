

"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaFilter, FaSpinner } from "react-icons/fa";
import Add from "./add";
import { useAuth } from "@/app/context/AuthContext";
import Edit from "./edit";

interface Driver {
  id?: string;
  user_id?: string;
  first_name: string;
  status: string;
  mobile: string;
  address: string;
  driving_licence_no: string;
  date_of_joining: string;
  password: string;
  text: string;
}

const page = () => {

  const { state } = useAuth();
  const [showmodal, setShowmodal] = useState(false);

  const [driverData, setDriverData] = useState<Driver[]>([]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [filters, setFilters] = useState({ driverName: "", status: "" });
  const [filteredData, setFilteredData] = useState<Driver[]>([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [editedDriver, setEditedDriver] = useState<Driver | null>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [searchDriver, setSearchDriver] = useState("");
  const [searchDriverData, setSearchDriverData] = useState<Driver[]>([]);
  const [filteredDriver, setFilteredDriver] = useState<Driver[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const [isLoading, setIsLoading] = useState(false);

  const togglemodal = (mode: "add" | "edit", driver: Driver | null = null) => {
    setModalMode(mode);
    // setSelectedDriver(driver);
    setEditedDriver(driver);
    setShowmodal((prev) => !prev);
    fetchDriverData();
  };





  const removeDuplicateDrivers = (data: any[]) => {

    const uniqueMap = new Map()

    data.forEach((item) => {

      const mobile = item.mobile?.toString().trim();

      if (!mobile) {
        // If no mobile, use user_id as fallback
        const uniqueKey = `user_${item.user_id}`;
        if (!uniqueMap.has(uniqueKey)) {
          uniqueMap.set(uniqueKey, item);
        }
      } else if (!uniqueMap.has(mobile)) {
        // First time seeing this mobile number
        uniqueMap.set(mobile, item);
      } else {
        // Duplicate mobile found - log it
        console.warn(`Duplicate mobile ${mobile}: User ${item.user_id} (${item.first_name})`);
        // Keep the first occurrence (or implement logic to choose which one to keep)
      }
    });

    return Array.from(uniqueMap.values())
  }


  // fetch all driver data
  const fetchDriverData = async () => {

    try {
      const response = await fetch("/api/admin/settings/get_all_driver", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({user_type:"driver"}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${ errorData.message || "Unknown error" }` );
      }


      const data = await response.json();
      console.log("all driver details data" , data);

      console.log("original driver detail data length" , data.message.data.length);
      
      

      if (data.message.status) {

        const uniqueDrivers  = removeDuplicateDrivers(data.message.data || [])

        console.log("after removing duplicate records on driver details data length" , uniqueDrivers.length);
        

        setDriverData(uniqueDrivers);
        setFilteredData(uniqueDrivers);

      } else {
        console.log("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, [state]);

  

  // searchterm 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const searchFilteredData = driverData.filter((item) => {
      return (
        (item.first_name && item.first_name.toLowerCase().includes(value.toLowerCase())) ||
        (item.mobile && item.mobile.toLowerCase().includes(value.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(value.toLowerCase())) ||
        (item.driving_licence_no && item.driving_licence_no.toLowerCase().includes(value.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(value.toLowerCase()))
      );
    });

    setFilteredData(searchFilteredData);
  };


  // filter function
  const applyFilters = () => {
    let newFilteredData = driverData;

    if (selectedDriver) {
      newFilteredData = newFilteredData.filter(
        (item) => item.first_name === selectedDriver
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
    setFilters({ driverName: "", status: "" });
    setFilteredData(driverData);
    setSelectedDriver("");
    setSelectedStatus("");
    setCurrentPage(1);
    setIsLoading(false); // Stop loading
  };

  

  // status update - inactive
  const updateAccountStatus = async (user_id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/settings/inactivate_driver", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({
          id: user_id,
          status: status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the response

      if (data.success) {
        fetchDriverData();
      } else {
        console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };




  // all driver name for filtering

  const fetchSearchDriver = async () => {
    try {
      const response = await fetch("/api/admin/report/get_driver_autocomplete", {
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
      //      console.log("Search mobile data", data.data);

      if (data.success) {
        setSearchDriverData(data.data.driver_details || []);
        setFilteredDriver(data.data.driver_details || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSearchDriver();
  }, [state]);

  const handleSearchDriver = (e: any) => {
    const value = e.target.value;
    setSearchDriver(value);

    const searchData = searchDriverData.filter(
      (item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
      // item.user_name.toLowerCase().includes(value.toLowerCase()) ||
      // item.email.toLowerCase().includes(value.toLowerCase()) ||
      // item.pay_status.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDriver(searchData);
  };


  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver.text);
    // setSelectedMobile(`${mobile.text} - ${mobile.term}`);
    setSearchDriver("");
    setIsDropdownOpen(false); // Close dropdown after selection
  };



  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalEntries = filteredData.length;

  // Pagination logic
  const totalPages = Math.ceil(totalEntries / entriesPerPage);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    <div className=" w-full  pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Driver Management
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
          <li>Driver</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
            <form>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Driver Name Select */}
                <div className="relative w-full" ref={dropdownRef}>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Driver Name
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedDriver || "Select a User"}
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
                        value={searchDriver}
                        onChange={handleSearchDriver}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />

                      {/* Dropdown Options */}
                      <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                        {filteredDriver.length > 0 ? (
                          filteredDriver.map((driver) => (
                            <li
                              key={driver.id}
                              onClick={() => handleSelectDriver(driver)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                            >
                              {driver.text}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Status Select */}
                <div className="flex-1">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 dark:text-navy-100"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex-1 mt-6">
                  <button
                    type="button"
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
                    className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleReset}
                  >
                    <i
                      className="fa fa-refresh"
                      style={{ marginTop: "3px", marginRight: "3px" }}
                    ></i>
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 lg:py-6">
        <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
          Driver Details
        </span>

        <button
          className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md"
          onClick={() => togglemodal("add")}
        >
          Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <div className="card px-4 pb-4 sm:px-5">
          <div className="mt-5">
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
                    <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      #
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Driver Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Mobile
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Place
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Driving Licence No
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
                              key={index}
                              className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500" >

                              <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                                {index + indexOfFirstEntry + 1}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.first_name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.mobile}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.address}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {item.driving_licence_no}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                {/* {item.date_of_joining} */}
                                {formattedDate}
                              </td>
                              <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                                <span>
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => togglemodal("edit", item)}
                                      className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25"
                                    >
                                      <i className="fa fa-edit" />
                                    </button>

                                    <button
                                      className={`btn size-8 p-0 ${item.status === "active"
                                          ? "text-error"
                                          : "text-primary"
                                        } hover:bg-${item.status === "active" ? "error" : "primary"
                                        }/20 focus:bg-${item.status === "active" ? "error" : "primary"
                                        }/20 active:bg-${item.status === "active" ? "error" : "primary"
                                        }/25`}
                                      onClick={() =>
                                        updateAccountStatus(item.user_id!, item.status)
                                      }
                                    >
                                      <i
                                        className={`fa ${item.status === "active"
                                            ? "fa-trash-alt"
                                            : "fa-check-circle"
                                          }`}
                                      />

                                    </button>
                                    {/* <p>{item.user_id}id</p> */}
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
                Showing {indexOfFirstEntry + 1} to{" "}
                {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries}{" "}
                entries
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? "bg-[#4f46e5] text-white" : ""
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
                  className={`px-4 py-2 border rounded-md ${currentPage === totalPages
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

      {showmodal &&
        (modalMode === "edit" ? (
          <Edit
            showModal={showmodal}
            toggleModal={() => togglemodal("add")}
            driverData={editedDriver}
            onSave={(updatedDriver) => {
              setDriverData((prevData) =>
                prevData.map((driver) =>
                  driver.id === updatedDriver.id ? updatedDriver : driver

                )
              );
              togglemodal("add");
            }}
          />
        ) : (
          <Add showModal={showmodal} togglemodal={() => togglemodal("add")} />
        ))}
    </div>
  );
};

// export default page
export default withAuth(page, ["admin"]);