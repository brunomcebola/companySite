//REACT.JS COMPONENTS
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

//PÁGINAS DO SITE

import DefaultPage from './pages/defaultPage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import PlanListPage from './pages/planListPage';
import PlanPage from './pages/planPage';
import UsersManagementPage from './pages/usersManagementPage';

const Routes = () => (
    <CookiesProvider>
        <BrowserRouter>
            <Switch>
                {/* defines which page to be rendered */}
                <Route exact path='/' component={LoginPage} />   {/* login page */}
                <Route exact path='/profile' component={ProfilePage} />   {/* user profile */}
                <Route exact path='/monthlyPlan' component={PlanListPage} />   {/* monthly plan */}
                <Route exact path='/monthlyPlan/:plan' component={PlanPage} />   {/* monthly plan */}
                <Route exact path='/usersManagement' component={UsersManagementPage} />   {/* monthly plan */}
                <Route component={DefaultPage} />   {/* default page redirection */}
            </Switch>
        </BrowserRouter>
    </CookiesProvider>
);


export default Routes;