'use client'
import { useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'react-toastify';



// typescript interfaces

//profile info part
interface UserProfile {
  admissionNo: string;
  applicationNo: string;
  name: string;
  mobile: string;
  dob: string;
  address: string;
  dlNo: string;
  bloodGroup: string;
  gender: string;
  branchId: string;
  userPhoto?: File | null;
  signature?: File | null;
  documents: Document[];
}

interface Document {
  type: string;
  file: File | null;
}

//service info part
interface ServiceInfo {
  serviceId: string;
  billNo: string;
  licenceNumber: string;
  vehicleNumber: string;
  renewalDate: string;
  returnDate: string;      // this only in edit component
  paymentMethod: string;
  totalAmount: number;
  discount: number;
  payAmount: number;
  payingAmount: number;
  remarks: string;
}

interface AdmissionData {
  profileOption: 'create' | 'alreadyCreated';
  existingMobile?: string;
  existingAdmissionNo?: string;
  profile: UserProfile;
  service: ServiceInfo;
}


interface Branch {
  id: string;
  text: string;
}

interface Service {
  id: string;
  text: string;

}

interface ExistingUser {
  id: string | number;
  text: string;
  user_name: string;
  admissionNo?: string;
}

interface AdmissionModalProps {
  showmodal: boolean;
  togglemodal: () => void;
  admissionData?: AdmissionData;
  isEditing?: boolean;
  onAdmissionAdded?: () => void;
}



export default function Create({ showmodal, togglemodal, admissionData, isEditing = false, onAdmissionAdded }: AdmissionModalProps) {

  const { state } = useAuth();
  //console.log("branch details" , state.user.data.full_name);
  


  //main admission data state
  const [admissionFormData, setAdmissionFormData] = useState<AdmissionData>({

    profileOption: 'create',

    existingMobile: '',
    existingAdmissionNo: '',

    profile: {
      admissionNo: "",
      applicationNo: "",
      name: "",
      mobile: "",
      dob: "",
      address: "",
      dlNo: "",
      bloodGroup: "",
      gender: "",
      branchId: "",
      userPhoto: null,
      signature: null,
      documents: [
        { type: "", file: null },
        { type: "", file: null }
      ]
    },

    service: {
      serviceId: "",
      billNo: "",
      licenceNumber: "",
      vehicleNumber: "",
      renewalDate: "",
      returnDate: "",   // edit component field
      paymentMethod: "",
      totalAmount: 0,
      discount: 0,
      payAmount: 0,
      payingAmount: 0,
      remarks: ""
    }
  })



  // selected option for create and already created
  const [selectedOption, setSelectedOption] = useState<string>("create")


  //data states
  const [existingUsers, setExistingUsers] = useState<ExistingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExistingUser[]>([]);

  // mobile/ name for already created - states
  const [allUsersMN, setallUsersMN] = useState<ExistingUser[]>([])
  const [filteredAllUsersMN, setfilteredAllUsersMN] = useState<ExistingUser[]>([])
  const [searchTermM, setSearchTermM] = useState("")

  // state for admission number
  const [admissionNumbers, setAdmissionNumbers] = useState<ExistingUser[]>([])
  const [filteredAdmissionNumbers, setFilteredAdmissionNumbers] = useState<ExistingUser[]>([])
  const [searchAdmission, setSearchAdmission] = useState("")

  // service related states
  const [services, setServices] = useState<Service[]>([]);
  const [searchService, setsearchService] = useState("")
  const [filteredServices, setfilteredServices] = useState<Service[]>([])
  const [selectedService, setselectedService] = useState("")


  // branch related states
  const [branches, setBranches] = useState<Branch[]>([]); // storing all branches from api




  // url image store for user photo
  const [photoPreview, setphotoPreview] = useState<string>("")
  //url for signature
  const [signPreview, setsignPreview] = useState<string>("")
  // url for document1
  const [doc1Preview, setdoc1Preview] = useState<string>("")
  // url for document2
  const [doc2Preview, setdoc2Preview] = useState<string>("")


  //Dropdown states
  // dropdown option for already created admission
  const [isadmissionDropdownM, setIsadmissionDropdownM] = useState(false);
  const [isadmissionDropdownA, setIsadmissionDropdownA] = useState(false);
  // dropdown for servive select
  const [isserviceDropdown, setisserviceDropdown] = useState(false)
  


  //refs for closing dropdown when clicking outside
  const dropdownRefM = useRef<HTMLDivElement>(null)
  const dropdownRefA = useRef<HTMLDivElement>(null)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)


  //fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  //close dropdown when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      // Check each dropdown individually
      //This means: "If the dropdown exists AND click was NOT inside it"
      if (dropdownRefM.current && !dropdownRefM.current.contains(event.target as Node)) {
        setIsadmissionDropdownM(false); // Close mobile/name dropdown
      }
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target as Node)) {
        setIsadmissionDropdownA(false); // Close admission number dropdown
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setisserviceDropdown(false); // Close service dropdown
      }
    };
    //cleanup 
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [])



  //fetch initial data from backend , system allows creating new profiles OR using existing ones, Without existing user data, you might create duplicate profiles for the same person , The "Already Created" option relies entirely on existing user data Users can search and select from previously created profiles

  const fetchInitialData = async () => {

    try {

      //fetch branches
      const branchesResponse = await fetch('/api/admin/report/get_branch_autocomplete', {
        method: 'POST',
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({})
      });
      const branchesData = await branchesResponse.json()
      //console.log('all branches api', branchesData.data.branch_details);   // branchesData.data.branch_details          
      setBranches(branchesData.data.branch_details)



      //fetch services
      const servicesResponse = await fetch('/api/admin/report/get_service_autocomplete', {
        method: 'POST',
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({})
      });

      const servicesData = await servicesResponse.json()
      //console.log('all services api', servicesData);
      setServices(servicesData.data.service_details)




      //fetch existing user
      // const userResponse = await fetch('', {
      //   method: 'POST',
      //   headers: {
      //     authorizations: state?.accessToken ?? "",
      //     api_key: "10f052463f485938d04ac7300de7ec2b",
      //   },
      //   body: JSON.stringify({})
      // });

      // if (!userResponse.ok) {
      //   const errorData = await userResponse.json();
      //   throw new Error(`HTTP error! Status: ${userResponse.status} - ${errorData.message || "Unknown error"}`);
      // }

      // // if success
      // const usersData = await userResponse.json();
      // console.log('usersData api', usersData);
      // setExistingUsers(usersData);
      // setFilteredUsers(usersData);
      // console.log('existing user', existingUsers);
      // console.log('filtered users', filteredUsers);



    } catch (error) {
      console.error('error fetching initial data', error);
    }
  }

  //console.log('all services', services);




  //filtered services data based on search
  useEffect(() => {

    if (searchService) {
      const filtered = services.filter((single_service) => single_service.text.toLowerCase().includes(searchService.toLowerCase()))

      setfilteredServices(filtered)
    }
    else {
      setfilteredServices(services)
    }
  }, [searchService, services])

  //console.log('searched service' , searchService);
  //console.log('filtered services' , filteredServices);

  //when a service is selected displays in box
  const handleSelectService = (service: Service) => {
    setselectedService(service.text)
    setsearchService("")
    setisserviceDropdown(false)
  }


  // when enter into input field the value is get to the admission data by the general fuction
  const handleProfileChange = (field: keyof UserProfile, value: string) => {

    setAdmissionFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };
  //console.log(admissionFormData);


  //service section input data is get into the state
  const handleServiceChange = (field: keyof ServiceInfo, value: string | number) => {

    setAdmissionFormData(prev => ({
      ...prev,
      service: {
        ...prev.service,
        [field]: value
      }
    }));
  };



  // user photo upload
  const handleUserPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0]
    //console.log(file);

    if (file) {
      setAdmissionFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          userPhoto: file
        }
      }));

      // create a url to display , this only contain recent upload image . ie. only one
      const url = URL.createObjectURL(file)
      setphotoPreview(url)
    }
    //console.log("photo url", photoPreview);
  }


  //user signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    //console.log(file);

    if (file) {
      setAdmissionFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          signature: file
        }
      }));

      //create url to show the image
      const url = URL.createObjectURL(file)
      setsignPreview(url)
    }
    //console.log('sign url', signPreview);
  }

  // document 1 upload
  const handleDocument1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    //console.log(file);

    if (file) {

      setAdmissionFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          documents: [
            {
              ...prev.profile.documents[0],
              file: file
            },
            prev.profile.documents[1]
          ]
        }
      }));
      // create url for document1
      const url = URL.createObjectURL(file)
      setdoc1Preview(url)
    }
  }
  //console.log("doc1 file", admissionFormData.profile.documents[0]); // {type: 'aadhaar', file: File}
  //console.log("document1 url", doc1Preview);



  // document 2 upload
  const handleDocument2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    //console.log(file);

    if (file) {

      setAdmissionFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          documents: [

            prev.profile.documents[0],

            {
              ...prev.profile.documents[1],
              file: file
            }

          ]
        }
      }));
      // create url for document1
      const url = URL.createObjectURL(file)
      setdoc2Preview(url)
    }
  }
  //console.log("doc2 file", admissionFormData.profile.documents[1]);
  //console.log("document2 url", doc2Preview);


  //document 1 type change in select options
  const handleDocument1TypeChange = (value: string) => {

    setAdmissionFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        documents: [
          {
            ...prev.profile.documents[0],
            type: value
          },
          prev.profile.documents[1]
        ]
      }
    }));
  }
  //console.log("doc 1 type", admissionFormData.profile.documents[0].type);



  //document 2 type change
  const handleDocument2TypeChange = (value: string) => {

    setAdmissionFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        documents: [
          prev.profile.documents[0],
          {
            ...prev.profile.documents[1],
            type: value
          }

        ]
      }
    }));
  }
  //console.log("doc 2 type", admissionFormData.profile.documents[1].type);



  // fetch all users name / mobile
  const allUsersData = async (searchTerm = null) => {

    try {
      const response = await fetch("/api/admin/report/get_mobile_user_autocomplete", {
        method: 'POST',
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({ term: searchTerm })
      });

      const result = await response.json()
      //console.log(result);

      if (result.success) {
        const userdata = result.data.mobile_details || []
        //console.log(userdata);

        setallUsersMN(userdata);
        setfilteredAllUsersMN(userdata)
      }

    } catch (error) {
      console.error("error fetching users data", error);
    }
  }


  // filter user based on searchterm of name/mobile  
  const handleSearchMobile = (e: any) => {
    const value = e.target.value
    setSearchTermM(value)
    allUsersData(value) // the api function call again for searchterm
  }

  // select existing user for mobile/name
  const selectExistingUserM = (user: ExistingUser) => {

    // Update admissionFormData with the selected mobile
    setAdmissionFormData(prev => ({
      ...prev,
      existingMobile: user.text
    }));

    // Fetch admission numbers for this user
    fetchAdmissionNumbers(user.text)

    setSearchTermM("")
    setIsadmissionDropdownM(false)

  }

  useEffect(() => {
    allUsersData()
  }, [state])


  //fetch admission number based on mobile/name
  const fetchAdmissionNumbers = async (mobileOrName: string) => {

    try {

      const response = await fetch("", {  // api give
        method: 'POST',
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({ mobileOrName: mobileOrName })
      });

      const result = await response.json()

      if (result.success) {
        const admissions = result.data.admission_details || [] // check api data

        setAdmissionNumbers(admissions)
        setFilteredAdmissionNumbers(admissions)

        // Auto-select if there's only one admission number
        if (admissions.length === 1) {
          handleSelectAdmission(admissions[0])
        }
      }

    } catch (error) {
      console.error('error fetching admission number', error);

    }

  }

  // search admission number
  const handleSearchAdmission = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value
    setSearchAdmission(value)

    // Filter existing admission numbers - check by api data
    const filtered = admissionNumbers.filter(admission =>
      admission.text.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAdmissionNumbers(filtered);

  }

  // select admission number
  const handleSelectAdmission = (data: ExistingUser) => {

    setAdmissionFormData(prev => ({
      ...prev,
      existingAdmissionNo: data.text
    }));

    setSearchAdmission("")
    setIsadmissionDropdownA(false)

  }



  // form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    // Ensure branchId and serviceId is set from selectedBranch and service if it's empty , coz we r storing this 2 in seperate state
    const finalFormData = {
      ...admissionFormData,
      profile: {
        ...admissionFormData.profile,
        // branchId: admissionFormData.profile.branchId || state?.user?.data?.full_name
      },
      service: {
        ...admissionFormData.service,
        serviceId: admissionFormData.service.serviceId || selectedService
      }
    };
    console.log(finalFormData);


    //create form data object to upload the file
    const formDataToSend = new FormData()

    //append each key value
    formDataToSend.append("profileOption", finalFormData.profileOption)
    formDataToSend.append("existingMobile", finalFormData.existingMobile || '')
    formDataToSend.append("existingAdmissionNo", finalFormData.existingAdmissionNo || '')

    //profile section
    formDataToSend.append('admissionNo', finalFormData.profile.admissionNo)
    formDataToSend.append("applicationNo", finalFormData.profile.applicationNo)
    formDataToSend.append("name", finalFormData.profile.name)
    formDataToSend.append("mobile", finalFormData.profile.mobile)
    formDataToSend.append("dob", finalFormData.profile.dob)
    formDataToSend.append("address", finalFormData.profile.address)
    formDataToSend.append("dlNo", finalFormData.profile.dlNo)
    formDataToSend.append("bloodGroup", finalFormData.profile.bloodGroup)
    formDataToSend.append("gender", finalFormData.profile.gender)
    formDataToSend.append("branchId", finalFormData.profile.branchId)

    //file uploads
    // add file if they exist
    if (finalFormData.profile.userPhoto) {
      formDataToSend.append("userPhoto", finalFormData.profile.userPhoto)
    }
    if (finalFormData.profile.signature) {
      formDataToSend.append("signature", finalFormData.profile.signature)
    }


    // add documents array
    finalFormData.profile.documents.forEach((doc, index) => {
      formDataToSend.append(`documents[${index}][type]`, doc.type);

      if (doc.file) {
        formDataToSend.append(`documents[${index}][file]`, doc.file)
      }
    });



    //service info
    formDataToSend.append("serviceId", finalFormData.service.serviceId)
    formDataToSend.append("billNo", finalFormData.service.billNo)
    formDataToSend.append("licenceNumber", finalFormData.service.licenceNumber)
    formDataToSend.append("vehicleNumber", finalFormData.service.vehicleNumber)
    formDataToSend.append("renewalDate", finalFormData.service.renewalDate)
    formDataToSend.append("returnDate", finalFormData.service.returnDate)    // only in edit
    formDataToSend.append("paymentMethod", finalFormData.service.paymentMethod)
    formDataToSend.append("totalAmount", finalFormData.service.totalAmount.toString())
    formDataToSend.append("discount", finalFormData.service.discount.toString())
    formDataToSend.append("payAmount", finalFormData.service.payAmount.toString())
    formDataToSend.append("payingAmount", finalFormData.service.payingAmount.toString())
    formDataToSend.append("remarks", finalFormData.service.remarks)



    // submit the data to backend
    try {

      const response = await fetch("", {   //api
        method: 'POST',
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: formDataToSend

      });

      if (!response.ok) {
        const errorData = await response.json()
        toast.error("failed to submit form")
        throw new Error(errorData.message || "failed to submit form")

      }

      //result success
      const result = await response.json()

      if (result.success) {
        console.log("admission added successfully", result);
        toast.success("Admission Added Successfully")


        // Call the refresh callback if provided
        if (onAdmissionAdded) {
          onAdmissionAdded();
        }

        //close modal
        togglemodal()

        resetform()

      }
      else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }


  //reset form
  const resetform = () => {

    setAdmissionFormData({
      profileOption: 'create',

      existingMobile: '',
      existingAdmissionNo: '',

      profile: {
        admissionNo: "",
        applicationNo: "",
        name: "",
        mobile: "",
        dob: "",
        address: "",
        dlNo: "",
        bloodGroup: "",
        gender: "",
        branchId: "",
        userPhoto: null,
        signature: null,
        documents: [
          { type: "", file: null },
          { type: "", file: null }
        ]
      },

      service: {
        serviceId: "",
        billNo: "",
        licenceNumber: "",
        vehicleNumber: "",
        renewalDate: "",
        returnDate: "",
        paymentMethod: "",
        totalAmount: 0,
        discount: 0,
        payAmount: 0,
        payingAmount: 0,
        remarks: ""
      }
    });

    //reset other states
    setSelectedOption('create')
    setselectedService("")
    setphotoPreview("")
    setsignPreview("")
    setdoc1Preview("")
    setdoc2Preview("")

  }


  return (
    <>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
        <div onClick={togglemodal} className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>

        <div className="relative flex w-full max-w-6xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
              Add Admission
            </h3>
            <button onClick={togglemodal} className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* form submit */}
          <form className="mb-8" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-5 gap-8 hide-scrollbar">
              <div className="flex-[3] mt-4 sm:mt-0 md:px-5">

                <div className="space-y-5 p-4 sm:p-5 border mb-4 mt-2 border-gray-300 shadow-md rounded-lg">
                  <label className="ml-1 block mb-2 text-lg font-medium text-slate-700 dark:text-navy-100">
                    Profile Information
                  </label>
                  <div>
                    <div className="flex items-center space-x-4 mb-4 mt-4">
                      {/* created */}
                      <label className="inline-flex items-center space-x-2">
                        <input
                          value='create'
                          checked={selectedOption === 'create'}

                          onChange={(e) => {
                            setSelectedOption(e.target.value);

                            setAdmissionFormData(prev => ({
                              ...prev,
                              profileOption: e.target.value as 'create' | 'alreadyCreated'
                            }));
                          }}
                          className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" name="create" type="radio" />
                        <span>Create</span>
                      </label>

                      {/* already created */}
                      <label className="inline-flex items-center space-x-2">
                        <input
                          value='alreadyCreated'
                          checked={selectedOption === 'alreadyCreated'}
                          onChange={(e) => {
                            setSelectedOption(e.target.value);

                            setAdmissionFormData(prev => ({
                              ...prev,
                              profileOption: e.target.value as 'create' | 'alreadyCreated'
                            }));
                          }}
                          className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" name="alreadyCreated" type="radio" />
                        <span>Already Created</span>
                      </label>

                    </div>

                    {/* field only for already created account */}

                    {selectedOption === 'alreadyCreated' && (
                      <>
                        {/* mobile field */}
                        <div className="relative w-full" ref={dropdownRefM} >
                          <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                            Enter Mobile No / Name
                          </label>

                          {/* Dropdown Button */}
                          <div
                            onClick={() => setIsadmissionDropdownM(!isadmissionDropdownM)}
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" >

                            {admissionFormData.existingMobile || "Select a Mobile / Name"}
                            <span className="ml-2 dark:text-slate-400/70">
                              <FaChevronDown />
                            </span>
                          </div>

                          {/* Dropdown Content */}

                          {isadmissionDropdownM && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                              {/* Search Bar Inside Dropdown */}
                              <input
                                type="text"
                                value={searchTermM}
                                onChange={handleSearchMobile}

                                placeholder="Search..."
                                className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" />

                              {/* Dropdown Options */}
                              <ul className="max-h-48 overflow-y-auto hide-scrollbar">

                                {filteredAllUsersMN.length > 0 ?
                                  filteredAllUsersMN.map((data) => (
                                    <li
                                      onClick={() => selectExistingUserM(data)}
                                      className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500">
                                      {data.text}
                                    </li>
                                  ))
                                  :
                                  <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                                }

                              </ul>
                            </div>
                          )}

                        </div>

                        {/*  admission number field */}
                        <div className="relative w-full mt-4" ref={dropdownRefA} >
                          <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2">
                            Enter Admission No
                          </label>

                          {/* Dropdown Button */}
                          <div
                            onClick={() => setIsadmissionDropdownA(!isadmissionDropdownA)}
                            className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" >

                            {admissionFormData.existingAdmissionNo || "Select an Admission No"}
                            <span className="ml-2 dark:text-slate-400/70">
                              <FaChevronDown />
                            </span>
                          </div>

                          {/* Dropdown Content */}

                          {isadmissionDropdownA && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                              {/* Search Bar Inside Dropdown */}
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchAdmission}
                                onChange={handleSearchAdmission}
                                className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" />

                              {/* Dropdown Options */}
                              <ul className="max-h-48 overflow-y-auto hide-scrollbar">

                                {filteredAdmissionNumbers.length > 0 ?
                                  filteredAdmissionNumbers.map((item, index) => (
                                    <li
                                      key={index}
                                      onClick={() => handleSelectAdmission(item)}
                                      className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500">
                                      admissionnumber.1
                                    </li>
                                  ))
                                  :
                                  <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>}

                              </ul>
                            </div>
                          )
                          }
                        </div>

                      </>
                    )}

                    <div className="mb-4 mt-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">

                        {selectedOption === 'create' &&
                          <label className="block mt-2">
                            <span>Admission No:</span>
                            <span className="relative mt-1 flex">
                              <input
                                value={admissionFormData.profile.admissionNo}
                                onChange={(e) => handleProfileChange("admissionNo", e.target.value)}
                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Admission No:" type="text" />
                            </span>
                          </label>
                        }

                        <label className="block mt-2">
                          <span>Application No:</span>
                          <span className="relative mt-1 flex">
                            <input
                              value={admissionFormData.profile.applicationNo}
                              onChange={(e) => handleProfileChange("applicationNo", e.target.value)}
                              className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Application No" type="text" />
                          </span>
                        </label>

                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <label className="block mt-2">
                          <span>Name <span className="text-red-500 text-lg">*</span></span>
                          <span className="relative mt-1 flex">
                            <input
                              value={admissionFormData.profile.name}
                              onChange={(e) => handleProfileChange("name", e.target.value)}
                              required className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Name" type="text" />
                          </span>
                        </label>

                        <label className="block mt-2">
                          <span>Mobile <span className="text-red-500 text-lg">*</span></span>
                          <span className="relative mt-1 flex">
                            <input
                              value={admissionFormData.profile.mobile}
                              onChange={(e) => handleProfileChange("mobile", e.target.value)}
                              required className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Mobile" type="text" />
                          </span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <label className="block mt-2">
                          <span>D-O-B</span>
                          <span className="relative mt-1 flex">
                            <input
                              value={admissionFormData.profile.dob}
                              onChange={(e) => handleProfileChange("dob", e.target.value)}
                              className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date of Birth" type="date" />
                          </span>
                        </label>

                        <label className="block mt-2">
                          <span>Address</span>
                          <span className="relative mt-1 flex">
                            <textarea
                              value={admissionFormData.profile.address}
                              onChange={(e) => handleProfileChange("address", e.target.value)}
                              rows={2} className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Address" />
                          </span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">

                        <label className="block mt-2">
                          <span>DL No:</span>
                          <span className="relative mt-1 flex">
                            <input
                              value={admissionFormData.profile.dlNo}
                              onChange={(e) => handleProfileChange("dlNo", e.target.value)}
                              type="text" placeholder="Dl No" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                          </span>
                        </label>

                        <label className="block mt-2">
                          <span>Blood Group</span>
                          <span className="relative mt-1 flex">

                            <select
                              value={admissionFormData.profile.bloodGroup}
                              onChange={(e) => handleProfileChange("bloodGroup", e.target.value)}
                              className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                              <option>Please Select Blood Group</option>
                              <option value="A+ve">A+ve</option>
                              <option value="O+ve">O+ve</option>
                              <option value="B+ve">B+ve</option>
                              <option value="AB+ve">AB+ve</option>
                              <option value="B-ve">B-ve</option>
                              <option value="A-ve">A-ve</option>
                              <option value="AB-ve">AB-ve</option>
                              <option value="O-ve">O-ve</option>
                            </select>
                          </span>
                        </label>

                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <label className="block mt-2">
                          <span>Gender</span>
                          <span className="relative mt-1 flex">

                            <select
                              value={admissionFormData.profile.gender}
                              onChange={(e) => handleProfileChange("gender", e.target.value)}
                              className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                              <option>Please Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="others">Others</option>
                            </select>
                          </span>
                        </label>

                        {/* branch name */}                       
                        <label className="block"> 
                          <span>Branch Name</span>
                          <span className="relative mt-1 flex">
                            <input
                              //value={state?.user?.data?.full_name}                             
                              className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" type="text" readOnly/>
                          </span>
                        </label>
                         
                      </div>

                      <div className="w-full max-w-3xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                          {/* user photo */}
                          <div>
                            <label className="block mb-2 mt-4">User Photo</label>

                            {/* if photo upload then photopreview */}
                            <div className={photoPreview ? "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gary-400" : "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-blue-500"}>

                              {photoPreview ? <img src={photoPreview} alt="user photo" className="max-h-full max-w-full object-contain" />
                                :
                                <span className="text-gray-500 text-sm text-center">No image selected</span>}

                            </div>

                            <div className="mt-4 flex space-x-2">

                              {!admissionFormData.profile.userPhoto ?
                                (
                                  <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                    Select Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleUserPhotoUpload} />
                                  </label>
                                )
                                /* change and remove button only if  image */
                                : (
                                  <>
                                    <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                      Change
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUserPhotoUpload}
                                        className="hidden"
                                      />
                                    </label>
                                    <button
                                      onClick={() => {
                                        setAdmissionFormData(prev => ({
                                          ...prev,
                                          profile: {
                                            ...prev.profile,
                                            userPhoto: null
                                          }
                                        }));
                                        setphotoPreview("")
                                      }}
                                      className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                      Remove
                                    </button>

                                  </>
                                )}

                            </div>

                          </div>

                          {/* signature image */}
                          <div>

                            <label className="block mb-2 mt-4">Signature</label>

                            <div className={signPreview ? "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gray-400" : "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-blue-500"}>

                              {signPreview ? <img src={signPreview} alt="user photo" className="max-h-full max-w-full object-contain" />
                                :
                                <span className="text-gray-500 text-sm text-center">No image selected</span>}

                            </div>

                            <div className="mt-4 flex space-x-2">

                              {!admissionFormData.profile.signature ? (
                                <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Select Image
                                  <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
                                </label>

                                /* change and remove button only if  image */
                              ) : (
                                <>
                                  <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                    Change
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleSignatureUpload}
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    onClick={() => {
                                      setAdmissionFormData(prev => ({
                                        ...prev,
                                        profile: {
                                          ...prev.profile,
                                          signature: null
                                        }
                                      }));
                                      setsignPreview("")
                                    }}
                                    className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>

                          </div>

                        </div>
                      </div>


                      {/* documents upload section */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">

                        {/* doc 1 */}
                        <div className="block">

                          <label className="block mt-2">
                            <span>Choose Document 1</span>
                            <span className="relative mt-1 flex">

                              <select
                                value={admissionFormData.profile.documents[0].type}
                                onChange={(e) => handleDocument1TypeChange(e.target.value)}
                                className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                                <option>Choose a Document </option>
                                <option value="sslc">SSLC</option>
                                <option value="aadhaar">Aadhaar</option>
                                <option value="birthcertificate">Birth Certificate</option>
                                <option value="passport">Passport</option>
                              </select>
                            </span>
                          </label>

                          <div>
                            <label className="block mb-2 mt-4">Document Proof</label>

                            <div className={doc1Preview ? "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gray-400" : "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-blue-500"}>

                              {doc1Preview ?
                                <img src={doc1Preview} alt="doc1 image" className="max-h-full max-w-full object-contain" />
                                :
                                <span className="text-gray-500 text-sm text-center">No image selected</span>
                              }

                            </div>

                            <div className="mt-4 flex space-x-2">

                              {!admissionFormData.profile.documents[0].file ?
                                (
                                  <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                    Select Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleDocument1Upload} />
                                  </label>
                                ) : (
                                  <>
                                    <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                      Change
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDocument1Upload}
                                        className="hidden"
                                      />
                                    </label>

                                    <button
                                      onClick={() => {
                                        setAdmissionFormData(prev => ({
                                          ...prev,
                                          profile: {
                                            ...prev.profile,
                                            documents: [
                                              {
                                                ...prev.profile.documents[0],
                                                file: null
                                              },
                                              prev.profile.documents[1]
                                            ]
                                          }
                                        }));

                                        setdoc1Preview("")
                                      }}

                                      className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                      Remove
                                    </button>
                                  </>
                                )}

                            </div>

                          </div>

                        </div>

                        {/* doc 2 */}

                        <div className="block">
                          <label className="block mt-2">
                            <span>Choose Document 2</span>

                            <span className="relative mt-1 flex">

                              <select
                                value={admissionFormData.profile.documents[1].type}
                                onChange={(e) => handleDocument2TypeChange(e.target.value)}
                                className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                                <option>Choose a Document</option>
                                <option value="sslc">SSLC</option>
                                <option value="aadhaar">Aadhaar</option>
                                <option value="birthcertificate">Birth Certificate</option>
                                <option value="passport">Passport</option>
                              </select>
                            </span>
                          </label>

                          <div>
                            <label className="block mb-2 mt-4">Document Proof</label>

                            <div className={doc2Preview ? "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gray-400" : "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-blue-500"}>

                              {doc2Preview ?
                                <img src={doc2Preview} alt="doc2 image" className="max-h-full max-w-full object-contain" />
                                :
                                <span className="text-gray-500 text-sm text-center">No image selected</span>
                              }

                            </div>

                            <div className="mt-4 flex space-x-2">

                              {!admissionFormData.profile.documents[1].file ?
                                <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Select Image
                                  <input type="file" accept="image/*" className="hidden" onChange={handleDocument2Upload} />
                                </label>
                                :
                                <>
                                  <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                    Change
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleDocument2Upload}
                                      className="hidden"
                                    />
                                  </label>

                                  <button
                                    onClick={() => {
                                      setAdmissionFormData(prev => ({
                                        ...prev,
                                        profile: {
                                          ...prev.profile,
                                          documents: [
                                            prev.profile.documents[0],
                                            {
                                              ...prev.profile.documents[1],
                                              file: null
                                            }
                                          ]
                                        }
                                      }));

                                      setdoc2Preview("")
                                    }}

                                    className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                    Remove
                                  </button>

                                </>
                              }

                            </div>

                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* service info 2nd part section */}

              <div className="flex-[3] mt-4 sm:mt-0 md:p-4 ">
                <div className="space-y-5 p-4 sm:p-5 border mb-4 mt-2 border-gray-300 shadow-md rounded-lg">
                  <label className="block mb-2 text-lg font-medium text-slate-700 dark:text-navy-100 mt-1">
                    Service Information
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* service  */}
                    <div className="relative w-full" ref={serviceDropdownRef}  >
                      <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                        Service
                      </label>

                      {/* Dropdown Button */}
                      <div onClick={() => setisserviceDropdown(!isserviceDropdown)} className="mt-1.5 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2.5 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" >
                        {/* selected service */}
                        {selectedService || "Select a Service"}
                        <span className="ml-2 dark:text-slate-400/70">
                          <FaChevronDown />
                        </span>
                      </div>

                      {/* Dropdown Content */}
                      {isserviceDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                          {/* Search Bar Inside Dropdown */}
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchService}
                            onChange={(e) => setsearchService(e.target.value)}
                            className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100" />

                          {/* Dropdown Options */}
                          <ul className="max-h-48 overflow-y-auto hide-scrollbar">

                            {filteredServices.length > 0 ?
                              filteredServices.map((service) => (
                                <li
                                  key={service.id}
                                  onClick={() => handleSelectService(service)}
                                  className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500" >
                                  {service.text}
                                </li>
                              ))
                              :
                              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>}

                          </ul>
                        </div>
                      )}
                    </div>


                    {/* bill no */}
                    <label className="block">
                      <span>Bill No:</span>
                      <span className="relative flex">

                        <input
                          value={admissionFormData.service.billNo}
                          onChange={(e) => handleServiceChange("billNo", e.target.value)}

                          className="text-sm pl-2 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Bill No:" type="text" />

                      </span>
                    </label>
                  </div>


                  {/* licence number - if selected service == renewal to licence re entry */}

                  {(selectedService === 'Renewal Licence' || selectedService === 'Duplicate Licence' || selectedService === 'Licence Re-Entry') && (
                    <label className="block">
                      <span>Licence Number:</span>
                      <span className="relative flex">

                        <input
                          value={admissionFormData.service.licenceNumber}
                          onChange={(e) => handleServiceChange("licenceNumber", e.target.value)}

                          className="text-sm pl-2 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Licence No:" type="text" />
                      </span>
                    </label>
                  )}


                  {/* vehicle number - for insurence related data*/}
                  {(selectedService === 'Insurance Renewal' || selectedService === 'Fresh Insurance' || selectedService === 'RC Renewal' || selectedService === 'RC Transfer' || selectedService === 'RC HP' || selectedService === 'CF' || selectedService === 'CF Renewal') && (
                    <label className="block">
                      <span>Vehicle Number:</span>
                      <span className="relative flex">

                        <input
                          value={admissionFormData.service.vehicleNumber}
                          onChange={(e) => handleServiceChange("vehicleNumber", e.target.value)}

                          className="text-sm pl-2 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Vehicle No:" type="text" />

                      </span>
                    </label>
                  )}

                  {/* this is removed for test */}
                  {/* <div>
                    <label className="inline-flex items-center space-x-2">
                      <input className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" />
                      <span>Study</span>
                    </label>
                    <label className="inline-flex items-center space-x-2 ml-6">
                      <input className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" />
                      <span>Licence</span>
                    </label>
                    <label className="inline-flex items-center space-x-2 ml-6">
                      <input className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" name="lmv_trial" type="radio" />
                      <span>LMV Trial</span>
                    </label>
                  </div> */}

                  {/* <label className="block">
                    <span>Both Type</span>
                    <span className="relative mt-1 flex">
                      <select className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option>Choose Type</option>
                        <option value="lmv">LMV MC both Study</option>
                        <option value="mc">LMV MC both Licence</option>
                        <option value="both">LMV Study MC Licence</option>
                        <option value="both">LMV Licence MC Study</option>
                        <option value="auto">Both Licence Study</option>
                      </select>
                    </span>
                  </label> */}

                  {/* <label className="block">
                    <span>Trial Amount</span>
                    <span className="relative mt-1 flex">
                      <input type="text" placeholder="Trial Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                    </span>
                  </label> */}

                  {/* <label className="block">
                    <span>Type</span>
                    <span className="relative mt-1 flex">
                      <select className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option>Select Type</option>
                        <option value="lmv">LMV</option>
                        <option value="mc">MC</option>
                        <option value="both">BOTH</option>
                        <option value="auto">Auto Rickshaw</option>
                      </select>
                    </span>
                  </label> */}



                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* payment method */}
                    <label className="block">
                      <span>Payment Method</span>
                      <span className="relative mt-1 flex">

                        <select
                          value={admissionFormData.service.paymentMethod}
                          onChange={(e) => handleServiceChange("paymentMethod", e.target.value)}

                          className="px-5 py-2.5 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                          <option>Select Method</option>
                          <option value="cash">Cash</option>
                          <option value="online">Online</option>
                        </select>
                      </span>
                    </label>

                    {/* renewal date */}
                    {(selectedService === 'Renewal Licence' || selectedService === 'Insurance Renewal' || selectedService === 'Fresh Insurance' || selectedService === 'RC Renewal' || selectedService === 'CF Renewal') && (
                      <label className="block">
                        <span>Renewal Date</span>
                        <span className="relative mt-1 flex">
                          <input
                            value={admissionFormData.service.renewalDate}
                            onChange={(e) => handleServiceChange("renewalDate", e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date of Renewal" type="date" />
                        </span>
                      </label>
                    )}

                  </div>

                  {/* total amount */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Total Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={admissionFormData.service.totalAmount}
                          onChange={(e) => handleServiceChange("totalAmount", e.target.value)}

                          type="text" placeholder="Total Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" 
                        />

                      </span>
                    </label>

                    {/* discount amount */}
                    <label className="block">
                      <span>Discount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={admissionFormData.service.discount}
                          onChange={(e) => handleServiceChange("discount", e.target.value)}

                          type="text" placeholder="Discount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* pay amount */}
                    <label className="block">
                      <span>Pay Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={admissionFormData.service.payAmount}
                          onChange={(e) => handleServiceChange("payAmount", e.target.value)}

                          type="text" placeholder="Total Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* paying amount */}
                    <label className="block">
                      <span>Paying Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={admissionFormData.service.payingAmount}
                          onChange={(e) => handleServiceChange("payingAmount", e.target.value)}

                          type="number" placeholder="Pay Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* remarks */}
                    <label className="block">
                      <span>Remarks</span>
                      <span className="relative mt-1 flex">

                        <textarea
                          value={admissionFormData.service.remarks}
                          onChange={(e) => handleServiceChange("remarks", e.target.value)}

                          rows={2} className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                  </div>

                  {/* submit button */}
                  <button type="submit" className="btn bg-blue-700 font-medium text-white hover:bg-primary-focus rounded p-2 w-1/5 mt-4"> Add </button>


                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );

};
