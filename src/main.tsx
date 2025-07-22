import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSecurityHeaders, preventClickjacking, setupSecurityEventListeners } from './utils/securityHeaders'

// Initialize security features
initSecurityHeaders();
preventClickjacking();
setupSecurityEventListeners();

createRoot(document.getElementById("root")!).render(<App />);
