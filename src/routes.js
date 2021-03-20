import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../src/layouts/MainLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';

import LoginView from '../src/views/auth/LoginView';
import NotFoundView from '../src/views/errors/NotFoundView';
import UserView from '../src/views/administration/user/UserView';
import CustomerView from '../src/views/administration/customer/CustomerView';
import BrandView from '../src/views/administration/brand/BrandView';
import UoMView from '../src/views/administration/uom/UoMView';
import WarehouseView from '../src/views/administration/warehouse/WarehouseView';
import CategoryView from '../src/views/administration/category/CategoryView';
import ProductView from '../src/views/administration/product/ProductView';

import DispatchOrderView from '../src/views/operations/dispatch/DispatchOrderView'
import ProductInwardView from '../src/views/operations/inward/ProductInwardView'
import ProductOutwardView from '../src/views/operations/outward/ProductOutwardView'

import InventoryView from '../src/views/reporting/inventory/InventoryView'
import ExportView from '../src/views/reporting/exports/ExportView'

const routes = (user) => [
  {
    path: 'administration',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      {
        path: 'user',
        element: user && user['Role.PermissionAccesses.Permission.type'] == 'superadmin_privileges' ? <UserView /> : <Navigate to='404' />,
      },
      { path: 'customer', element: <CustomerView /> },
      { path: 'warehouse', element: <WarehouseView /> },
      { path: 'brand', element: <BrandView /> },
      { path: 'uom', element: <UoMView /> },
      { path: 'category', element: <CategoryView /> },
      { path: 'product', element: <ProductView /> },
      { path: '/', element: <Navigate to='/administration/customer' /> },
      { path: '*', element: <Navigate to='/404' /> }
    ]
  },
  {
    path: 'operations',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      { path: 'product-inward', element: <ProductInwardView /> },
      { path: 'dispatch-order', element: <DispatchOrderView /> },
      { path: 'product-outward', element: <ProductOutwardView /> },
      { path: '*', element: <Navigate to='/404' /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to='/administration' /> },
      { path: '*', element: <Navigate to='/404' /> }
    ]
  },
  {
    path: 'reporting',
    // element: !!user ? <DashboardLayout /> : <Navigate to="/login" />,
    element: <DashboardLayout />,
    children: [
      { path: 'inventory', element: <InventoryView /> },
      { path: 'export', element: <ExportView /> }
    ]

  }
];

export default routes;
