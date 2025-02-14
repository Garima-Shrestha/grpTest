import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Dash = lazy(() => import("./AdminDashboard.jsx"));
const UserManage= lazy(()=>import("./AdminUser.jsx"));
const Sidebar= lazy(()=>import("./SideBar.jsx"));
const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
   const routeComponents = {
       '/useradmin': <Dash/>,
       '/userManage':<UserManage/>
     };
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
            <Sidebar/>
            {routeComponents[location.pathname] || <div>404 Page Not Found</div>}
            </Suspense>
        </>
    );
}

export default Admin;