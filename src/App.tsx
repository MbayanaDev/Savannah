/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { NeighborhoodModal } from './components/NeighborhoodModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UtilitiesModal } from './components/UtilitiesModal';
import { ProfileModal } from './components/ProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { viewMode } = useStore();

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col font-sans selection:bg-[#173b28] selection:text-white">
      {/* Top Bar adhering to 3-zone contract */}
      <Header />

      {/* Main View: Storefront vs Merchant Operations Hub */}
      <main className="flex-1">
        {viewMode === 'store' ? <Storefront /> : <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
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
