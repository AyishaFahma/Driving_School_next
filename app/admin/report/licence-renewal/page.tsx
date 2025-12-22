'use client'

import { useAuth } from '@/app/context/AuthContext';
import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'
import { CgNotes } from 'react-icons/cg';
import { FaSpinner } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import { toast } from 'react-toastify';

type Renewal = {
    id?: string;

    added_date: string;  // this may be changes into renewal date , then change in message section also
    mobile: string;
    service_name: string;
    first_name: string;
    branch_name: string;
    email: string;
    pay_amount: string;
    amount: string;
    due_amount: string;
    pay_status: string;

};


export default function LicenceRenewal() {

    const { state } = useAuth() // state is used to store user details and token in contextapi. this is passed into useEffect coz function need to run according to user login or logout state 

    // state to store all renewal data
    const [renewalData, setrenewalData] = useState<Renewal[]>([])

    //state for filtering
    const [filteredData, setfilteredData] = useState<Renewal[]>([])

    //selected service
    const [selectedService, setselectedService] = useState("All")

    const [isLoading, setisLoading] = useState(false)

    // message part
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Renewal | null>(null)
    const [messageText, setMessageText] = useState("")


    //pagination properties
    const [currentPage, setcurrentPage] = useState(1)
    const itemsperPage = 10

    //pagination logic
    const indexOfLastItem = currentPage * itemsperPage
    const indexOfFirstItem = indexOfLastItem - itemsperPage
    //this currentitems is based on filredData .slice
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

    //here also filteredData 
    const totalPage = Math.ceil(filteredData.length / itemsperPage)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage)
            setcurrentPage(page)
    }


    //function to get all licence renewal report
    const getAllLicenceReport = async () => {

        try {
            // here request url is provided in fetch and also there is a difference in api key
            const response = await fetch('/api/admin/signup/get_admission_details', {
                method: 'POST',
                headers: { // sending two type of credentials to the backend
                    'authorizations': state?.accessToken ?? '', // user's accesstoken
                    //That token is usually:
                    //Empty at first (before login),
                    //Then set when the user logs in or refreshes,
                    //Or updated when the user logs out or re-authenticates.
                    'api_key': '10f052463f485938d04ac7300de7ec2b', //API key is a secret key that identifies your app or client,
                },
                body: JSON.stringify({})
            });
            console.log(response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            const data = await response.json();
            if (data.success) {


                const renewalServices = [
                    "Renewal Licence",
                    "Insurance Renewal",
                    "Fresh Insurance",
                    "RC Renewal",
                    "CF Renewal"
                ];

                //filter the data to only include renewal services
                const filteredRenewalData = data.data.filter((item: any) => renewalServices.includes(item.service_name))


                // Step 2: Remove duplicates using map
                const uniqueMap = new Map()

                // for each record create a uniqkey like 14-29-2 , Check if this key already exists in the Map If NOT exists → Add to Map (keeps the record) . if exist skip 
                filteredRenewalData.forEach((item: any) => {
                    //create a unique key combining customer-service relationship
                    const uniqueKey = `${item.cus_service_id}-${item.student_id}-${item.service_id}`

                    //only keep the first occurence of each customer-service combination
                    if (!uniqueMap.has(uniqueKey)) {
                        uniqueMap.set(uniqueKey, item)
                    }
                })

                //convert map back to array
                const uniqueData = Array.from(uniqueMap.values())



                console.log('original data count', data.data.length);
                console.log('original data', data);
                console.log("After filtering renewal services:", filteredRenewalData.length);
                console.log('after filtering data', filteredRenewalData);
                console.log('removing duplicates', uniqueData.length);
                console.log('removing duplicates', uniqueData);


                //set the filtered data to state
                setrenewalData(uniqueData)
                setfilteredData(uniqueData)


                // // check data then proceed
                // setrenewalData(data)
                // //store it into filtered data also
                // setfilteredData(data)


            }
            else {
                console.log('API error:', data.msg || 'Unknown error');
                setrenewalData([])
                setfilteredData([])
            }
        } catch (error) {
            console.error(`fetch error ${error}`);

            setrenewalData([])
            setfilteredData([])

        }
    }


    //to apply filters
    const applyfilter = (e: React.FormEvent) => {
        e.preventDefault()

        console.log("apply filter function", selectedService);


        // apply filter logic
        if (selectedService === 'All') {
            setfilteredData(renewalData)
        }
        else {
            const filtered = renewalData.filter((item) => item.service_name === selectedService)
            setfilteredData(filtered)
        }
    }

    useEffect(() => {
        getAllLicenceReport()
    }, [state])


    //print content option - date should be changes to renewal date
    const handlePrint = (item: any) => {
        // Store original body content - so we can re store it after printing , it contain everything that is currently visible
        const originalContent = document.body.innerHTML;

        // Create print content
        const printContent = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #2c5aa0; margin: 0;">Service Invoice</h1>
                <p style="color: #666; margin: 5px 0;">Payment Receipt</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Mobile Number</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.mobile}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.first_name.toUpperCase()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Branch Name</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.branch_name}</td>
                </tr>

                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service Name</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.service_name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Status</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <span style="color: ${item.pay_status === 'completed' ? 'green' : item.pay_status === 'pending' ? 'orange' : 'red' };">
                            ${item.pay_status}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Renewal Date</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.added_date}</td>  
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Amount</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${item.amount}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Paid Amount</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${item.pay_amount}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Pending Amount</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${item.due_amount}</td>
                </tr>
            </table>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                <p style="color: #666; font-size: 12px;">
                    Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    `;

        // Replace body content with print content
        document.body.innerHTML = printContent;

        // Add print styles
        const style = document.createElement('style');
        style.innerHTML = `
        @media print {
            @page { margin: 20mm; }
            body { margin: 0; }
        }
        body { 
            background: white; 
            color: black;
        }
    `;
        document.head.appendChild(style);

        // Print and restore
        window.print();

        // Restore original content
        document.body.innerHTML = originalContent;
        document.head.removeChild(style);
    };


    // message section
    const sendWhatsAppMessage = () => {

        if (!selectedUser?.mobile) {
            toast.error("No Phone Number Available")
            return;
        };

        const cleanNumber = selectedUser.mobile.replace(/\D/g, '');
        console.log("clean number", cleanNumber);

        if (cleanNumber.length < 10) {
            toast.error("Invalid phone number. Must be at least 10 digits");
            return;
        }


        // ensure country code 
        const phone = cleanNumber.startsWith("91") ? cleanNumber : `91${cleanNumber}`
        console.log("phone with country code", phone);


        // window.location.href = `sms:${cleanNumber}?body=${encodeURIComponent(messageText)}`;  //in case of sms send- no country code needed 
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
        console.log(url);


        window.open(url, "_blank")

        setIsMessageModalOpen(false)
    }




    return (
        <>
            <div className='w-full pb-8'>

                <div className="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
                        All Renewal History
                    </h2>
                    <div className="hidden h-full py-1 sm:flex">
                        <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
                    </div>
                    <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
                        <li className="flex items-center space-x-2">
                            <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">Home
                            </a>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                        <li>Reports </li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <li>Renewal History</li>
                    </ul>
                </div>
            </div>

            {/* filter based on service */}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4" >
                <div className="card px-4 pb-4 sm:px-5 pt-4">
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
                        <form>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {/* Status Select */}
                                <div className='flex-1'>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                                        Status
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                                        value={selectedService} onChange={(e) => setselectedService(e.target.value)}>

                                        <option value="All">All</option>
                                        <option value="Renewal Licence">Renewal Licence</option>
                                        <option value="Insurance Renewal">Insurance Renewal</option>
                                        <option value="Fresh Insurance">Fresh Insurance</option>
                                        <option value="RC Renewal">RC Renewal</option>
                                        <option value="CF Renewal">CF Renewal</option>
                                    </select>
                                </div>
                                <div className='flex-1 mt-6'>
                                    {/* filter button */}
                                    <button
                                        type="submit" onClick={applyfilter}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <i className='fa fa-filter' style={{ marginTop: '3px', marginRight: '3px' }} ></i>
                                        Filter
                                    </button>
                                    {/* reset button */}
                                    <button
                                        type="button"
                                        onClick={() => { setselectedService("All"), setfilteredData(renewalData) }}
                                        className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <i className='fa fa-refresh' style={{ marginTop: '3px', marginRight: '3px' }}></i>
                                        Reset
                                    </button>

                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-between py-5 lg:py-6">
                <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
                    All Renewal History
                </span>
            </div>


            {/* table view for licence renewal report */}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6" >
                <div className="card px-4 pb-4 sm:px-5">
                    <div className="mt-5">


                        {/* <div className="gridjs-head">
                            <div className="gridjs-search">
                                <input type="search"
                                    placeholder="Type a keyword..."
                                    aria-label="Type a keyword..."
                                    className="text-sm pl-2 gridjs-input gridjs-search-input"
                                    defaultValue=""
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div> */}

                        <div className="overflow-x-auto w-full">
                            <table className="is-hoverable w-full text-left">
                                {/* table head */}
                                <thead>
                                    <tr>
                                        <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            #
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Info
                                        </th>
                                        {/* <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Info
                                        </th> */}
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Service Name
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Amount
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Pay Status
                                        </th>

                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Renewal Date
                                        </th>
                                        <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                {/* tbody */}
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-10">
                                                <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto" />
                                            </td>
                                        </tr>
                                    ) : (
                                        // currentItems.map = perform for pagination all curly bracket condition are need to be uncommented
                                        // but here filtered data is coming so value according to that check
                                        <>
                                            {currentItems?.length > 0 ? (
                                                currentItems.map((item, index) => (

                                                    <tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500" key={index}>

                                                        <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                                                            {indexOfFirstItem + index + 1}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                <span className="font-bold mr-2 dark:text-navy-100">
                                                                    Mobile:
                                                                </span>
                                                                {item.mobile ? item.mobile : "null"}
                                                            </p>
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                <span className="font-bold mr-2 dark:text-navy-100">
                                                                    Name:
                                                                </span>{" "}
                                                                {item.first_name ? item.first_name : "null"}
                                                            </p>
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                <span className="font-bold mr-2 dark:text-navy-100">
                                                                    Email:{" "}
                                                                </span>
                                                                {item.email}
                                                            </p>
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                <span className="font-bold mr-2 dark:text-navy-100">
                                                                    Branch:
                                                                </span>
                                                                {item.branch_name}
                                                            </p>

                                                        </td>


                                                        <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                                            {item.service_name}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                Total Amount: {item.amount}
                                                            </p>
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                Pay Amount: {item.pay_amount}
                                                            </p>
                                                            <p className="text-slate-400 dark:text-navy-300">
                                                                Due Amount: {item.due_amount}
                                                            </p>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                            {item.pay_status === "completed" && (
                                                                <div className="badge space-x-2.5 rounded-lg bg-success/10 text-success">
                                                                    <span className="badge bg-orange-transparent">
                                                                        <IoMdCheckmark className="mr-2" />
                                                                        Fully Paid
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {item.pay_status === "pending" && (
                                                                <div className="badge space-x-2.5 rounded-lg bg-error/10 text-error">
                                                                    <span className="badge bg-orange-transparent">
                                                                        <FiClock className="mr-2" />
                                                                        Pending
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {item.pay_status === "remaining" && (
                                                                <div className="badge space-x-2.5 rounded-lg bg-info/10 text-info">
                                                                    <span className="badge bg-orange-transparent">
                                                                        <CgNotes className="mr-2" />
                                                                        Partially Paid
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* renewal date */}

                                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                            {/* {item.added_date} */}
                                                            <div className="flex flex-col">
                                                                {/* <span>{item.added_date.split(" ")[0]}</span> */}
                                                                Date
                                                                {/* <span>{item.added_date.split(" ")[1]}</span> */}
                                                                Time
                                                            </div>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                            <div className="flex gap-2">
                                                                {/* Print button */}
                                                                <button
                                                                    onClick={() => handlePrint(item)}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm flex items-center gap-1 flex-1 justify-center" >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                                    </svg>
                                                                    Print
                                                                </button>

                                                                {/* Message button */}
                                                                <button

                                                                    onClick={() => {
                                                                        console.log("message button clicked");

                                                                        setSelectedUser(item);

                                                                        setMessageText(`Hello ${item.first_name.toUpperCase()}, Your ${item.service_name} Status is ${item.pay_status} and the Renewal Date is ${item.added_date.split(" ")[0]} .`);

                                                                        setIsMessageModalOpen(true)
                                                                    }}

                                                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded text-sm flex items-center gap-1 flex-1 justify-center" >

                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    Message
                                                                </button>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (

                                                <tr >
                                                    <td colSpan={7} className="text-center py-4 text-gray-500">No Data Available</td>
                                                </tr>

                                            )}
                                        </>
                                    )}
                                </tbody>

                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                                    Prev
                                </button>

                                {[...Array(totalPage)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 rounded ${currentPage === i + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"}`} >

                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPage}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                                    Next
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {/* message modal */}
            {isMessageModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-navy-700 w-full max-w-md rounded-lg p-5">
                        <h3 className="text-lg font-semibold mb-3">
                            Send Message to {selectedUser.first_name.toUpperCase()} - {selectedUser.mobile}
                        </h3>

                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full h-32 rounded-md border border-slate-300 p-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setIsMessageModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300" >
                                Cancel
                            </button>

                            <button
                                onClick={sendWhatsAppMessage}
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" >
                                Send via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}
