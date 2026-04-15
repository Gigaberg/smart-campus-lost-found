import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateItemPage from './pages/CreateItemPage';
import EditItemPage from './pages/EditItemPage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        {/* header wraps the site-wide navigation — semantic HTML */}
        <header>
          <Navbar />
        </header>
        {/* main landmark contains all page content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/new" element={<ProtectedRoute><CreateItemPage /></ProtectedRoute>} />
            <Route path="/items/:id/edit" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>
        {/* footer landmark — semantic HTML */}
        <Footer />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
