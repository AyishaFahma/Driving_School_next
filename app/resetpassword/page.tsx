'use client'
import Link from 'next/link'
import React, {Suspense, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Resetpassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

const ResetPasswordForm = () => {
 const { state } = useAuth();
 const router = useRouter();
 const searchParams = useSearchParams();
 const token = searchParams.get('token');

  const [newpass, setNew_password] =useState('');
  const [conpass, setConfirm_password] =useState('');
  const[keyword_encode,setKeyword_encode] = useState('');
const [loading, setLoading] =useState(false);
const [error, setError] = useState('');
const [message, setMessage] =useState('');

const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setMessage('');
  console.log('Reset token:', keyword_encode); // Debugging
  try {
    // const response = await fetch('/api/admin/member/change_password', {
        const response = await fetch('/api/auth/reset_password', {
       
      method: 'POST',
      headers: {
        'Authorizations': state?.accessToken ?? "",
        api_key: "10f052463f485938d04ac7300de7ec2b",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newpass,conpass,keyword_encode:token 
       

      }),
    
    });

    const data = await response.json();
    toast.success('Password updated successfully!');
    console.log('Reset password', response);
    console.log('forgotpassword', data);
    console.log('Reset password', response);
console.log('forgotpassword',data)

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    setMessage('A reset link has been sent to your email.');
    router.push('/login')
  } catch (err : any) {
    // setError(err.message || 'Failed to send reset link.');
     toast.error(err.message || 'Failed to send reset link.');
  } finally {
    setLoading(false);
  }
};

  return (
   
    <div>
       
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/dist/css/app.css" />
      <main className="grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <img
              className="mx-auto size-16"
              // src="/images/app-logo.svg"
              src="/logo.png"
              alt="logo"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                Reset Your Password
              </h2>
              {/* <p className="text-slate-400 dark:text-navy-300">
                Please sign in to continue
              </p> */}
            </div>
          </div>
          <div className="card mt-5 rounded-lg p-5 lg:p-7">
          <form onSubmit={handleChangePassword}>
            <label className="block">
              <span>New password:</span>
              <span className="relative mt-1.5 flex">
                <input
                  className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  placeholder="New password"
                  type="text"
                  value={newpass}
                  onChange={(e) => setNew_password(e.target.value)}
                  required
                />
                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                 
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </span>
              </span>
            </label>
            <label className="mt-4 block">
              <span>Confirm password:</span>
              <span className="relative mt-1.5 flex">
                <input
                  className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  placeholder="Confirm password"
                  type="text"
                  value={conpass}
                  onChange={(e) => setConfirm_password(e.target.value)} // Update state
                  required
                />
                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                  

                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </span>
              </span>
            </label>
            <div className="mt-4 flex items-center justify-between space-x-2">
              {/* <label className="inline-flex items-center space-x-2">
                <input
                  className="form-checkbox is-basic size-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                  type="checkbox"
                />
                <span className="line-clamp-1">Remember me</span>
              </label> */}
               {/* <span>Already have an account? </span> */}
              {/* <Link
                href="/login"
                className="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100"
              >
                sign in
              </Link> */}
            </div>
            <button   type="submit" className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
          
             Set password 
            </button>
           
            </form>
          {error && <p className="mt-3 text-red-500">{error}</p>} 
          </div>
        </div>

        <div className="mt-4 text-center text-xs+">
            <p className="line-clamp-1">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="text-primary hover:text-primary-focus"
              >
                Sign In
              </Link>
            </p>
          </div>


      </main>
    </div>
   
  )
}

export default Resetpassword