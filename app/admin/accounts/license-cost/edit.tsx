import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface Cost {
   
       f_cost: string;
    m_cost: string;
    service_id: string;
    vehicle_type: string;
    id?: string;
    status: string;
    service_name: string;
    branch_name:string;
    added_date:string;
    text:string;
  }


interface EditProps {
  showModal: boolean;
  togglemodal: () => void;
  costData: Cost | null;
  onSave: (updatedDriver: Cost) => void;
}



const Edit = ({ showModal, togglemodal, costData, onSave }: EditProps) => {
  const { state } = useAuth();
  const [services, setServices] = useState<{ id: string; service_name: string }[]>([]);
  const [formData, setFormData] = useState<Cost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


// console.log(formData?.vehicle_type,"vehicle type");
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchService, setSearchService] = useState("");
  // const[searchServiceData,setSearchServiceData] =useState("");
  // const[filteredService,setFilteredService]=useState("");
  const[searchServiceData,setSearchServiceData] = useState<Cost []>([]);
  const[filteredService,setFilteredService]=useState<Cost []>([]);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);




 

  useEffect(() => {
    if (costData) {
      // Exclude password from being pre-filled
      setFormData({
        ...costData,
      
        // password: '', 
      });
    }
  }, [costData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  };



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
  
    try {
      if (formData) {
        const transformedData = {
          id: formData.id,
          f_cost: formData.f_cost,
          service_id: formData.service_id,
          vehicle_type: formData.vehicle_type,
          
        };
  
        console.log('Transformed Data:', transformedData);
  
        const response = await fetch(`/api/admin/accounts/update_license_cost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorizations: state?.accessToken ?? '',
            api_key: '10f052463f485938d04ac7300de7ec2b',
          },
          body: JSON.stringify(transformedData),
        });
  
        console.log('Response Status:', response.status);
        const data = await response.json();
 
        console.log('Response Data:', data);
  
        if (data.success) {
          toast.success('Licence Cost updated successfully');
          setSuccess(true);
          onSave(formData);
         
        } else {
          toast.error(data.msg || 'Failed to update licence cost');
          // toast.info("No changes detected. Please modify the data to update.");
          console.log('Error Messages:', data.error_msgs);
        }
      }
    } catch (err:any) {
      console.error('Error during API call:', err);
      // setError('An error occurred while updating the driver.');
      toast.error(err.msg || "An error occurred while updating the Licence Cost.");
    } finally {
      setLoading(false);
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
     // console.log("Search mobile data", data.data.service_details);

      if (data.success) {
        setSearchServiceData(data.data.service_details || []);
        setFilteredService(data.data.service_details|| []);
       // console.log("Search mobile data", data.data.service_details);
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
   
    // setSelectedMobile(`${mobile.text} - ${mobile.term}`);
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

  if (!showModal || !formData) return null;
  return (
    <div>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={togglemodal}></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col  rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Licence Cost
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
      <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
       Service Name
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="mt-1 text-sm pl-2 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        {selectedService || formData.service_name || "Select a Service"}
        <span className="ml-2 dark:text-slate-400/70">
                  <FaChevronDown />
                </span>
      </div>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
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

  {/* vehicle Type */}
              <label className="block">
                <span>Vehicle Type</span>
                <span className="relative mt-1 flex">
              <select 
              name="vehicle_type" 
              value={formData?.vehicle_type || ""} 
              onChange={handleChange} 
              className="text-sm pl-2 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
              >
           
                <option value="">Please Select Vehicle Type</option>
               <option value="lmc">LMV</option>
               <option value="mc">MC</option>
               <option value="lmc_mc">Both</option>
               <option value="auto">Auto Rickshaw</option>
              </select>
              </span>
              </label>

              <label className="block">
                <span>Cost</span>
            <input 
            name="f_cost"
             value={formData.f_cost}
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
            <button type="submit" className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5 mt-4">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;