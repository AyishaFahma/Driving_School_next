"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Edit from "./edit";
import Add from "./add";
import { FaChevronDown, FaSpinner } from "react-icons/fa";

type Service = {
  service_name: string;
  id?: string;
  enc_id : string;
  status: string;
  [key: string]: any;
  description: string;
  amount: string;
  text: string;
};
type ServiceData = {
  data: Service[];
};

const page = () => {

  const { state } = useAuth();

  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  // state for edit 
  const [editedService, setEditedService] = useState<Service | null>(null);

  const [serviceData, setServiceData] = useState<Service[]>([]);
  const [filteredData, setFilteredData] = useState<Service[]>([]);
  // search term in main
  const [searchTerm, setSearchTerm] = useState("");

  // for filtering
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");

  // filtering service fetch
  const [searchServiceData, setSearchServiceData] = useState<Service[]>([]);
  const [filteredService, setFilteredService] = useState<Service[]>([]);
  // service search in filtering dropdown
  const [searchService, setSearchService] = useState("");
  
  
  

  const togglemodal = ( mode: "add" | "edit", service: Service | null = null ) => {
    setModalMode(mode);
    setEditedService(service);
    setShowmodal((prev) => !prev);
    fetchServiceData();
  };

  // all service details get function
  const fetchServiceData = async () => {
    try {
      const response = await fetch("/api/admin/settings/get_all_services", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error( `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"  }`  );
      }

      const data = await response.json();

      if (data.message.status === true) {
        setServiceData(data.message.data || []);
        setFilteredData(data.message.data || []);
      } else {
        console.error("API logic error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [state]);


  // search Term search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const searchFilteredData = serviceData.filter(
      (item) =>
        item.service_name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase()) ||
        item.amount.toLowerCase().includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(searchFilteredData);

    setCurrentPage(1);
  };


  // filter function
  const applyFilters = () => {
    let newFilteredData = serviceData;

    if (selectedService) {
      newFilteredData = newFilteredData.filter( (item) => item.service_name === selectedService );
    }
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter( (item) => item.status === selectedStatus  );
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
    setCurrentPage(1);
  };

  // reset function
  const handleReset = async () => {
    setIsLoading(true); // Start loading

    // Simulate a delay to show the loader (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSearchTerm("");
    setSelectedService("");
    setSelectedStatus("");
    setFilteredData(serviceData);
    setIsLoading(false); // Stop loading
    setCurrentPage(1);
  };


  // inactive status update
  const updateAccountStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/settings/inactivate_service", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({
          id: id,
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
      console.log("API Response:", data);

      if (data.success) {
        fetchServiceData();
      } else {
        console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };


  // fetch all service for filtering
  const fetchSearchService = async () => {
    try {
      const response = await fetch("/api/admin/settings/get_service_data", {
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
      console.log("all service filter data", data.message.data);

      if (data.message.status === true) {
        setSearchServiceData(data.message.data || []);
        setFilteredService(data.message.data || []);        
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSearchService();
  }, [state]);

  // service search in filtering dropdown
  const handleSearchService = (e: any) => {
    const value = e.target.value;
    setSearchService(value);

    const searchData = searchServiceData.filter(  (item) =>  item.text.toLowerCase().includes(value.toLowerCase()) );

    setFilteredService(searchData);
  };

  // select service in filtering
  const handleSelectService = (service: Service) => {
    setSelectedService(service.text);
    setSearchService("");
    setIsDropdownOpen(false); // Close dropdown after selection
  };


  // pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice( indexOfFirstEntry, indexOfLastEntry );
  const totalEntries = filteredData.length;

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
          Service Management
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
          <li>Service</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
            <form>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="relative w-full" ref={dropdownRef}>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Service Name
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedService || "Select a Service"}
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
                        value={searchService}
                        onChange={handleSearchService}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />

                      {/* Dropdown Options */}
                      <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                        {filteredService.length > 0 ? (
                          filteredService.map((service) => (
                            <li
                              key={service.id}
                              onClick={() => handleSelectService(service)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                            >
                              {service.text}
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
                    type="submit"
                    onClick={handleFilterSubmit}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <i
                      className="fa fa-filter"
                      style={{ marginTop: "3px", marginRight: "3px" }}
                    ></i>
                    Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          Service Details
        </span>

        <button
          className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md"
          onClick={() => togglemodal("add")}
        >
          Add Services
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
                      Service Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Amount
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Description
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
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentEntries.length > 0 ? (
                        currentEntries.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"
                          >
                            <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                              {indexOfFirstEntry + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.service_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.amount}
                            </td>
                            <td className="max-w-[350px] px-4 py-3 ">
                              <div
                                className="prose prose-sm dark-prose-invert"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.status === "active" && (
                                <div className="badge space-x-2.5 rounded-full bg-success/10 text-success">
                                  <div className="size-2 rounded-full bg-current" />
                                  <span>active</span>
                                </div>
                              )}
                              {item.status === "inactive" && (
                                <div className="badge space-x-2.5 rounded-full bg-error/10 text-error">
                                  <div className="size-2 rounded-full bg-current" />
                                  <span>inactive</span>
                                </div>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              <div className="flex flex-col">
                                <span>{item.added_date.split(" ")[0]}</span>
                                <span>{item.added_date.split(" ")[1]}</span>
                              </div>

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
                                    onClick={() =>
                                      updateAccountStatus(item.id!, item.status)
                                    }
                                    className={`btn size-8 p-0 ${item.status === "active"
                                        ? "text-error"
                                        : "text-primary"
                                      } hover:bg-${item.status === "active" ? "error" : "primary"
                                      }/20 focus:bg-${item.status === "active" ? "error" : "primary"
                                      }/20 active:bg-${item.status === "active" ? "error" : "primary"
                                      }/25`}
                                  >
                                    <i
                                      className={`fa ${item.status === "active"
                                          ? "fa-trash-alt"
                                          : "fa-check-circle"
                                        }`}
                                    />
                                  </button>
                                </div>
                              </span>
                            </td>
                          </tr>
                        ))
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
              <div className="text-center sm:text-left">
                Showing {indexOfFirstEntry + 1} to{" "}
                {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries}{" "}
                entries
              </div>

              {/* Pagination */}
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
            serviceData={editedService}
            // When Edit component successfully saves:
            // Parent receives this and:
            // 1. Updates local state immediately
            // instead of this just refetch data by fetchServiceData(); togglemodal("add");

            onSave={(updatedService) => {
              setServiceData((prevData) =>
                prevData.map((service) =>
                  service.id === updatedService.id ? updatedService : service
                )
              );
              togglemodal("add");
            }}
          />
          
        ) : (
          <Add showmodal={showmodal} togglemodal={() => togglemodal("add")} />
        ))}
    </div>
  );
};

export default page;
