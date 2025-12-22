
'use client'
import withAuth from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react'
import Add from './add';
import { useAuth } from '@/app/context/AuthContext';
import Edit from './edit';
import { FaSpinner } from 'react-icons/fa';
type Cost = {
  id?: string;
  status: string;
  service_name: string;
  vehicle_type: string;
  service_id: string;
  branch_name:string;
  added_date:string;
  gender:string;
  cost: string;
  study_cost: string;
  licence_cost: string;
  lmc_mc_both_study: string;
  lmc_mc_both_licence: string;
  lmc_study_mc_licence: string;
  lmc_licence_mc_study: string;

};
const page = () => {
  const { state } = useAuth();
  const [showmodal,setShowmodal]=useState(false);
  const [costData, setCostData] = useState<Cost[]>([]);
  const [filteredData, setFilteredData] = useState<Cost[]>([]);
  const [selectedCost, setSelectedCost] = useState<Cost | null>(null); 
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string>("");
  const [service, setService] = useState<{ id: string; service_name: string }[]>([]);
  const [filters, setFilters] = useState({ service_name: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>("");
   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

   const [isLoading, setIsLoading] = useState(false);

    const togglemodal = (mode: 'add' | 'edit', cost: Cost | null = null) => {
      setModalMode(mode);  // Set the modal mode to either "add" or "edit"
      setSelectedCost(cost);  // Pass the selected driver if in edit mode
      setShowmodal((prev) => !prev);  // Toggle the modal visibility
      fetchclassData();
    };
  
  
  const fetchclassData = async () => {
  

    try {

      const response = await fetch('/api/admin/accounts/fresh_license_cost_details', {
        method: 'POST',
        headers: {
           'authorizations': state?.accessToken ?? '', 
          // 'authorizations': token ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',  // Make sure the API key is correct
        },
        body: JSON.stringify({ /* request body */ }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCostData(data.data || []);
         setFilteredData(data.data || []);
      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  useEffect(() => {
    fetchclassData();
  }, [state]);

 
  const fetchServiceData = async () => {
  

    try {

      const response = await fetch('/api/admin/settings/service_details', {
        method: 'POST',
        headers: {
           'authorizations': state?.accessToken ?? '', 
          // 'authorizations': token ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',  // Make sure the API key is correct
        },
        body: JSON.stringify({ /* request body */ }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setService(data.data || []);
         
      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  useEffect(() => {
    fetchServiceData();
  }, [state]);

  const [filterStatus,setFilterStatus] = useState("all");
  
  const [currentPage,setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  
  

  const updateAccountStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/accounts/inactivate_fresh_license_cost', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '', 
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({
          id: id,
          status: status,
          table: "fresh_license_cost"
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Log the response
  
      if (data.success) {
       
        fetchclassData();
      } else {
        console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };



    const handleEdit = (staff: Cost) => {
      setSelectedCost(staff); 
      setShowmodal(true); 
    };
    const applyFilters = () => {
      let newFilteredData = costData;
    
      // Apply form filters
     
      if (selectedServices) {
        newFilteredData = newFilteredData.filter(
          (item) => item.service_name === selectedServices
        );
      }
      if (selectedStatus) {
        newFilteredData = newFilteredData.filter(
          (item) => item.status === selectedStatus
        );
      }
    
      return newFilteredData; // Return filtered data
    };
    
    // Handle real-time search filtering
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchTerm(value);
        
          const searchFilteredData = costData.filter(
            (item) =>
              item.gender.toLowerCase().includes(value.toLowerCase()) ||
              item.vehicle_type.toLowerCase().includes(value.toLowerCase()) ||
              item.status.toLowerCase().includes(value.toLowerCase())
          );
        
          setFilteredData(searchFilteredData); // Update filtered data in real-time
        };
        
    // Handle form submit for additional filters
 const handleFilterSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent page reload

      setIsLoading(true); // Start loading
        
          // Simulate a delay to show the loader (you can remove this in production)
          await new Promise(resolve => setTimeout(resolve, 1000));

      const newFilteredData = applyFilters();
      setFilteredData(newFilteredData); // Update filtered data

      setIsLoading(false); // Stop loading
    };
    
    const handleReset = async () => {
      setIsLoading(true); // Start loading
     
       // Simulate a delay to show the loader (you can remove this in production)
       await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchTerm("");
      setSelectedServices("");
      setSelectedStatus("");
      setFilteredData(costData); // Reset to original data
      setIsLoading(false); // Stop loading
    };
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(
      indexOfFirstEntry,
      indexOfLastEntry
    );
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
  return (
    <div className=" w-full  pb-8">
 
        
    <div className="flex items-center space-x-4 py-5 lg:py-6">
    <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
    Fresh Licence Cost
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
      <li>Master</li>
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      <li>Fresh Licence Cost</li>
    </ul>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4" >
  <div className="card px-4 pb-4 sm:px-5 pt-4">
  <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
    <form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Status Select */}
        <div className='flex-1'>
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
            <option value="">select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className='flex-1 mt-6'>
        <button
         onClick={handleFilterSubmit}
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        ><i className='fa fa-filter' style={{marginTop:'3px',marginRight:'3px'}} ></i>
          Filter
        </button>
        <button
           onClick={handleReset}
          type="button"
          className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        ><i className='fa fa-refresh' style={{marginTop:'3px',marginRight:'3px'}}></i>
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
                 Licence Cost
                </span>
                <button className="px-4 py-2 bg-[#4f46e5] hover:bg-primary-focus text-white rounded-md" 
                 onClick={() => togglemodal('add')}
                >  
         Add Licence Cost
                </button>
               
            </div>

                             
  <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6" >
  <div className="card px-4 pb-4 sm:px-5">
  <div className="mt-5">
            <div className="gridjs-head">
           <div className="gridjs-search">
<input type="search" 
placeholder="Type a keyword..." 
aria-label="Type a keyword..." 
className="text-sm pl-2 gridjs-input gridjs-search-input" 
defaultValue="" 
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
               Vehicle Type
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Gender
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Cost
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

            {currentEntries.length > 0 ?(
currentEntries.map((item,index) =>(
              <tr key={item.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                {index +indexOfFirstEntry+1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {/* {item.vehicle_type} */}
                {( item.vehicle_type=== 'lmc') && (
                  <>LMV</>
                )}
                 {( item.vehicle_type=== 'mc') && (
                  <>MC</>
                )}
                 {( item.vehicle_type=== 'auto') && (
                  <>Auto</>
                )}
                {( item.vehicle_type=== 'lmc_mc') && (
                  <>Both</>
                )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.gender}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.cost}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
               
                 {item.status === "active" && (
                <div className="badge space-x-2.5 rounded-full bg-success/10 text-success">
                  <div className="size-2 rounded-full bg-current"/>
                  <span>active</span>
                </div>
                )}
                 {item.status === "inactive" && (
                <div className="badge space-x-2.5 rounded-full bg-error/10 text-error">
                  <div className="size-2 rounded-full bg-current"/>
                  <span>inactive</span>
                </div>
                )}
            
                </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.added_date}
                </td>
                <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                <span>
                      <div className="flex justify-center space-x-2">
                        <button 
                        onClick={() => togglemodal('edit', item)}
                        className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                          <i className="fa fa-edit"  />
                        </button>
                       
                           <button
                              onClick={() =>
                                updateAccountStatus(item.id!, item.status)
                              }
                              className={`btn size-8 p-0 ${
                                item.status === "active"
                                  ? "text-error"
                                  : "text-primary"
                              } hover:bg-${
                                item.status === "active" ? "error" : "primary"
                              }/20 focus:bg-${
                                item.status === "active" ? "error" : "primary"
                              }/20 active:bg-${
                                item.status === "active" ? "error" : "primary"
                              }/25`}
                            >
                              <i
                                className={`fa ${
                                  item.status === "active"
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
):(
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
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === i + 1 ? "bg-[#4f46e5] text-white" : ""
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
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === totalPages
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
 
  {showmodal && (
  modalMode === 'edit' ? (
    <Edit
      showModal={showmodal}
      togglemodal={() => togglemodal('add')}  // Correct the mode here if you want to switch to 'edit'
      costData={selectedCost}
      onSave={(updatedCost) => {
       
        setCostData((prevData) =>
          prevData.map((cost) =>
            cost.id === updatedCost.id ? updatedCost : cost
          )
        );
        togglemodal('add');  // Close modal after saving
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