import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSeller from './pages/RegisterSeller'
import ListingDetail from './pages/ListingDetail'
import Account from './pages/Account'
import SellerDashboard from './pages/SellerDashboard'
import SellerCreateListing from './pages/SellerCreateListing'
import SellerListings from './pages/SellerListings'
import InspectorDashboard from './pages/InspectorDashboard'
import InspectorForm from './pages/InspectorForm'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register-seller" element={<RegisterSeller />} />
        <Route path="listing/:id" element={<ListingDetail />} />
        <Route path="account" element={<Account />} />
        <Route path="profile" element={<Profile />} />
        <Route path="seller" element={<SellerDashboard />} />
        <Route path="seller/create" element={<SellerCreateListing />} />
        <Route path="seller/listings" element={<SellerListings />} />
        <Route path="inspector" element={<InspectorDashboard />} />
        <Route path="inspector/inspect/:id" element={<InspectorForm />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminDashboard />} />
        <Route path="admin/listings" element={<AdminDashboard />} />
        <Route path="admin/reports" element={<AdminDashboard />} />
        <Route path="admin/categories" element={<AdminDashboard />} />
        <Route path="admin/transactions" element={<AdminDashboard />} />
        <Route path="admin/stats" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
