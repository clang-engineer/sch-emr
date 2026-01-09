import React, { useEffect } from 'react';
import Header from './header/header';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { Card } from 'reactstrap';
import Footer from 'app/shared/layout/footer/footer';
import { BrowserRouter, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from '../auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { getSession } from '../reducers/authentication';
import { getProfile } from '../reducers/application-profile';

const MainLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  const paddingTop = '60px';
  return (
    <div className="app-container" style={{ paddingTop }}>
      <ErrorBoundary>
        <Header
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          ribbonEnv={ribbonEnv}
          isInProduction={isInProduction}
          isOpenAPIEnabled={isOpenAPIEnabled}
        />
      </ErrorBoundary>
      <div className="container-fluid view-container" id="app-view-container">
        <Card className="jh-card">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Card>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
