// pages/unauthorized.js
// const UnauthorizedPage = () => {
//     return <p>You are not authorized to view this page.</p>;
//   };
  
//   export default UnauthorizedPage;
  


 


import Head from 'next/head'
import Link from 'next/link'

import React from 'react'

const page = () => {

  return (
    <>
    {/* <Head>
        <title> Error 401</title>
        <link rel="icon" href="/images/favicon.png" />
        <link rel="stylesheet" href="/dist/css/app.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head> */}
       <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/dist/css/app.css" />
      <div
          id="root" className={` min-h-screen flex grow bg-slate-50 dark:bg-navy-900  is-header-blur`}
        >
    <main className="grid w-full grow grid-cols-1 place-items-center">
    <div className="max-w-md p-6 text-center">
      <div className="w-full">
        <img className="w-full" src="/images/illustrations/error-401.svg" alt="image" />
      </div>
      <p className="pt-4 text-7xl font-bold text-primary dark:text-accent">
        401
      </p>
      <p className="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50">
        You are not authorized
      </p>
      <p className="pt-2 text-slate-500 dark:text-navy-200">
        You are missing the required rights to be able to access this page
      </p>
      <button className="btn mt-8 h-11 bg-primary text-base font-medium text-white hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/50 focus:bg-primary-focus focus:shadow-lg focus:shadow-primary/50 active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:hover:shadow-accent/50 dark:focus:bg-accent-focus dark:focus:shadow-accent/50 dark:active:bg-accent/90">
       <a href='/login'> Back To Home</a>
      </button>
    </div>
  </main>
  </div>
  <script src="/dist/js/app.js" defer></script>
  </>
  )
}

export default page




