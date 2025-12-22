


import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
type CreateProps = {
  showmodal: boolean;
 
  togglemodal: () => void;
  formData?: {
    f_cost: string;
    m_cost: string;
    service_id: string;
    vehicle_type: string;
    id:string;
   
  };
  isEditing?: boolean;
};

type Cost = {
  id: string;
  status: string;
  service_name: string;
  f_cost: string;
  m_cost: string;
  vehicle_type: string;
  service_id: string;
  branch_name:string;
  added_date:string;
  text:string;
};
const Add: React.FC<CreateProps> = ({ showmodal, togglemodal, formData, isEditing }) => {
  const { state } = useAuth();
  const [services, setServices] = useState<{ id: string; service_name: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedService_id, setSelectedService_id] = useState<string>("");
  const [searchService, setSearchService] = useState("");
 
   const[searchServiceData,setSearchServiceData] = useState<Cost []>([]);
  const[filteredService,setFilteredService]=useState<Cost []>([]);

   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

  const [localFormData, setLocalFormData] = useState(formData || {
    f_cost: "",
    vehicle_type: "",
    id:"",
  });



  useEffect(() => {
    if (showmodal) {
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/admin/settings/service_details', {
            method: 'POST',
            headers: {
              'authorizations': state?.accessToken ?? '',
              'api_key': '10f052463f485938d04ac7300de7ec2b', 
            },
            body: JSON.stringify({  }),
          });
          const data = await response.json();
        
          if (data.success) {
            setServices(data.data);
           
          }
        } catch (error:any) {
          console.error("Error fetching Services:", error);
        }
      };

      fetchServices();
    }
  }, [showmodal]);
 

  useEffect(() => {
    if (formData) {
      setLocalFormData(formData);
    }
  }, [formData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };


  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if ( !localFormData.vehicle_type.trim() || !localFormData.f_cost) {
      setError("All fields are required.");
      return;
    }

    console.log(formData?.service_id, "service_id");
    try {
      // const payload = { ...localFormData, service_id: selectedServiceid };
      const response = await fetch("/api/admin/accounts/add_license_cost", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...localFormData, service_id: selectedService_id }),
      });
  
      console.log(localFormData, "data sent to backend");
  
      const responseJson = await response.json();
      toast.success("Licence Cost added successfully");
      console.log("Response from backend:", responseJson);
      togglemodal();
      
    } catch (error : any) {
      console.error("Error submitting form:", error);
      toast.error(error.msg || "An error occurred while adding the Licence Cost.");
      alert(`An error occurred while adding the licence.`);
    }
  };

    const fetchSearchService = async () => {
      try {
        const response = await fetch("/api/admin/report/get_service_autocomplete", {
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
          setSearchServiceData(data.data.service_details || []);
          setFilteredService(data.data.service_details || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
  
    useEffect(() => {
      fetchSearchService();
    }, [state]);
  
    const handleSearchService = (e : any) => {
      const value = e.target.value;
      setSearchService(value);
  
      const searchData = searchServiceData.filter(
        (item) =>
          item.text.toLowerCase().includes(value.toLowerCase())
  
      );
  
      setFilteredService(searchData);
    };
  
    
    const handleSelectService = (service :Cost) => {
      setSelectedService(service.text);
      setSelectedService_id(service.id);
      setSearchService("");
      setIsDropdownOpen(false); // Close dropdown after selection
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
    <div>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={togglemodal}></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col  rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              {/* {isEditing ? "Edit License Cost" : "Add License Cost"} */}
              Add Licence Cost
            </h3>
            <button onClick={togglemodal} className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">

                   <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>   

            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4" >
            
            {/* Form fields */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           
<div className="relative w-full" ref={dropdownRef}>
      <label htmlFor="mobile" 
      // className="block text-sm font-medium text-slate-700 dark:text-navy-100"
      className="block text-sm text-[#64748B] dark:text-[#A3ADC2]"
      >
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


              <label className="block">
              <span>Vehicle Type</span>
              <select name="vehicle_type" value={localFormData.vehicle_type} onChange={handleChange} 
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
              >
                <option value="">Please Select Vehicle Type</option>
               <option value="lmc">LMV</option>
               <option value="mc">MC</option>
               <option value="lmc_mc">Both</option>
               <option value="auto">Auto rickshaw</option>
              </select>
              </label>

              <label className="block">
                <span>Cost</span>
            <input 
            name="f_cost"
             value={ localFormData.f_cost}
              onChange={handleChange}
              onKeyPress={(e) => {
                // Allow only numbers, backspace, and dot
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                  e.preventDefault();
                }
              }}
               type="text"
                placeholder="Cost" 
                className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
            </label>
          
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <button type="submit" className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5 mt-4">
            {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;