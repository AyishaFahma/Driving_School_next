



// import { useAuth } from '@/app/context/AuthContext';
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type CreateProps = {
//   showmodal: boolean;
//   togglemodal: () => void;
//   formData?: {
//     daily_status: string;
//     amount: string;
//     type: string;
//     expense_name: string;
//     id?: string;
//   };
//   isEditing?: boolean;
// };

// const Add: React.FC<CreateProps> = ({ showmodal, togglemodal, formData, isEditing = false }) => {
//   const { state } = useAuth();
//   const [accountType, setAccountType] = useState(formData?.daily_status || 'expense');
//   const [expenseType, setExpenseType] = useState(formData?.type || '');
//   const [amount, setAmount] = useState(formData?.amount || '');
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     if (isEditing && formData) {
//       setAccountType(formData.daily_status);
//       setExpenseType(formData.type);
//       setAmount(formData.amount);
//     }
//   }, [isEditing, formData]);

//   if (!showmodal) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
  
//     const data: any = {
//       daily_status: accountType,
//       amount: parseFloat(amount),
//       type: expenseType || 'general',
//       expense_name: expenseType === 'others' ? 'others' : 'petrol', 
//     };
  
  
  
  
//     console.log('Sending data to server:', data);
  
//     try {                             
//       const response = await fetch('/api/staff/accounts/add_accounts', {
//         method: "POST",
//         headers: {
//           authorizations: state?.accessToken ?? '',
//           api_key: '10f052463f485938d04ac7300de7ec2b',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error(`Error ${isEditing ? 'updating' : 'adding'} account:`, errorData.message || 'Unknown error');
//         alert(`Failed to ${isEditing ? 'update' : 'add'} account`);
//       } else {
//         const responseData = await response.json();
//         console.log(`Account ${isEditing ? 'updated' : 'added'} successfully:`, responseData);
//         alert(`Account ${isEditing ? 'updated' : 'added'} successfully!`);
//         toast.success('Account Added successfully');
//       }
//     } catch (error:any) {
//       console.error(`Network error:`, error);
//       toast.error(error.msg || 'An error occurred.');
//     } finally {
//       togglemodal(); 
//     }
//   };

//   return (
//     <div>
//       <div
//         className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
//         role="dialog"
//         onKeyDown={(e) => e.key === 'Escape' && togglemodal()}
//       >
//         <div
//           className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
//           onClick={togglemodal}
//         ></div>

//         <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
//           <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
//             <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
//               {isEditing ? 'Edit Account' : 'Add Account'}
//             </h3>
//             <button
//               onClick={togglemodal}
//               className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="size-4.5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-4">
//             {/* Radio buttons for account type */}
//             <div className="flex items-center mb-4 ml-6">
//               <label className="mr-4">
//                 <input
//                   className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
//                   name="basic"
//                   type="radio"
//                   value="expense"
//                   checked={accountType === 'expense'}
//                   onChange={() => setAccountType('expense')}
//                 />
//                 <span className="ml-2">Expense</span>
//               </label>
//               <label>
//                 <input
//                   className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
//                   name="basic"
//                   type="radio"
//                   value="income"
//                   checked={accountType === 'income'}
//                   onChange={() => setAccountType('income')}
//                 />
//                 <span className="ml-2">Income</span>
//               </label>
//             </div>

          

// {accountType === 'expense' && (
//   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//     {/* Expense Type Dropdown */}
//     <label className="block">
//       <select
//         value={expenseType}
//         onChange={(e) => setExpenseType(e.target.value)}
//         className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
//       >
//         <option value="">Please select Expense type</option>
//         <option value="petrol">Petrol</option>
//         <option value="Salary">Salary</option>
//         <option value="workshop">Workshop</option>
//         <option value="others">Others</option>
//       </select>
//     </label>

  
//     {expenseType === 'others' ? (
//   // Render Name field when expenseType is 'others'
//   <label className="block">
//     <input
//       type="text"
//       placeholder="Name"
//       value={amount}
//       onChange={(e) => setAmount(e.target.value)}
//       className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
//     />
//   </label>
// ) : (

//   <label className="block">
//     <input
//       type="text"
//       placeholder="Amount"
//       value={amount}
//       onChange={(e) => setAmount(e.target.value)}
//       className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
//     />
//   </label>
// )}

 
//     {expenseType === 'others' && (
//       <label className="block">
//         <input
//           type="text"
//           placeholder="Amount"
//           className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
//         />
//       </label>
//     )}
//   </div>
// )}
// {accountType === 'income' && (
//   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//     {/* Name Field */}
//     <label className="block">
//       <input
//         type="text"
//         placeholder="Name"
//         value={expenseType}
//         className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
//       />
//     </label>

//     {/* Amount Field */}
//     <label className="block">
//       <input
//         type="text"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
//       />
//     </label>
//   </div>
// )}
//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="bg-primary text-white rounded p-2 w-1/5 mt-4"
//             >
//            {loading ? "Adding..." : "Add"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Add;











import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  staff_id: string;
  staff_name:string;
  driver_id:string;
  driver_name:string;
  amount:string;
  total_income:string;
  total_expense:string;
  added_by:string;
  text:string;
};
type CreateProps = {
  showmodal: boolean;
  togglemodal: () => void;
  formData?: {
    daily_status: string;
    amount: string;
    type: string;
    expense_name: string;
    branch_id:string;
    driver_id:string;
    staff_id:string;
    id?: string; 
    payment_method:string;
  };
  isEditing?: boolean;
};

const Add: React.FC<CreateProps> = ({ showmodal, togglemodal, formData, isEditing = false }) => {
  const { state } = useAuth();
  const [accountType, setAccountType] = useState(formData?.daily_status || 'expense');
  const [expenseType, setExpenseType] = useState(formData?.type || '');
  const [payment_method, setpayment_method] = useState(formData?.payment_method || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [amount, setAmount] = useState(formData?.amount || '');
  const [ BranchData,  setBranchData] = useState<Account []>([]);
  const [branch_id, setbranch_id] = useState(formData?.branch_id || '');
  const [staff_id, setstaff_id] = useState(formData?.staff_id || '');
  const [driver_id, setdriver_id] = useState(formData?.driver_id || '');
  const [branch_text, setbranch_text] = useState('');
  const [expenseName, setExpenseName] = useState(formData?.expense_name || '');
//  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState("");
   const[searchBranchData,setSearchBranchData] = useState<Account []>([]);
    const [filteredBranch, setFilteredBranch] = useState<Account[]>([]);
  
const [StaffData, setStaffData] = useState([]);
 const [filteredStaff, setFilteredStaff] = useState<Account[]>([]);
    const [searchStaff, setSearchStaff] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
   
     const [selectedDriver, setSelectedDriver] = useState<string>("");
      const [searchDriver, setSearchDriver] = useState("");
      const[searchDriverData,setSearchDriverData] =useState<Account[]>([]);
      const[filteredDriver,setFilteredDriver]=useState<Account[]>([]);
    
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
       const [isstaffDropdownOpen, setIsstaffDropdownOpen] = useState(false);
         const [isdriverDropdownOpen, setIsdriverDropdownOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);
      const staffdropdownRef = useRef<HTMLDivElement>(null);
      const driverdropdownRef = useRef<HTMLDivElement>(null);
  const fetchBranchData = async () => {
    try {

      const response = await fetch('/api/admin/settings/branch_details', {
        method: 'POST',
        headers: {
           'authorizations': state?.accessToken ?? '', 
        
          'api_key': '10f052463f485938d04ac7300de7ec2b',  
        },
        body: JSON.stringify({ user_id:null}),
      });
      if (!response.ok) {
        const errorData = await response.json();
       
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
//console.log(data,"data")
      if (data.success) {
        setBranchData(data.data || []);
      } else {
      
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  useEffect(() => {
    fetchBranchData();
  }, [state]);

  if (!showmodal) return null;

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // if (!branch_id) {
    //   toast.error("Please Select a Branch.");
    //   return;
    // }
  
    // if (!amount || isNaN(Number(amount))) {
    //   toast.error("Please enter a valid amount.");
    //   return;
    // }
  // if(!accountType || !amount || !expenseType ||!branch_id || !payment_method){
  //   setError("All fields are required");
  //   return;
  // }
    const data: any = {
      daily_status: accountType,
      amount: parseFloat(amount), 
      type: expenseType || 'general',
      expense_name: expenseType === 'others' ? expenseName : expenseType, // Ensuring correct name
      branch_id: branch_id,
      staff_id: staff_id,
      driver_id: driver_id,
       payment_method: payment_method,
    };
  
    console.log('Sending data:', data);
  
    try {
      const response = await fetch('/api/staff/accounts/add_accounts', {
        method: "POST",
        headers: {
          Authorizations: state?.accessToken ?? '',
          api_key: '10f052463f485938d04ac7300de7ec2b',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        console.error(`Error adding account:`, responseData.message || 'Unknown error');
        toast.error(responseData.message || 'Failed to add account');
        return;
      }
  
      console.log('Account added successfully:', responseData);
      
      toast.success('Account added successfully');
  
    } catch (error: any) {
      console.error("Network error:", error);
      toast.error(error.message || 'An error occurred while adding the account.');
    } finally {
      togglemodal(); // Close modal
    }
  };
  

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
       console.log("Search branch data", data.data);
  
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
  
    const handleSearchBranch = (e : any) => {
      const value = e.target.value;
      setSearchBranch(value);
  
      const searchData = searchBranchData.filter(
        (item) =>
          item.text.toLowerCase().includes(value.toLowerCase())
      );
  
      setFilteredBranch(searchData);
    };
  
    
    const handleSelectBranch = (branch :any) => {
      // setSelectedBranch(branch.text);
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
    
    // Handle search input change
    const handleSearchStaff = (e:any) => {
     const value = e.target.value;
     setSearchStaff(value);
     fetchSearchStaff(value); 
    };
    
    const handleSelectStaff = (staff:any) => {
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
       
         const handleSearchDriver = (e : any) => {
           const value = e.target.value;
           setSearchDriver(value);
       
           const searchData = searchDriverData.filter(
             (item) =>
               item.text.toLowerCase().includes(value.toLowerCase())
           );
       
           setFilteredDriver(searchData);
         };
       
         
         const handleSelectDriver = (driver:any) => {
           setSelectedDriver(driver.text);
           setdriver_id(driver.id ?? "");
           setSearchDriver("");
           setIsdriverDropdownOpen(false); 
         };





    // useEffect(() => {
    //          const handleClickOutside = (event :any) => {
    //            if (driverdropdownRef.current && !driverdropdownRef.current.contains(event.target)) {
    //              setIsDropdownOpen(false);
    //            }
    //            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //              setIsdriverDropdownOpen(false);
    //            }
    //            if (staffdropdownRef.current && !staffdropdownRef.current.contains(event.target)) {
    //             setIsstaffDropdownOpen(false);
    //           }
    //          };
           
    //          document.addEventListener("mousedown", handleClickOutside);
    //          return () => document.removeEventListener("mousedown", handleClickOutside);
    //        }, []);

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



  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
        onKeyDown={(e) => e.key === 'Escape' && togglemodal()}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={togglemodal}
        ></div>

        <div className="relative flex w-full max-w-3xl origin-top flex-col  rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Add Account
            </h3>
            <button
              onClick={togglemodal}
              className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
            >
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

          <form onSubmit={handleSubmit} className="p-4">
            {/* Radio buttons for account type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Radio buttons for account type */}
            <div className="flex items-center mb-4 ml-6">
              <label className="mr-4">
                <input
                  className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                  name="basic"
                  type="radio"
                  value="expense"
                  checked={accountType === 'expense'}
                  onChange={() => setAccountType('expense')}
                />
                <span className="ml-2">Expense</span>
              </label>
              <label>
                <input
                  className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                  name="basic"
                  type="radio"
                  value="income"
                  checked={accountType === 'income'}
                  onChange={() => setAccountType('income')}
                />
                <span className="ml-2">Income</span>
              </label>
            </div>

<div>

 {/* branch */}
<div className="relative w-full" ref={dropdownRef}>
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Branch Name
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        {branch_text || "Select a Branch"}
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



</div>


                 
</div>
          

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
{( accountType === 'expense') && (
  <>
 
            {( accountType === 'expense') && (
 



 // {/* type */}
<label className="block">
 <label>Expense Type</label>
     <select
       value={expenseType}
       onChange={(e) => setExpenseType(e.target.value)}
       className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
     >
       <option value="">Please Select Expense Type</option>
       <option value="petrol">Petrol</option>
       <option value="Salary">Salary</option>
       <option value="workshop">Workshop</option>
       <option value="others">Others</option>
     </select>
   </label>

                )}
{( expenseType === 'others') && (
              <label className="block">
                <span>Name</span>
                   <input
                    type="text"
                    placeholder="Name"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </label>
            )} 
<label className="block">
  <span>Amount</span>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyPress={(e) => {
          // Allow only numbers, backspace, and dot
          if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
          }
        }}
        className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      />
    </label>
   
 
{/* staff */}
 <div className="relative w-full" ref={staffdropdownRef}>
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Staff Name
      </label>


      <div
        onClick={() => setIsstaffDropdownOpen(!isstaffDropdownOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        
        {selectedStaff || "Select a Staff"}
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
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Driver Name
      </label>


      <div
        onClick={() => setIsdriverDropdownOpen(!isdriverDropdownOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        
        {selectedDriver || "Select a Driver"}
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
        value={payment_method}
        onChange={(e) => setpayment_method(e.target.value)}
        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        <option value="">Please Select Payment Method</option>
        <option value="google_pay">Google Pay</option>
        <option value="cash">Cash</option>
      </select>
    </label>
 </>
)}
{( accountType === 'income') && (
  <>
  {( accountType === 'income') && (
<label className="block">
  <span>Name</span>
      <input
        type="text"
        placeholder="Name"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      />
    </label>
    )}
  <label className="block">
  <span>Amount</span>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyPress={(e) => {
          // Allow only numbers, backspace, and dot
          if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
          }
        }}
        className="mt-1 text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      />
    </label>

  
 
{/* staff */}
<div className="relative w-full" ref={staffdropdownRef}>
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Staff Name
      </label>


      <div
        onClick={() => setIsstaffDropdownOpen(!isstaffDropdownOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        
        {selectedStaff || "Select a Staff"}
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

         
          <ul className="max-h-48 overflow-y-auto">
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
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Driver Name
      </label>


      <div
        onClick={() => setIsdriverDropdownOpen(!isdriverDropdownOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        
        {selectedDriver || "Select a Driver"}
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

         
          <ul className="max-h-48 overflow-y-auto">
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
        value={payment_method}
        onChange={(e) => setpayment_method(e.target.value)}
        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        <option value="">Please Select Payment Method</option>
        <option value="google_pay">Google Pay</option>
        <option value="cash">Cash</option>
      </select>
    </label>
 </>
)}
    </div>
    {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <button
              type="submit"
              className="bg-primary text-white rounded p-2 w-1/5 mt-4"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;