// Higher Order Component (HOC) used for route protection based on authentication and user roles.

//instead of adding login checks inside every page manually, you can wrap your page like this:
//export default withAuth(DashboardPage, ['admin']);
//This means: Only admin can access the Dashboard page.
//If the user isn’t authenticated or isn’t admin, they’ll be redirected.

// withAuth.tsx (HOC)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';


// Define the allowed roles explicitly
//You’re listing all valid user roles your app supports.
//So if someone’s token says their role is “admin”, we can compare it against this list.
type Role = 'admin' | 'staff' | 'student' | 'branch';

const withAuth = <P extends object>( // the p extends object just means “this HOC can wrap any component that takes props"
  WrappedComponent: React.ComponentType<P>, //The page or component we want to protect.
  allowedRoles: Role[] = [] //Which roles can access it (e.g. ['admin'] or ['staff', 'admin']).
): React.FC<P> => {

  // The function returns a new component that does the authentication logic.
  return (props: P) => {
    // authState keeps track of: isAuthenticated: Is the user logged in? and , loading: Are we still checking ?
    const [authState, setAuthState] = useState( { isAuthenticated: false, loading: true } );
    const router = useRouter(); //useRouter() lets us redirect if the user is not authorized.
    
  

    useEffect(() => {
      //we check if there’s a token in localStorage.
      //If not → user is not logged in → redirect to /login.
      const verifyToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        //Decode the token
        // jwt token have an expiry time(exp)
        try {
          const decoded: { exp?: number } = jwtDecode(token); // Ensure `exp` is optional
          // Check expiration if `exp` exists
          //If the token is expired, remove it and redirect to login.
          //So this prevents users from using old, expired tokens.
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }

          // role based authorization
          // check the user's role stored in localstorage
          const role = localStorage.getItem('role');

          // if allowedRoles (like ['admin']) doesn't include that role, they are redirected to their correct dashboard
          // eg- if a student tries to open an admin page
          // redirect them to /student , this ensures users only see pages for thier role
          if (allowedRoles.length && role && !allowedRoles.includes(role as Role)) {
            // router.push('/unauthorized');
            const rolePaths = {
              admin: "/admin",
              branch : "/branch" ,
              staff: "/staff",
              student: "/student",
            };
            router.push(rolePaths[role as keyof typeof rolePaths] || "/unauthorized");
            return;
          }
          // mark user as authenticated
          // if the token is valid and the role is allowed -> user is successfully authenticated
          setAuthState({ isAuthenticated: true, loading: false });

          // if decoding or verification fails - clear the data and go to login page
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/login');
        }
      };

      verifyToken();
    }, [router]);

    // this is just a loading screen while the app checks authentication(so you dont flash private content briefly)
    if (authState.loading) {
      return (<div>
        {/* Loading... */}
        <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
          {/* <div className="app-preloader-inner relative inline-block size-48" /> */}
          <div className="relative inline-block size-48" />
        </div>
        </div>
    )}

    //finally render the protected component

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;





// | Step | Action                       | Result                           |
// | ---- | ---------------------------- | -------------------------------- |
// | 1    | User visits a protected page | HOC runs first                   |
// | 2    | Token missing or invalid     | Redirects to `/login`            |
// | 3    | Token valid but expired      | Clears data → `/login`           |
// | 4    | Token valid but wrong role   | Redirects to user’s allowed page |
// | 5    | Token valid + correct role   | Page renders normally            |

