import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../src/layouts/MainLayout';
import DashboardLayout from '../src/layouts/DashboardLayout';

import LoginView from '../src/views/auth/LoginView';
import NotFoundView from '../src/views/errors/NotFoundView';
import UserView from '../src/views/administration/user/UserView';
import CompanyView from '../src/views/administration/customer/CompanyView';
import BrandView from '../src/views/administration/brand/BrandView';
import UoMView from '../src/views/administration/uom/UoMView';
import WarehouseView from '../src/views/administration/warehouse/WarehouseView';
import CategoryView from '../src/views/administration/category/CategoryView';
import ProductView from '../src/views/administration/product/ProductView';

import ProductInwardView from '../src/views/operations/productInward/ProductInwardView';
import DispatchOrderView from '../src/views/operations/dispatchOrder/DispatchOrderView';
import ProductOutwardView from '../src/views/operations/productOutward/ProductOutwardView';
import InventoryView from '../src/views/reporting/inventory/InventoryView';
import ExportView from '../src/views/reporting/exports/ExportView';
import { checkPermission } from './utils/auth';
import DriverView from './views/logistics/driver/DriverView';
import VehicleView from './views/logistics/vehicle/VehicleView';
import RideView from './views/logistics/ride/RideView';
import AddRideView from './views/logistics/ride/AddRideView';
import AddProductOutwardView from './views/operations/productOutward/AddProductOutwardView';
import ViewProductOutwardDetails from './views/operations/productOutward/ViewProductOutwardDetails';
import AddProductInwardView from './views/operations/productInward/AddProductInwardView';
import AddDispatchOrderView from './views/operations/dispatchOrder/AddDispatchOrderView';
import ViewDispatchOrderDetails from './views/operations/dispatchOrder/ViewDispatchOrderDetails';
import InwardProductDetailsView from './views/operations/productInward/InwardProductDetailsView';


const routes = (user) => [
  {
    path: 'administration',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      {
        path: 'user',
        element: checkPermission(user, 'OPS_USER_FULL') ? <UserView /> : <Navigate to='404' />,
      },
      {
        path: 'customer',
        element: checkPermission(user, 'OPS_CUSTOMER_FULL') ? <CompanyView key={window.location.pathname} relationType="CUSTOMER" /> : <Navigate to="404" />
      },
      {
        path: 'warehouse',
        element: checkPermission(user, 'OPS_WAREHOUSE_FULL') ? <WarehouseView /> : <Navigate to="404" />
      },
      {
        path: 'brand',
        element: checkPermission(user, 'OPS_BRAND_FULL') ? <BrandView /> : <Navigate to="404" />
      },
      {
        path: 'uom',
        element: checkPermission(user, 'OPS_UOM_FULL') ? <UoMView /> : <Navigate to="404" />
      },
      {
        path: 'category',
        element: checkPermission(user, 'OPS_CATEGORY_FULL') ? <CategoryView /> : <Navigate to="404" />
      },
      {
        path: 'product',
        element: checkPermission(user, 'OPS_PRODUCT_FULL') ? <ProductView /> : <Navigate to="404" />
      },
      {
        path: '/',
        element: checkPermission(user, 'OPS_USER_FULL') ? <Navigate to='/administration/user' /> : <Navigate to='/administration/customer' />
      },
      {
        path: '*',
        element: <Navigate to='/404' />
      }
    ]
  },
  {
    path: 'operations',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      {
        path: 'product-inward',
        element: checkPermission(user, 'OPS_PRODUCTINWARD_FULL') ? <ProductInwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-inward/create',
        element: checkPermission(user, 'OPS_PRODUCTINWARD_FULL') ? <AddProductInwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-inward/edit',
        element: checkPermission(user, 'OPS_PRODUCTINWARD_FULL') ? <AddProductInwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-inward/view/:uid',
        element: checkPermission(user, 'OPS_PRODUCTINWARD_FULL') ? <InwardProductDetailsView /> : <Navigate to="404" />
      },
      {
        path: 'dispatch-order',
        element: checkPermission(user, 'OPS_DISPATCHORDER_FULL') ? <DispatchOrderView /> : <Navigate to="404" />
      },
      {
        path: 'dispatch-order/create',
        element: checkPermission(user, 'OPS_DISPATCHORDER_FULL') ? <AddDispatchOrderView /> : <Navigate to="404" />
      },
      {
        path: 'dispatch-order/edit',
        element: checkPermission(user, 'OPS_DISPATCHORDER_FULL') ? <AddDispatchOrderView /> : <Navigate to="404" />
      },
      {
        path: 'dispatch-order/view/:uid',
        element: checkPermission(user, 'OPS_DISPATCHORDER_FULL') ? <ViewDispatchOrderDetails /> : <Navigate to="404" />
      },
      {
        path: 'product-outward',
        element: checkPermission(user, 'OPS_PRODUCTOUTWARD_FULL') ? <ProductOutwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-outward/create',
        element: checkPermission(user, 'OPS_PRODUCTOUTWARD_FULL') ? <AddProductOutwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-outward/edit',
        element: checkPermission(user, 'OPS_PRODUCTOUTWARD_FULL') ? <AddProductOutwardView /> : <Navigate to="404" />
      },
      {
        path: 'product-outward/view/:uid',
        element: checkPermission(user, 'OPS_PRODUCTOUTWARD_FULL') ? <ViewProductOutwardDetails /> : <Navigate to="404" />
      },
      { path: '*', element: <Navigate to='/404' /> }
    ]
  },
  {
    path: 'logistics',
    element: !!user ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      {
        path: 'vendor',
        element: checkPermission(user, 'OPS_CUSTOMER_FULL') ? <CompanyView key={window.location.pathname} relationType="VENDOR" /> : <Navigate to="404" />
      },
      {
        path: 'driver',
        element: <DriverView />
      },
      {
        path: 'vehicle',
        element: <VehicleView />
      },
      {
        path: 'ride',
        element: <RideView />
      },
      {
        path: 'ride/create',
        element: <AddRideView />
      }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: !!user ? <Navigate to='/administration' /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: 'reporting',
    element: <DashboardLayout />,
    children: [
      {
        path: 'inventory',
        element: checkPermission(user, 'OPS_INVENTORY_FULL') ? <InventoryView /> : <Navigate to="404" />
      },
      {
        path: 'export',
        element: checkPermission(user, 'OPS_EXPORT_FULL') ? <ExportView /> : <Navigate to="404" />
      }
    ]

  }
];

export default routes;
