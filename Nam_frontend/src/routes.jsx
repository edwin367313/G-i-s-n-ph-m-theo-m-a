// Routes are defined in App.jsx
// This file is for route configuration if needed separately

import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/ProductsPage';
import AdminOrders from './pages/admin/OrdersPage';
import AdminRevenue from './pages/admin/RevenuePage';
import AdminThemes from './pages/admin/ThemesPage';
import ProductPredictionPage from './pages/admin/ProductPredictionPage';
import SeasonalReportPage from './pages/admin/SeasonalReportPage';
import QuarterlyReportPage from './pages/admin/QuarterlyReportPage';
import NotFoundPage from './pages/NotFoundPage';

export const publicRoutes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductsPage },
  { path: '/products/:id', component: ProductDetailPage }
];

export const authRoutes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage }
];

export const userRoutes = [
  { path: '/cart', component: CartPage },
  { path: '/checkout', component: CheckoutPage },
  { path: '/order-success', component: OrderSuccessPage },
  { path: '/profile', component: ProfilePage }
];

export const adminRoutes = [
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/products', component: AdminProducts },
  { path: '/admin/orders', component: AdminOrders },
  { path: '/admin/revenue', component: AdminRevenue },
  { path: '/admin/themes', component: AdminThemes },
  { path: '/admin/ml/prediction', component: ProductPredictionPage },
  { path: '/admin/ml/seasonal-report', component: SeasonalReportPage },
  { path: '/admin/ml/quarterly-report', component: QuarterlyReportPage }
];

export const notFoundRoute = { path: '*', component: NotFoundPage };
