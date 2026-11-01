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
import { useBodyScrollLock } from './utils/scrollLock';

const AppContent: React.FC = () => {
  const { 
    viewMode,
    isCartOpen,
    isCheckoutOpen,
    isNeighborhoodModalOpen,
    isUtilitiesModalOpen,
    isProfileOpen,
    selectedProductDetail
  } = useStore();

  const isAnyModalActive = Boolean(
    (viewMode !== 'store' && viewMode !== 'admin') ||
    isCartOpen ||
    isCheckoutOpen ||
    isNeighborhoodModalOpen ||
    isUtilitiesModalOpen ||
    isProfileOpen ||
    Boolean(selectedProductDetail)
  );

  useBodyScrollLock(isAnyModalActive);

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col font-sans selection:bg-[#173b28] selection:text-white w-full max-w-full overflow-x-clip">
      {/* Top Bar adhering to 3-zone contract */}
      <Header />

      {/* Main View: Storefront stays active, and modal pages open as overlays fitting 80% vertical space */}
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {viewMode === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <Storefront />
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
          </>
        )}
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
