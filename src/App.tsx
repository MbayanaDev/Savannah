/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { AboutPage } from './components/pages/AboutPage';
import { FaqsPage } from './components/pages/FaqsPage';
import { PurposePage } from './components/pages/PurposePage';
import { RefundsPage } from './components/pages/RefundsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { ArcanaPage } from './components/pages/ArcanaPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { NeighborhoodModal } from './components/NeighborhoodModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UtilitiesModal } from './components/UtilitiesModal';
import { ProfileModal } from './components/ProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { viewMode } = useStore();

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col font-sans selection:bg-[#173b28] selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Bar adhering to 3-zone contract */}
      <Header />

      {/* Main View: Storefront vs Merchant Operations Hub vs Dedicated Individual Pages */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {viewMode === 'store' && <Storefront />}
        {viewMode === 'admin' && <AdminDashboard />}
        {viewMode === 'about' && <AboutPage />}
        {viewMode === 'faqs' && <FaqsPage />}
        {viewMode === 'purpose' && <PurposePage />}
        {viewMode === 'refunds' && <RefundsPage />}
        {viewMode === 'privacy' && <PrivacyPage />}
        {viewMode === 'terms' && <TermsPage />}
        {viewMode === 'arcana' && <ArcanaPage />}
        {viewMode === 'blog' && <AboutPage />}
        {viewMode === 'orders' && <OrdersPage />}
        {viewMode === 'profile' && <ProfilePage />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <NeighborhoodModal />
      <ProductDetailModal />
      <UtilitiesModal />
      <ProfileModal />
      <Toast />

      {/* Touch-First Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
