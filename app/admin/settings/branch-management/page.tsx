"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useRef, useState } from "react";
import Add from "./add";
import { useAuth } from "@/app/context/AuthContext";
import Edit from "./edit";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

type Branch = {
  id?: string;
  enc_id?: string;
  branch_name: string;
  mobile: string;
  description: string;
  password: string;
  status: string;
  [key: string]: any;
  text: string;
};
type BranchData = {
  data: Branch[];
};

const page = () => {

  const { state } = useAuth();
  
  const [showmodal, setShowmodal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // state for all branch details
  const [branchData, setBranchData] = useState<Branch[]>([]);
  const [filteredData, setFilteredData] = useState<Branch[]>([]);
  //search branch - branchname , mobile , description
  const [searchTerm, setSearchTerm] = useState("");


  // branch data for filtering
  const [searchBranchData, setSearchBranchData] = useState<Branch[]>([]);
  const [filteredBranch, setFilteredBranch] = useState<Branch[]>([]);
  // search branch in filtering dropdown
  const [searchBranch, setSearchBranch] = useState("");
  // select branch in filtering dropdown
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  //status select for filtering
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // for edit a branch
  const [editedBranch, setEditedBranch] = useState<Branch | null>(null);



  //pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);


  // modal for add , edit
  const togglemodal = (mode: "add" | "edit", branch: Branch | null = null) => {
    setModalMode(mode);
    setEditedBranch(branch);
    setShowmodal((prev) => !prev);
    fetchBranchData();
  };


  // get all full branch details
  const fetchBranchData = async () => {
    try {
      const response = await fetch("/api/admin/settings/get_all_branches", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",

          api_key: "10f052463f485938d04ac7300de7ec2b", // Make sure the API key is correct
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      //console.log(data);     
      //console.log(data.message.data);

      if (data.message.status === true) {
        setBranchData(data.message.data || []);
        setFilteredData(data.message.data || []);
      } else {
        console.error("API business logic error:", data.message?.message || "Invalid response structure");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  useEffect(() => {
    fetchBranchData();
  }, [state]);


  //  search data based on branchname , description , status , mobile
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const searchFilteredData = branchData.filter((item) =>
      item.branch_name.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase()) ||
      item.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(searchFilteredData);
  };



  // filter function 
  const applyFilters = () => {
    let newFilteredData = branchData;

    if (selectedBranch) {
      newFilteredData = newFilteredData.filter((item) => item.branch_name === selectedBranch);
    }
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter((item) => item.status === selectedStatus);
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
    setSelectedBranch("");
    setSelectedStatus("");
    setFilteredData(branchData);
    setIsLoading(false); // Stop loading
  };



  //  branch names for filtering
  const fetchSearchBranch = async () => {
    try {
      const response = await fetch("/api/admin/settings/get_branches_data", {  // api should change
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
      console.log("filtering branch names data", data.message.data);

      // const branchNames = data.message.data.map((branch:Branch) => branch.branch_name);
      // console.log("branchNames" , branchNames);

      if (data.message.status) {
        setSearchBranchData(data.message.data || []);
        setFilteredBranch(data.message.data || []);
      }
      else {
        console.error("API business logic error:", data.message?.message || "Invalid response structure");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSearchBranch();
  }, [state]);


  // search branch in filtering dropdown
  const handleSearchBranch = (e: any) => {
    const value = e.target.value;
    setSearchBranch(value);

    const searchData = searchBranchData.filter((item) => item.text.toLowerCase().includes(value.toLowerCase()));

    setFilteredBranch(searchData);
  };


  // select branch in filtering dropdown
  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch.text);
    setSearchBranch("");
    setIsDropdownOpen(false); // Close dropdown after selection
  };


  // status change - check api and response
  const updateAccountStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("", {
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

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.message?.success === true) {
        toast.success("Branch Status Updated Successfully")
        fetchBranchData();
      } else {
        toast.error( "Failed to update status");
      }
    } catch (error) {
      //console.error("Update error:", error);
    }
  };



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
          Branch Management
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
          <li>Branch</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4">
        <div className="card px-4 pb-4 sm:px-5 pt-4">
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
            <form>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Branch Select */}

                <div className="relative w-full" ref={dropdownRef}>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Branch Name
                  </label>

                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedBranch || "Select a Branch"}
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




                {/* Status Select */}
                <div className="flex-1">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 dark:text-navy-100" >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex-1 mt-6">
                  {/* filter button */}
                  <button
                    type="submit"
                    onClick={handleFilterSubmit}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >
                    <i className="fa fa-filter" style={{ marginTop: "3px", marginRight: "3px" }} > </i>
                    Filter
                  </button>
                  {/* reset button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >
                    <i className="fa fa-refresh" style={{ marginTop: "3px", marginRight: "3px" }} > </i>
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
          Branch Details
        </span>

        <button
          className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md"
          onClick={() => togglemodal("add")}
        >
          Add Branch
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
                      Branch Name
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Mobile
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
                            className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500" >
                            <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                              {index + indexOfFirstEntry + 1}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.branch_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {item.mobile}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {/* {item.description} */}
                              <div
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            </td>
                            {/* <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.status}
                      </td> */}
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
                              {item.added_date.split(" ")[0]}
                            </td>
                            <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                              <span>
                                <div className="flex justify-center space-x-2">

                                  {/* edit button */}
                                  <button
                                    onClick={() => togglemodal("edit", item)}
                                    className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                                    <i className="fa fa-edit" />
                                  </button>

                                  {/* inactive button */}
                                  <button
                                    onClick={() => {
                                      // Toggle status for the API call
                                      const newStatus = item.status === "active" ? "inactivate" : "active";
                                      updateAccountStatus(item.id!, newStatus)
                                    }}
                                    className={`btn size-8 p-0 ${item.status === "active" ? "text-error" : "text-primary"}
                                      hover:bg-${item.status === "active" ? "error" : "primary"
                                      }/20 focus:bg-${item.status === "active" ? "error" : "primary"
                                      }/20 active:bg-${item.status === "active" ? "error" : "primary"
                                      }/25`}  >

                                    <i className={`fa ${item.status === "active" ? "fa-trash-alt" : "fa-check-circle"}`} />
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
            toggleModal={() => togglemodal("add")} // Correct the mode here if you want to switch to 'edit'
            // branchData={editedBranch}
            branchData={editedBranch as Branch}
            onSave={(updatedBranch) => {
              setBranchData((prevData) =>
                prevData.map((branch) =>
                  branch.id === updatedBranch.id ? updatedBranch : branch
                )
              );
              togglemodal("add"); // Close modal after saving
            }}
          />
        ) : (
          <Add showmodal={showmodal} togglemodal={() => togglemodal("add")} />
        ))}
    </div>
  );
};

export default page;
