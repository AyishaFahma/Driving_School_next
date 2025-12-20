
'use client'
import withAuth from '@/hoc/withAuth';
import React, { useEffect, useRef, useState } from 'react'

import { strict } from 'assert';
import { useAuth } from '@/app/context/AuthContext';
import Add from './add';
import { FaChevronDown, FaRegCheckCircle } from 'react-icons/fa';
import Edit from './edit';
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from 'react-icons/hi';
type Account = {
  id?: string;
  status: string;
  daily_status: string; 
  type: string;
  expense_name: string;
  email: string;
  branch_id: string;
  branch_name:string;
  added_date:string;
  staff_name:string;
  amount:string;
  total_income:string;
  total_expense:string;
  text:string;
};

const page = () => {
  const { state } = useAuth();
  const [showmodal,setShowmodal]=useState(false);
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [filteredData, setFilteredData] = useState<Account[]>([]);
  const [expenseData, setExpenseData] = useState<Account | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dailystatusselected, setdailystatusselected] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); 
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

 const [searchBranch, setSearchBranch] = useState("");
  const [searchBranchData, setSearchBranchData] = useState<Account[]>([]);
  const [filteredBranch, setFilteredBranch] = useState<Account[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const togglemodal = (mode: 'add' | 'edit', account: Account | null = null) => {
    setModalMode(mode); 
    setSelectedAccount(account);
    setShowmodal((prev) => !prev);
  };


  const fetchStaffData = async () => {
  

    try {

      const response = await fetch('/api/staff/accounts/accounts_details', {
        method: 'POST',
        headers: {
           'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({ 
          id: null,
          status: null,
          date: null, }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
     
      if (data.success) {
        setAccountData(data.data.accounts_details);
        setFilteredData(data.data.accounts_details);
        setExpenseData(data.data.expenses);
      } else {
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchStaffData();
  }, [state]);

  const [filterStatus,setFilterStatus] = useState("all");
  
  const [currentPage,setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  const applyFilters = () => {
    let newFilteredData = accountData;
  
    // Apply form filters
    if (dailystatusselected) {
      newFilteredData = newFilteredData.filter(
        (item) => item.daily_status === dailystatusselected
      );
    }
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter(
        (item) => item.status === selectedStatus
      );
    }
   
    if (selectedDate) {
      newFilteredData = newFilteredData.filter((item) => {
      
        const itemDate = item.added_date.split(" ")[0];
        return itemDate === selectedDate;
      });
    }
    return newFilteredData;
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    const searchFilteredData = accountData.filter(
      (item) =>
        item.daily_status.toLowerCase().includes(value.toLowerCase()) ||
        item.type.toLowerCase().includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase())
    );
  
    setFilteredData(searchFilteredData); 
  };
  

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const newFilteredData = applyFilters();
    setFilteredData(newFilteredData); 
  };
  
  const handleReset = () => {
    setSearchTerm("");
    setdailystatusselected("");
    setSelectedStatus("");
    setFilteredData(accountData); 
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);



    const updateAccountStatus = async (id: string, status: string) => {
      try {
        const response = await fetch('/api/staff/accounts/inactivate_accounts', {
          method: 'POST',
          headers: {
            'authorizations': state?.accessToken ?? '', 
            'api_key': '10f052463f485938d04ac7300de7ec2b',
          },
          body: JSON.stringify({
            id: id,
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

  const fetchSearchBranch = async () => {
    try {
      const response = await fetch(
        "/api/admin/report/get_branch_autocomplete",
        {
          method: "POST",
          headers: {
            authorizations: state?.accessToken ?? "",
            api_key: "10f052463f485938d04ac7300de7ec2b",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      //   console.log("Search mobile data", data.data);

      if (data.success) {
        setSearchBranchData(data.data.branch_details || []);
        setFilteredBranch(data.data.branch_details || []);
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
      (item) => item.text.toLowerCase().includes(value.toLowerCase())
      // item.user_name.toLowerCase().includes(value.toLowerCase()) ||
      // item.email.toLowerCase().includes(value.toLowerCase()) ||
      // item.pay_status.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredBranch(searchData);
  };

  const handleSelectBranch = (branch: Account) => {
    setSelectedBranch(branch.text);

    setSearchBranch("");
    setIsDropdownOpen(false);
  };

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
    Daily Accounts
    </h2>
    <div className="hidden h-full py-1 sm:flex">
      <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
    </div>
    <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
      <li className="flex items-center space-x-2">
        <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">Home
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </li>
      <li>Accounts</li>
    </ul>
  </div>


<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-4">

  <div className="col-span-4 sm:col-span-3 card px-4 pb-4 sm:px-5 pt-4">
  <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">

<form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-700 dark:text-navy-100"
          >
           Accounts Type
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
            value={dailystatusselected}
            onChange={(e) => setdailystatusselected(e.target.value)}
          >
            <option value="">Please Select Account Type</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
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
        <div>
      <label
        htmlFor="date"
        className="block text-sm font-medium text-slate-700 dark:text-navy-100"
      >
        Date
      </label>
      <input
        type="date"
        id="date"
        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
        value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
      </div>
      {/* <div className="mt-4 flex space-x-4">
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
      </div> */}
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                <div className="relative w-full" ref={dropdownRef}>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700 dark:text-navy-100"
                  >
                    Branch Name
                  </label>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    {selectedBranch || "Select a Branch"}
                    <span className="ml-2 dark:text-slate-400/70">
                              <FaChevronDown />
                            </span>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                      <input
                        type="text"
                        value={searchBranch}
                        onChange={handleSearchBranch}
                        placeholder="Search..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      />
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
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-warning py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-warning focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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


  <div className="col-span-4 sm:col-span-1 card px-4 pb-4 sm:px-5 pt-10">
    <div className="p-3 rounded-lg bg-slate-100 dark:bg-navy-800">
      <div className="card top-countries-card">
      {expenseData && (
        <div className="list-group border">
        
          <div className="flex list-group-item border p-2" >
            <p className='mr-8'>Total Income </p>
            <span className='font-bold'>{expenseData.total_income}</span>
          </div>

          <div className="flex list-group-item p-2">
            <p className='mr-8'>Total Expense </p>
            <span className='font-bold'>{expenseData.total_expense}</span>
          </div>
       
        </div>
         )}
      </div>
    </div>
  </div>
</div>



  <div className="flex items-center justify-between py-5 lg:py-6">
                <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
                Daily Accounts
                </span>
                <button 
                 onClick={() => togglemodal('add')}
                className="px-4 py-2 bg-[#4f46e5] text-white rounded-md">  
          Add Accounts
                </button>
               
            </div>

                             
  <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6" >
  <div className="card px-4 pb-4 sm:px-5">
  <div className="mt-5">

  
  <div className="gridjs-head">
            <div className="gridjs-search">
           
            <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search by name, branch, or place..."
      className="form-input peer w-1/4 rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-1 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
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
               Source
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
              Added By
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
              Branch Name
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Type
                </th>
              
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Amount
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
             Remarks
                </th> 
                <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                Action
                </th> 
          
              </tr>
            </thead>
            <tbody>
             
            {currentEntries.map((item, index) => (
              <tr key={item.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                {index +indexOfFirstEntry+1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.daily_status === "income" ? item.type : item.expense_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.daily_status === "income" ? (

    <div className="badge space-x-2.5 rounded-full bg-success/10 text-success">
      
                  <span>Income</span>
                  <HiOutlineArrowNarrowUp/>
                </div>
  ) : (
    <>
      <div className="badge space-x-2.5 rounded-full bg-error/10 text-error">
                  
               <span>Expense</span>
               <HiOutlineArrowNarrowDown/>
                </div>
    </>
  )}
                </td>
              
                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                {item.amount}
                </td>
              

                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                {item.added_date}
                </td>
                <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                <span>
                      <div className="flex  space-x-2">
                        <button 
                        onClick={() => togglemodal('edit', item)}
                        className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                          <i className="fa fa-edit"/>
                        </button>
                       
                        <button
                        className={`btn size-8 p-0 ${item.status === 'active' ? 'text-error' : 'text-primary'} hover:bg-${item.status === 'active' ? 'error' : 'primary'}/20 focus:bg-${item.status === 'active' ? 'error' : 'primary'}/20 active:bg-${item.status === 'active' ? 'error' : 'primary'}/25`}
                        onClick={() => updateAccountStatus(item.id!, item.status)} // Pass the current status
                      >
                        <i className={`fa ${item.status === 'active' ? 'fa-trash-alt' : 'fa-check-circle'}`} />
                      </button>

                      </div>
                    </span>
                </td>
              </tr>
  
               ))}
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
      className={`px-3 py-2 border rounded-md ${
        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      First
    </button>
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-2 border rounded-md ${
        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-2 border rounded-md ${
          currentPage === i + 1 ? 'bg-[#4f46e5] text-white' : ''
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 border rounded-md ${
        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      Next
    </button>
    <button
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
      className={`px-3 py-2 border rounded-md ${
        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
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
      showModal={showmodal}
      toggleModal={() => togglemodal('add')}  
      AccountData={selectedAccount}
      onSave={(updatedAccount) => {
        console.log("Updated Account:", updatedAccount);
        console.log("Current Account Data:", accountData);
      
        setAccountData((prevData) =>
          prevData.map((account) =>
            account.id === updatedAccount.id ? updatedAccount : account
          )
        );
        togglemodal("add");
      }}
      
      
    />
  ) : (
    <Add showmodal={showmodal} togglemodal={() => togglemodal('add')} />
  )
)}



  </div>
  
  )
}

export default page