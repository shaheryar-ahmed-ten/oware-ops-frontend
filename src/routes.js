import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../src/layouts/MainLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';

import LoginView from '../src/views/auth/LoginView';
import NotFoundView from '../src/views/errors/NotFoundView';
import UserView from '../src/views/administration/UserView';

const routes = [
  {
    path: 'administration',
    element: <DashboardLayout />,
    children: [
      { path: 'user', element: <UserView /> },
      //   { path: 'customer', element: <CustomerView /> },
      //   { path: 'warehouse', element: <WarehouseView /> },
      //   { path: 'brand', element: <BrandView /> },
      //   { path: 'uom', element: <UomView /> },
      //   { path: 'category', element: <CategoryView /> },
      //   { path: 'product', element: <ProductView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'operations',
    element: <DashboardLayout />,
    children: [
      //   { path: 'product-inward', element: <ProductInwardView /> },
      //   { path: 'dispatch-order', element: <DispatchOrderView /> },
      //   { path: 'product-outward', element: <ProductOutwardView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/administration" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
