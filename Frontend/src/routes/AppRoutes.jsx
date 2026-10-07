import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DeliveryNotificationBanner from '../components/common/DeliveryNotificationBanner'
import LandingPage from '../pages/public/LandingPage'
import AboutPage from '../pages/public/AboutPage'
import LoginPage from '../pages/public/LoginPage'
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage'
import CreateAccountPage from '../pages/public/CreateAccountPage'
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage'
import CreateOrderPage from '../pages/customer/CreateOrderPage'
import MyOrdersPage from '../pages/customer/MyOrdersPage'
import OrderDetailPage from '../pages/customer/OrderDetailPage'
import ProfilePage from '../pages/customer/ProfilePage'
import VendorPricingPage from '../pages/vendor/VendorPricingPage'
import VendorWalletPage from '../pages/vendor/VendorWalletPage'
import VendorOrdersPage from '../pages/vendor/VendorOrdersPage'
import AdminDashboard from '../pages/admin/AdminDashboard'

function Layout() {
	const { user } = useAuth()
	const location = useLocation()
	const isAuthPage = ['/login', '/admin/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)

	return <>
		{!isAuthPage && <Navbar />}
		{!isAuthPage && user?.role === 'customer' && <DeliveryNotificationBanner />}
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/about" element={<AboutPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/admin/login" element={<LoginPage adminOnly />} />
			<Route path="/forgot-password" element={<ForgotPasswordPage />} />
			<Route path="/reset-password" element={<ForgotPasswordPage />} />
			<Route path="/register" element={<CreateAccountPage />} />
			<Route element={<ProtectedRoute role="customer" />}>
				<Route path="/dashboard" element={<CustomerDashboardPage />} />
				<Route path="/schedule" element={<CreateOrderPage />} />
				<Route path="/orders" element={<MyOrdersPage />} />
				<Route path="/orders/:id" element={<OrderDetailPage />} />
				<Route path="/profile" element={<ProfilePage />} />
			</Route>
			<Route element={<ProtectedRoute role="vendor" />}>
				<Route path="/vendor/pricing" element={<VendorPricingPage />} />
				<Route path="/vendor/orders" element={<VendorOrdersPage />} />
				<Route path="/vendor/wallet" element={<VendorWalletPage />} />
			</Route>
			<Route element={<ProtectedRoute role="admin" />}>
				<Route path="/admin" element={<AdminDashboard />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
		{!isAuthPage && <Footer />}
	</>
}

export default function AppRoutes() { return <BrowserRouter><Layout /></BrowserRouter> }
