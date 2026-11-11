import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import RfqBasketDrawer from '../rfq/RfqBasketDrawer';
import CompareNotificationToast from '../common/CompareNotificationToast';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-offwhite">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RfqBasketDrawer />
      <CompareNotificationToast />
    </div>
  );
};

export default PublicLayout;

