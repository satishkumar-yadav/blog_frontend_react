import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(

   <BrowserRouter>
      <App />
      </BrowserRouter>

  // <StrictMode>     // 
  //   <BrowserRouter>
  //     <App />
  //     </BrowserRouter>
  // </StrictMode>,

  /*
  Strict Mode in React 18+
- React 18 (and sometimes React 17+) in development mode wraps components in StrictMode, which intentionally 
double-invokes certain lifecycle functions (including useEffect) to help you catch side effects.
- This means your useEffect code runs twice on mount in development mode, causing the snackbar and navigation to fire 
twice.

Solution:
- This only happens in development. In production, it will run only once.
- To prevent unwanted effects (like navigation and snackbars firing twice), include some kind of "did run" flag or check, 
or handle navigation/messages differently.

*/

)
