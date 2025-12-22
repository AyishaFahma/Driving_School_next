import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import TextEditor from './TextEditor';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff } from 'react-icons/hi';

interface Branch {
  id?: string;
  enc_id?: string;
  branch_name: string;
  mobile: string;
  status: string;
  description: string;
  password: string;
  [key: string]: any;
  text: string;
}


interface EditProps {
  showModal: boolean;
  toggleModal: () => void;
  branchData: Branch | null;
  onSave: (updatedDriver: Branch) => void;
}

const Edit = ({ showModal, toggleModal, branchData, onSave }: EditProps) => {

  const { state } = useAuth();
  console.log("single branch data", branchData);

  const [formData, setFormData] = useState<Branch | null>(null);

  const [password, setPassword] = useState(""); // Separate state for password

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  useEffect(() => {
    if (branchData) {
      setFormData({
        ...branchData
      });

      // Don't set password from staffData for security reasons
      // Or if you want to show it, you can set it but it should be hashed

      setPassword("")    // reset password field
    }
  }, [branchData]);


  // original handleChange for form elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    // Remove spaces from password field
    if (name === "password") {
      // Handle password separately
      setPassword(value.replace(/\s/g, "")); // Remove spaces
    }
    else {
      setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
    }
  };


  // Add separate handler for TextEditor
  const handleTextEditorChange = (value: string, fieldName: string) => {
    setFormData((prevData) => prevData ? { ...prevData, [fieldName]: value } : null);
  };


  // edit submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {

      if (formData) {
        // prepare data for api
        const transformedData:any = {

          id: formData.id,
          type: 'branch',
          branch_name: formData.branch_name,
          description: formData.description,
          mobile: formData.mobile,
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

        const response = await fetch(`/api/admin/settings/update_branch_details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorizations': state?.accessToken ?? '',
            api_key: '10f052463f485938d04ac7300de7ec2b',
          },
          body: JSON.stringify(transformedData),
        });

        console.log('Response:', response);

        const data = await response.json();
        console.log('Response Data:', data);

        if (data.message.success === true) {
          toast.success(data.message.msg); // "Branch Updated successfully!"
          setSuccess(true);
          onSave(formData);
          // toggleModal();
        } else {
          toast.error(data.message.msg || 'Failed to update branch');
          // toast.info("No changes detected. Please modify the data to update.");
          console.log('API logic Error');
        }
      }
    } catch (err: any) {
      console.error('Error during API call:', err);
      // setError('An error occurred while updating the driver.');
      toast.error(err.message || "An error occurred while updating the driver.");
    } finally {
      setLoading(false);
    }
  };


  if (!showModal || !formData) return null;


  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
        onKeyDown={(e) => e.key === "Escape" && toggleModal()}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={toggleModal}
        ></div>

        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-y-auto hide-scrollbar rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Branch
            </h3>
            <button
              onClick={toggleModal}
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
              <div className="space-y-5 p-4">

                <label className="block">
                  <span>Branch Name</span>
                  <input
                    className="text-sm pl-2 form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Branch Name"
                    name="branch_name"
                    type="text"
                    value={formData.branch_name}

                    onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </label>

                  <label className="block w-1/2 relative">
                    <span>Password (Leave empty to keep current)</span>
                    <div className="relative mt-1">
                      <input
                        className="text-sm pl-2 pr-10 form-input w-full rounded-lg border border-slate-300 bg-transparent py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter new password (optional)"

                        name="password"

                        type={showPassword ? "text" : "password"} //Change type based on state 

                        value={password}
                        onChange={handleChange}

                        onKeyDown={(e) => {
                          if (e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-primary dark:text-navy-400 dark:hover:text-accent"
                      >
                        {showPassword ? <HiEye size={16} /> : <HiEyeOff size={16} />}
                      </span>

                      <p className="text-xs text-gray-500 mt-1 text-red-500">
                        Only enter if you want to change the password
                      </p>

                    </div>
                  </label>
                </div>

                {/*  seperate change event for text editor */}
                <div className="mt-1.5 w-full">
                  <span>Description</span>
                  <TextEditor
                    value={formData.description}
                    onChange={(value: string) => handleTextEditorChange(value, "description")}
                  />
                </div>


                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Edit;