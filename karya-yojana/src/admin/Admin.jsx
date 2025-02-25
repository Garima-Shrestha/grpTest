import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Dash = lazy(() => import("./AdminDashboard.jsx"));
const UserManage= lazy(()=>import("./AdminUser.jsx"));
const Sidebar= lazy(()=>import("./SideBar.jsx"));
const EmployerViewPage = React.lazy(() => import('../admin/EmployerView.jsx'));
const JobsHandel = React.lazy(()=>import('../admin/JobHandel.jsx'));
const Notice = React.lazy(()=>import('../admin/Notice.jsx'));
const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
   const routeComponents = {
       '/useradmin': <Dash/>,
       '/userManage':<UserManage/>,
       '/empview':<EmployerViewPage/>,
       '/handelJob':<JobsHandel/>,
       '/notice':<Notice/>,
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