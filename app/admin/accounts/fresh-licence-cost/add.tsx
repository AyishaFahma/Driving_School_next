

import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type CreateProps = {
  showmodal: boolean;
  togglemodal: () => void;
  formData?: {
    cost: string;
    study_cost:string;
    licence_cost:string;
    service_id: string;
    vehicle_type: string;
    gender:string;
    id:string;
    lmc_mc_both_study:string;
    lmc_mc_both_licence:string;
    lmc_study_mc_licence:string;
    lmc_licence_mc_study:string;
  };
  isEditing?: boolean;
};
const Add: React.FC<CreateProps> = ({ showmodal, togglemodal, formData, isEditing }) => {
  const { state } = useAuth();
  const [services, setServices] = useState<{ id: string; service_name: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [localFormData, setLocalFormData] = useState(formData || {
    cost: "",
    study_cost:"",
    licence_cost:"",
    service_id: "",
    vehicle_type: "",
    gender:"",
    id:"",
    lmc_mc_both_study:"",
    lmc_mc_both_licence:"",
    lmc_study_mc_licence:"",
    lmc_licence_mc_study:"",
  })
 
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
        } catch (error) {
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
 
    if ( !localFormData.vehicle_type.trim() || ! localFormData.gender) {
    setError("All fields are required.");
    return;
  }
  try {
    const response = await fetch('/api/admin/accounts/add_fresh_license_cost', {
      method: "POST",
      headers: {
        authorizations: state?.accessToken ?? "",
        api_key: "10f052463f485938d04ac7300de7ec2b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localFormData),
    });

    console.log(localFormData, "data sent to backend");

    const responseData = await response.json();
   
    if(responseData.ok){
      toast.success('Licence Cost added successfully');
      console.log("Response from backend:", responseData);
      togglemodal(); 
    }
   

    if (!response.ok) {
      // alert(`Failed to add licence. Status code: ${response.status}`);
      toast.error(`Failed to add licence. Status code: ${response.status}`);
      return;
    }


    
  } catch (error : any) {
    console.error("Error submitting form:", error);
    toast.error(error.message || 'An Error occured');
  }
};



  return (
   



    <div>
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={togglemodal}></div>
      <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
            Add Licence Cost
          </h3>
          <button onClick={togglemodal} className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span>Vehicle Type</span>
              <select name="vehicle_type" value={localFormData.vehicle_type} onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100">
                <option value="">Please Select Vehicle Type</option>
                <option value="lmc">LMV</option>
                <option value="mc">MC</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="lmc_mc">Both</option>
              </select>
            </label>
            <label className="block">
              <span>Gender</span>
              <select name="gender" value={localFormData.gender} onChange={handleChange}
                className="mt-1 text-sm pl-2 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100">
                <option value="">Please Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
         
            {(localFormData.vehicle_type === "Both"|| localFormData.vehicle_type === "lmc_mc")? (
              <>
                <label className="block">
                  <span>LMV MC Both Study</span>
                  <input
                   name="lmc_mc_both_study" 
                  value={localFormData.lmc_mc_both_study} 
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    // Allow only numbers, backspace, and dot
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }} 
                  type="text"
                   placeholder="LMV MC both Study"
                    // className="form-input w-full rounded-lg border border-slate-300 px-3 py-2"
                     className="text-sm pl-2 mt-1 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                     />
                </label>
                <label className="block">
                  <span>LMV MC Both Licence</span>
                  <input 
                  name="lmc_mc_both_licence"
                  value={localFormData.lmc_mc_both_licence}
                   onChange={handleChange} 
                   onKeyPress={(e) => {
                    // Allow only numbers, backspace, and dot
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }}
                   type="text" 

                   placeholder="LMV MC both Licence"
                   className="text-sm pl-2 mt-1 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </label>
                <label className="block">
                  <span> LMV Study MC Licence</span>
                  <input
                  name="lmc_study_mc_licence" 
                  value={localFormData.lmc_study_mc_licence} 
                  onChange={handleChange} 
                  onKeyPress={(e) => {
                    // Allow only numbers, backspace, and dot
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }}
                  type="text" 
                  placeholder="LMV Study MC Licence"
                    className="text-sm pl-2 mt-1 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </label>
                <label className="block">
                  <span>LMV Licence MC Study</span>
                  <input
                   name="lmc_licence_mc_study" 
                   value={localFormData.lmc_licence_mc_study} 
                   onChange={handleChange} 
                   onKeyPress={(e) => {
                    // Allow only numbers, backspace, and dot
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }}
                   type="text" 
                   placeholder="LMV Licence MC Study"
                   className="text-sm pl-2 mt-1 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </label>
              </>
            ):(
              <>
               <label className="block">
               <span>Study Cost</span>
             <input name="study_cost"
             value={ localFormData.study_cost}
              onChange={handleChange}
              onKeyPress={(e) => {
                // Allow only numbers, backspace, and dot
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                  e.preventDefault();
                }
              }}
               type="text"
                placeholder="Study Cost" 
                className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
            </label>
            <label className="block">
              <span>Licence Cost</span>
            <input name="licence_cost"
             value={localFormData.licence_cost}
              onChange={handleChange}
              onKeyPress={(e) => {
                // Allow only numbers, backspace, and dot
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                  e.preventDefault();
                }
              }}
               type="text"
                placeholder="Licence Cost"
                // className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                 className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                />
           </label>
          
            </>
            )}
             <label className="block">
            <span>Both Licence Study</span>
            <input name="cost"
             value={localFormData.cost}
              onChange={handleChange}
              onKeyPress={(e) => {
                // Allow only numbers, backspace, and dot
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                  e.preventDefault();
                }
              }}
               type="text"
                placeholder="Cost"
                className="text-sm pl-2 mt-1 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
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