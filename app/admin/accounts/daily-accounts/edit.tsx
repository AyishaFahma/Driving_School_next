import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface Account {

  id?: string;
  status: string;
  daily_status: string;
  type: string;
  expense_name: string;
  email: string;
  branch_id: string;
  branch_name: string;
  added_date: string;
  staff_id: string;
  staff_name: string;
  driver_id: string;
  driver_name: string;
  amount: string;
  total_income: string;
  total_expense: string;
  added_by: string;
  payment_method: string;
  text: string;

}

interface EditProps {
  showModal: boolean;
  toggleModal: () => void;
  AccountData: Account | null;
  onSave: (updatedAccount: Account) => void;
}

const Edit = ({ showModal, toggleModal, AccountData, onSave }: EditProps) => {
  const { state } = useAuth();

  const [formData, setFormData] = useState<Account | null>(null);

  const [branch_id, setbranch_id] = useState(formData?.branch_id || '');
  const [branch_text, setbranch_text] = useState('');
  const [searchBranch, setSearchBranch] = useState("");

  const [searchBranchData, setSearchBranchData] = useState<Account[]>([]);
  const [filteredBranch, setFilteredBranch] = useState<Account[]>([]);


  const [staff_id, setstaff_id] = useState(formData?.staff_id || '');


  const [StaffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState<Account[]>([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [driver_id, setdriver_id] = useState(formData?.driver_id || '');
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [searchDriver, setSearchDriver] = useState("");
  const [searchDriverData, setSearchDriverData] = useState<Account[]>([]);
  const [filteredDriver, setFilteredDriver] = useState<Account[]>([]);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isstaffDropdownOpen, setIsstaffDropdownOpen] = useState(false);
  const [isdriverDropdownOpen, setIsdriverDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const staffdropdownRef = useRef<HTMLDivElement>(null);
  const driverdropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (AccountData) {
      setFormData({
        ...AccountData,
      });
    }
  }, [AccountData]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);



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

  const handleSelectBranch = (branch: Account) => {
    setbranch_text(branch.text);
    setbranch_id(branch.id ?? "");
    setSearchBranch("");
    setIsDropdownOpen(false);
  };


  const fetchSearchStaff = async (searchTerm = null) => {
    try {
      const response = await fetch("/api/admin/report/get_staff_autocomplete", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({ term: searchTerm }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("Search staff data", data.data);

      if (data.success) {
        setStaffData(data.data.staff_details || []);
        setFilteredStaff(data.data.staff_details || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch default mobile data on load
  useEffect(() => {
    fetchSearchStaff();
  }, [state]);

  // Handle search staff change
  const handleSearchStaff = (e: any) => {
    const value = e.target.value;
    setSearchStaff(value);
    fetchSearchStaff(value);
  };

  const handleSelectStaff = (staff: any) => {
    setSelectedStaff(staff.text);
    setstaff_id(staff.id ?? "");
    setIsstaffDropdownOpen(false);
    setSearchStaff("");
  };



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
      console.log("Search driver data", data.data);

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
    );

    setFilteredDriver(searchData);
  };


  const handleSelectDriver = (driver: any) => {
    setSelectedDriver(driver.text);
    setdriver_id(driver.id ?? "");
    setSearchDriver("");
    setIsdriverDropdownOpen(false);
  };


  // coomon method for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (formData) {
        const transformedData = {
          id: formData.id,
          type: formData.type,
          amount: formData.amount,
          daily_status: formData.daily_status,
          expense_name: formData.expense_name,
          branch_id: branch_id || formData.branch_id,
          staff_id: staff_id || formData.staff_id,
          driver_id: driver_id || formData.driver_id,
          payment_method: formData.payment_method,
        };

        console.log('Transformed Data:', transformedData);

        const response = await fetch('/api/admin/accounts/update_accounts', {
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
          toast.success('Account updated successfully');
          setSuccess(true);
          onSave(formData);

        } else {
          toast.error(data.msg || 'Failed to update Cost');
          console.log('Error Messages:', data.error_msgs);
        }
      }
    } catch (err: any) {
      console.error('Error during API call:', err);
      setError('An error occurred while updating the Cost.');
      toast.error(err.msg || 'An error occurred while updating the Account.');
    } finally {
      setLoading(false);
    }
  };


  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (dropdownRef.current && event.target instanceof Node) {
        if (!dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }


      if (driverdropdownRef.current && event.target instanceof Node) {
        if (!driverdropdownRef.current.contains(event.target)) {
          setIsdriverDropdownOpen(false);
        }
      }

      if (staffdropdownRef.current && event.target instanceof Node) {
        if (!staffdropdownRef.current.contains(event.target)) {
          setIsstaffDropdownOpen(false);
        }
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  if (!showModal || !formData) return null;


  return (
    <div>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog"
        onKeyDown={(e) => e.key === "Escape" && toggleModal()}
      >
        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={toggleModal}></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Account
            </h3>
            <button onClick={toggleModal} className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">

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



            {/* Radio buttons for account type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center mb-4 ml-6">
                <label className="mr-4">
                  <input
                    className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                    name="daily_status"
                    type="radio"
                    value="expense"
                    checked={formData.daily_status === 'expense'}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Expense</span>
                </label>
                <label>
                  <input
                    className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                    name="daily_status"
                    type="radio"
                    value="income"
                    checked={formData.daily_status === 'income'}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Income</span>
                </label>
              </div>
              <div className="relative w-full" ref={dropdownRef}>
                <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                  Branch Name
                </label>

                {/* Dropdown Button */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                >
                  {branch_text || formData.branch_name || "Select a Branch"}
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
              {(formData.daily_status === 'income') && (

                <label className="block">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Name"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </label>
              )}

              {(formData.daily_status === 'expense') && (
                <label className="block">
                  <label>Expense Type</label>
                  <select

                    value={formData.expense_name}
                    name="expense_name"

                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    <option value="">Please Select Expense Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="Salary">Salary</option>
                    <option value="workshop">Workshop</option>
                    <option value="others">Others</option>
                  </select>
                </label>
              )}
              {(formData.expense_name === 'others') && (
                <label className="block">
                  <span>Type</span>
                  <input
                    type="text"
                    name="type"
                    placeholder="Name"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </label>
              )}
              <label className="block">
                <span>Amount</span>
                <input
                  type="text"
                  placeholder="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    // Allow only numbers, backspace, and dot
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }}
                  className="text-sm mt-1 pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                />
              </label>


              {/* staff */}
              <div className="relative w-full" ref={staffdropdownRef}>
                <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                  Staff Name
                </label>


                <div
                  onClick={() => setIsstaffDropdownOpen(!isstaffDropdownOpen)}
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                >

                  {selectedStaff || formData.staff_name || "Select a Staff"}

                  <span className="ml-2 dark:text-slate-400/70">
                    <FaChevronDown />
                  </span>
                </div>


                {isstaffDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">

                    <input
                      type="text"
                      value={searchStaff}
                      onChange={handleSearchStaff}
                      placeholder="Search..."
                      className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    />


                    <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((staff) => (
                          <li
                            key={staff.id}
                            onClick={() => handleSelectStaff(staff)}
                            className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                          >
                            {staff.text}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {/* driver */}
              <div className="relative w-full" ref={driverdropdownRef}>
                <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                  Driver Name
                </label>


                <div
                  onClick={() => setIsdriverDropdownOpen(!isdriverDropdownOpen)}
                  className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                >

                  {selectedDriver || formData.driver_name || "Select a Driver"}
                  <span className="ml-2 dark:text-slate-400/70">
                    <FaChevronDown />
                  </span>
                </div>


                {isdriverDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">

                    <input
                      type="text"
                      value={searchDriver}
                      onChange={handleSearchDriver}
                      placeholder="Search..."
                      className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    />


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


              <label className="block">
                <label>Payment Method</label>
                <select

                  value={formData.payment_method}
                  name="payment_method"

                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                >
                  <option value="">Please select Expense type</option>
                  <option value="google_pay">Google Pay</option>
                  <option value="cash">Cash</option>
                </select>
              </label>
            </div>



            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-3">


            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5 mt-4"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;