import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Seals from '../pages/Seals';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  isProtected: boolean;
}

export const routesConfig: RouteConfig[] = [
  {
    path: "/login",
    component: Login,
    isProtected: false,
  },
  {
    path: "/register",
    component: Register,
    isProtected: false,
  },
  {
    path: "/",
    component: Dashboard,
    isProtected: true,
  },
  {
    path: "/profile",
    component: Profile,
    isProtected: true,
  },
  {
    path: "/seals",
    component: Seals,
    isProtected: true,
  },
];
