import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import CatalogPage from '@/pages/public/CatalogPage';
import ProductDetailsPage from '@/pages/public/ProductDetailsPage';
import ComparePage from '@/pages/public/ComparePage';
import RfqPage from '@/pages/public/RfqPage';
import AboutPage from '@/pages/public/AboutPage';
import ServicesPage from '@/pages/public/ServicesPage';
import ProjectsPage from '@/pages/public/ProjectsPage';
import ContactPage from '@/pages/public/ContactPage';
import DisplayCenterPage from '@/pages/public/DisplayCenterPage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminRfqsPage from '@/pages/admin/AdminRfqsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/products/:slug" element={<ProductDetailsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/request-quote" element={<RfqPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/display-center" element={<DisplayCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Portal Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="rfqs" element={<AdminRfqsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

