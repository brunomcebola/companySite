//REACT.JS COMPONENTS
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

//PÁGINAS DO SITE

import DefaultPage from './pages/defaultPage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import MonthlyPlanListPage from './pages/monthlyPlanListPage';
import MonthlyPlanPage from './pages/monthlyPlanPage';
import UsersAccessRequestPage from './pages/usersAccessRequestPage';
import UsersManagementPage from './pages/usersManagementPage';
import InventoryListPage from './pages/inventoryListPage'
import InventoryPage from './pages/inventoryPage'
import FindUserPage from './pages/findUserPage'
import HomePage from './pages/homePage'

const Routes = () => (
    <CookiesProvider>
        <BrowserRouter>
            <Switch>
                {/* defines which page to be rendered */}
                <Route exact path='/' component={LoginPage} />   {/* login page */}
                <Route exact path='/home' component={HomePage} />   {/* user profile */}
                <Route exact path='/profile' component={ProfilePage} />   {/* user profile */}
                <Route exact path='/profile/:usr' component={ProfilePage} />   {/* user profile */}
                <Route exact path='/monthlyPlans' component={MonthlyPlanListPage} />   {/* monthly plan */}
                <Route exact path='/monthlyPlans/:plan' component={MonthlyPlanPage} />   {/* monthly plan */}
                <Route exact path='/usersAccessRequest' component={UsersAccessRequestPage} />   {/* monthly plan */}
                <Route exact path='/usersManagement' component={UsersManagementPage} />   {/* monthly plan */}
                <Route exact path='/inventory' component={InventoryListPage} />   {/* monthly plan */}
                <Route exact path='/inventory/:invent' component={InventoryPage} />   {/* monthly plan */}
                <Route exact path='/findUser' component={FindUserPage} />   {/* monthly plan */}
                <Route exact path='/contact' component={DefaultPage}  />   {/* default page redirection */}
                <Route component={DefaultPage} />   {/* default page redirection */}
            </Switch>
        </BrowserRouter>
    </CookiesProvider>
);


export default Routes;