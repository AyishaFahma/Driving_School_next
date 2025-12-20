import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
type CreateProps = {
  showmodals: boolean;
  togglemodals: () => void;
  formData?: {
    payment_method: string;
    pay_amount: string;
    id: string;
    payed_amount: string;
    due_amount: string;
    customer_id: string;
    service_id: string;
    type: string;
    amount: string;
    total_amount: string;
    service_name: string;
    billno:string;
  };
  isEditing?: boolean;
};
interface Payment {
  payment_method: string;
  pay_amount: string;
  id: string;
  payed_amount: string;
  due_amount: string;
  customer_id: string;
  service_id: string;
  type: string;
  amount: string;
  total_amount: string;
  cus_service_id: string;
  billno:string;
}
const Payment: React.FC<CreateProps> = ({
  showmodals,
  togglemodals,
  formData,
}) => {
  const { state } = useAuth();

  const [localFormData, setLocalFormData] = useState({
    payment_method: "",
    pay_amount: "",
    id: "",
    payed_amount: "",
    due_amount: "",
    customer_id: "",
    service_id: "",
    type: "",
    amount: "",
    total_amount: "",
    cus_service_id: "",
    billno:"",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (formData) {
      setLocalFormData({
        payment_method: formData.payment_method || "cash",
        pay_amount: formData.pay_amount || "",
        id: formData.id || "",
        payed_amount: formData.payed_amount || "",
        due_amount: formData.due_amount || "",
        total_amount: formData.amount || "",
        customer_id: formData.customer_id || "",
        service_id: formData.service_id || "",
        type: formData.type || "",
        amount: formData.amount || "",
        cus_service_id: formData.customer_id || "",
        billno:formData.billno || "",
      });
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!localFormData.payment_method || !localFormData.payed_amount) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/admin/signup/admission_payment", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localFormData),
      });
      console.log("response", response);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert(`Failed to process payment: ${errorText}`);
        return;
      }
      if (response.ok) {
        alert("Payment added successfully!");
        togglemodals();
      }

      try {
        const responseJson = await response.json();
        console.log("Response from backend:", responseJson);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = (error as Error).message || String(error);
      alert(`An error occurred while processing the payment: ${errorMessage}`);
    }
  };

  if (!showmodals) return null;
  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={togglemodals}
        ></div>
        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Pay
            </h3>
            <button
              onClick={togglemodals}
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
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Service Name : {formData?.service_name}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                {/* Bill NO */}
                <label className="block">
                <span>Bill No:</span>
                <span className="relative mt-1 flex">
                  <input
                    name="billno"
                    value={localFormData.billno}
                    readOnly
                    type="text"
                    placeholder="Bill no"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
            {/* Payment Method */}
              <label className="block">
                <span>Payment Method</span>
                <span className="relative mt-1 flex">
                  <select
                    name="payment_method"
                    value={localFormData.payment_method}
                    onChange={handleChange}
                    className="text-sm pl-2 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                </span>
              </label>
  {/* Total Amount */}
              <label className="block">
                <span>Total Amount</span>
                <span className="relative mt-1 flex">
                  <input
                    name="amount"
                    value={localFormData.amount}
                    readOnly
                    type="text"
                    placeholder="Enter Total Amount"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
  {/* Paid Amount*/}
              <label className="block">
                <span>Paid Amount</span>
                <span className="relative mt-1 flex">
                  <input
                    name="pay_amount"
                    value={localFormData.pay_amount}
                    readOnly
                    type="text"
                    placeholder="Enter Payed Amount"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
               {/* Due Amount */}
              <label className="block">
                <span>Due Amount</span>
                <span className="relative mt-1 flex">
                  <input
                    name="due_amount"
                    value={localFormData.due_amount}
                    readOnly
                    type="text"
                    placeholder="Enter Due Amount"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
               {/* Pay Amount*/}
              <label className="block">
                <span>Pay Amount</span>
                <span className="relative mt-1 flex">
                  <input
                    name="payed_amount"
                    value={localFormData.payed_amount}
                    onChange={handleChange}
                    type="number"
                    placeholder="Pay Amount"
                    step="1"
                    min="0"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
                 {/* Remarks*/}
                 <label className="block ">
                        <span>Remarks</span>
                        <span className="relative mt-1 flex">
                          <textarea 
                          rows={2}
                           name="payed_amount"
                            value={localFormData.payed_amount}
                            onChange={handleChange}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                           
                          />
                        </span>
                      </label>
            </div>

          

            <div className="mt-4">
              <button
                type="submit"
                className="bg-primary text-white rounded p-2 w-1/5"
              >
                     {loading ? 'Paying...' : 'Pay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
