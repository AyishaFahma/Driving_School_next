

import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



interface Staff {
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
}

interface EditProps {
  showmodal: boolean;
  togglemodal: () => void;
  staffData: Staff | null;
  onSave: (updatedStaff: Staff) => void;
}



const Edit = ({ showmodal, togglemodal, staffData, onSave }: EditProps) => {


  const { state } = useAuth();

  //console.log(staffData);
  
  


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState(""); // Separate state for password
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const [branch_id, setbranch_id] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState("");

  const [searchBranchData, setSearchBranchData] = useState<Staff[]>([]);
  const [filteredBranch, setFilteredBranch] = useState<Staff[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const [formData, setFormData] = useState<Staff | null>(null);

  useEffect(() => {
    if (staffData) {
      setFormData({
        ...staffData,

      });
 
      // Don't set password from staffData for security reasons
      // Or if you want to show it, you can set it but it should be hashed

      setPassword("")    // Reset password field
    }
  }, [staffData]);





  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //     const { name, value } = e.target;
  //     setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  //   };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    // Remove spaces from password field
    if (name === "password") {
      // Handle password separately
      setPassword(value.replace(/\s/g, "")); // Remove spaces
    }
    else{
      setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (formData) {

        // prepare data for api
        const transformedData:any = {
          id: formData.user_id,
          name: formData.first_name,
          mobile: formData.mobile,
          place: formData.address,
          email: formData.email,
          branch_id: branch_id || formData.branch_id,
        };

        // Only include password if it was changed (non-empty)
        if (password.trim() !== "") {
          transformedData.password = password;
          
          // Add password validation
          if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            setLoading(false);
            return;
          }
          
          if (/\s/.test(password)) {
            toast.error("Password should not contain spaces");
            setLoading(false);
            return;
          }
        }
        
        console.log('Data being sent:', transformedData);

        const response = await fetch('/api/admin/settings/update_staff', {
          method: 'POST',
          headers: {
            authorizations: state?.accessToken ?? '',
            api_key: '10f052463f485938d04ac7300de7ec2b',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedData),
        });

        console.log('Response' , response);        
        console.log('Response Status:', response.status);

        const data = await response.json();
        console.log('Response Data:', data);


        if (response.ok) {
          if (data?.message?.success === true) {
            toast.success('Staff Details Updated Successfully');
            setSuccess(true);
            
            // Update the local state with new data           
            onSave(formData);
            setTimeout(() => {
              togglemodal();
            }, 2000);
          } else {
            // Check for specific error messages
            const errorMsg = data?.message?.msg || data?.messages?.message || 'Something went wrong! Failed to update staff';
            toast.error(errorMsg);
            console.log('Error Messages:', data);
          }
        } else {
          toast.error(`Error ${response.status}: Failed to update staff`);
        }
      }
    } catch (err: any) {
      console.error('Error during API call:', err);
      const errorMsg = err.message || 'An error occurred while updating the staff.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // all branch get
  const fetchSearchBranch = async () => {
    try {
      const response = await fetch("/api/admin/report/get_branch_autocomplete", {
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
      (item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredBranch(searchData);
  };


  const handleSelectBranch = (branch: Staff) => {
    // setSelectedBranch(branch.text);
    setbranch_id(branch.id ?? "");
    setSelectedBranch(branch.text);
    setSearchBranch("");
    setIsDropdownOpen(false);
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


  if (!showmodal || !formData) return null;
  return (
    <div>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog" onKeyDown={(e) => e.key === "Escape" && togglemodal()}>
        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={togglemodal}></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col  rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Staff
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
            {/* <div className="flex mb-4" key="id"> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span>Staff Name</span>
                <span className="relative mt-1 flex">
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Staff Name"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
              <label className="block">
                <span>Mobile</span>
                <span className="relative mt-1 flex">
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    placeholder="Mobile"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </span>
              </label>
              <label className="block">
                <span>Address</span>
                <span className="relative mt-1 flex">
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Place"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </span>
              </label>
              <label className="block">
                <span>Email</span>
                <span className="relative mt-1 flex">
                  <input name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="Email"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                </span>
              </label>




              <div className="relative w-full" ref={dropdownRef}>
                <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                  Branch Name
                </label>


                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-sm pl-2 mt-2 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                >
                  {selectedBranch || formData.branch_name || "Select a branch"}
                  <span className="ml-2 dark:text-slate-400/70">
                    <FaChevronDown />
                  </span>
                </div>


                {isDropdownOpen && (
                  <div className="text-sm pl-2 absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">

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
                        <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>




              <label className="block">
                <span>Password (Leave empty to keep current)</span>

                <span className="relative mt-1.5 flex">
                  <input
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (optional)"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-primary dark:text-navy-400 dark:hover:text-accent"
                  >
                    {showPassword ? <HiEye size={16} /> : <HiEyeOff size={16} />}
                  </span>
                </span>
                <p className="text-xs text-gray-500 mt-1 text-red-500">
                  Only enter if you want to change the password
                </p>
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