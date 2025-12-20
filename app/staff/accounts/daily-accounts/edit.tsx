
import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Account {
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
  }

interface EditProps {
  showModal: boolean;
  toggleModal: () => void;
  AccountData: Account | null;
  onSave: (updatedAccount: Account) => void;
}

const Edit = ({ showModal, toggleModal, AccountData, onSave }: EditProps) => {
  const { state } = useAuth();
  const [services, setServices] = useState<{ id: string; service_name: string }[]>([]);
  const [formData, setFormData] = useState<Account | null>(null);
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
        };
    
        console.log('Transformed Data:', transformedData);
  
        const response = await fetch('/api/staff/accounts/update_accounts', {
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
          setSuccess(true);
          onSave(formData);
          toast.success('Account Updated successfully');
          toggleModal();
        } else {
          setError(data.msg || 'Failed to update Cost');
          console.log('Error Messages:', data.error_msgs);
        }
      }
    } catch (err : any) {
      console.error('Error during API call:', err);
      setError('An error occurred while updating the Cost.');
      toast.error(err.msg || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };


if (!showModal || !formData) return null;

  return (
    <div>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog"
      onKeyDown={(e) => e.key === "Escape" && toggleModal()}
      >
        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={toggleModal}></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
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

          

{formData.daily_status === 'expense' && (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Expense Type Dropdown */}
    <label className="block">
      <select
        // value={expenseType}
        value={formData.expense_name}
        name="expense_name"
        // onChange={(e) => setExpenseType(e.target.value)}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        <option value="">Please select Expense type</option>
        <option value="petrol">Petrol</option>
        <option value="Salary">Salary</option>
        <option value="workshop">Workshop</option>
        <option value="others">Others</option>
      </select>
    </label>

  
    {formData.expense_name === 'others' ? (
 
  <label className="block">
    <input
      type="text"
      placeholder="Name"
      name="type"
      value={formData.type}
      onChange={handleChange}
      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
    />
  </label>
) : (

  <label className="block">
    <input
      type="text"
      placeholder="Amount"
      name="amount"
      value={ formData.amount}
      onChange={handleChange}
      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
    />
  </label>
)}

 
    {formData.expense_name === 'others' && (
      <label className="block">
        <input
          type="text"
          placeholder="Amount"
          name="amount"
          value={ formData.amount}
          onChange={handleChange}
          className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
        />
      </label>
    )}
  </div>
)}
{formData.daily_status === 'income' && (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Name Field */}
    <label className="block">
      <input
        type="text"
        placeholder="Name"
        name="type"
        value={ formData.type}
        onChange={handleChange}
        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      />
    </label>

    {/* Amount Field */}
    <label className="block">
      <input
        type="text"
        placeholder="Amount"
         name="amount"
        value={formData.amount}
        onChange={handleChange}
        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      />
    </label>
  </div>
)}
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary text-white rounded p-2 w-1/5 mt-4"
            >
               {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;