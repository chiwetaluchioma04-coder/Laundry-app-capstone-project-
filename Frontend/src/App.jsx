import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import WhatsAppButton from './components/WhatsAppButton'
import './styles.css'
import './brand-theme.css'

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <WhatsAppButton />
    </AuthProvider>
  )
}
