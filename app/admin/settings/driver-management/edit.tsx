import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Driver {
  first_name: string;
  status: string;
  mobile: string;
  address: string;
  driving_licence_no: string;
  date_of_joining: string;
  password: string;
  user_id?: string;
  text: string;
  id?: string;
}

interface EditProps {
  showModal: boolean;
  toggleModal: () => void;
  driverData: Driver | null;
  onSave: (updatedDriver: Driver) => void;
}

const Edit = ({ showModal, toggleModal, driverData, onSave }: EditProps) => {

  const { state } = useAuth();

  //console.log("single driver data" , driverData);
  
  const [formData, setFormData] = useState<Driver | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (driverData) {
      // Exclude password from being pre-filled
      setFormData({
        ...driverData,
        password: "", // Reset the password field
      });
    }
  }, [driverData]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent spaces in the password field
    if (name === "password" && value.includes(" ")) {
      return;
    }

    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };


  //  edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (formData) {
        const transformedData = {
          id: formData.user_id,
          driver_name: `${formData.first_name}`,
          type: "driver",
          mobile: formData.mobile,
          place: formData.address,
          driving_licence_no: formData.driving_licence_no,
          password: formData.password,
        };
        console.log("formData:", formData);
        // console.log("Address value:", formData.address);

        console.log("Transformed Data:", transformedData);

        const response = await fetch(`/api/admin/settings/update_driver`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorizations: state?.accessToken ?? "",
            api_key: "10f052463f485938d04ac7300de7ec2b",
          },
          body: JSON.stringify(transformedData),
        });

        console.log("Response:", response);

        const data = await response.json();
        
        console.log("Response Data:", data);

        
        
        if (data.message.success) {
          toast.success(data.message.msg);
          setSuccess(true);
          onSave(formData);
          //toggleModal();
        } else {
          toast.error("Failed to update driver! Please try again");
          console.log("Error Messages:", data.error_msgs);
        }
      }
    } catch (err: any) {
      console.error("Error during API call:", err);
      // setError('An error occurred while updating the driver.');
      toast.error(
        err.message || "An error occurred while updating the driver."
      );
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

        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Driver
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

          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span>Driver Name </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </span>
              </label>
              <label className="block">
                <span>Mobile </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Mobile No"
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      // Allow only numbers, backspace, and dot
                      if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                </span>
              </label>
              <label className="block">
                <span>Place </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Place"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </span>
              </label>
              <label className="block">
                <span>Driving Licence No</span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Driving Licence No"
                    type="text"
                    name="driving_licence_no"
                    value={formData.driving_licence_no}
                    onChange={handleChange}
                  />
                </span>
              </label>

              <label className="block">
                <span>Password (Leave empty to keep current)</span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter a new Password (Optional)"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute right-4 flex items-center justify-center ttext-slate-400 hover:text-primary dark:text-navy-400 dark:hover:text-accent cursor-pointer mt-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <HiEye size={16}/> : <HiEyeOff size={16}/>}
                  </span>
                </span>
                <p className="text-xs text-gray-500 mt-1 text-red-500">
                  Only enter if you want to change the password
                </p>
              </label>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5 mt-4"
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
