import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff } from "react-icons/hi";

type CreateProps = {
  showmodal: boolean;
  togglemodal: () => void;
};

const Add: React.FC<CreateProps> = ({ showmodal, togglemodal }) => {
  const { state } = useAuth();

  const [formData, setFormData] = useState({
    branch_name: "",
    mobile: "",
    password: "",
    description: "",
    save: "submit",
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  // submit function

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //console.log("Branch Name:", formData.branch_name);
    //console.log("Description:", formData.description);

    if (!formData.branch_name.trim()) {
      setError("All fields are required.");
      return;
    }
    if(!formData.description.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile number field is required and must be a valid 10-digit number.");
      return;
    }
    if (/\s/.test(formData.password)) {
      setError("Password should not contain spaces.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("password is required and must be at least 6 characters long");
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/settings/add_branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      console.log(result);

      toast.success(result.message.msg);
      console.log("Branch added successfully:", result);
      setTimeout(() => togglemodal(), 2000);
      // Clear form fields
      setFormData({
        branch_name: "",
        mobile: "",
        password: "",
        description: "",
        save: "submit",
      });

      // setTimeout(() => togglemodal(), 2000);
    } catch (err: any) {
      // setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //if (!showmodal) return null;

  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
        onKeyDown={(e) => e.key === "Escape" && togglemodal()}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={togglemodal}
        ></div>

        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-y-auto hide-scrollbar rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Add Branch
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

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 p-4">

                <label className="block">
                  <span>Branch Name</span>
                  <input
                    className="text-sm pl-2 form-input mt-1 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Branch Name"
                    name="branch_name"
                    type="text"
                    value={formData.branch_name}
                    onChange={(e) =>
                      setFormData({ ...formData, branch_name: e.target.value })
                    }
                  />
                </label>

                <div className="flex justify-between gap-3">

                  <label className="block w-1/2">
                    <span>Mobile</span>
                    <input
                      className="text-sm pl-2 form-input mt-1 w-full rounded-lg border border-slate-300 bg-transparent py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Branch Mobile"
                      name="mobile"
                      type="text"
                      onKeyPress={(e) => {
                        // Allow only numbers and backspace
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                    />
                  </label>

                  <label className="block w-1/2 relative"> 
                    <span>Password</span>
                    <div className="relative mt-1">  
                      <input
                        className="text-sm pl-2 pr-10 form-input w-full rounded-lg border border-slate-300 bg-transparent py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Password"
                        name="password"
                        type={showPassword ? "text" : "password"} //Change type based on state 
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-primary dark:text-navy-400 dark:hover:text-accent"
                      >
                        {showPassword ? <HiEye size={16} /> : <HiEyeOff size={16} />}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="mt-1.5 w-full">
                  <span>Description</span>
                  <TextEditor
                    value={formData.description}
                    onChange={(value: string) =>
                      setFormData({ ...formData, description: value })
                    }
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
