import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
 
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
 
import Login from './auth/Login';
import Register from './auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/common/Unauthorized';
import UserProfile from './pages/user/UserProfile';
// import NotFound from './pages/common/NotFound';
 
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
 
          {/* User-only routes */}
          <Route
            element={
              <ProtectedRoute role="CUSTOMER">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* Other user pages go here */}
          </Route>
 
          {/* Admin-only routes */}
          <Route
            element={
              <ProtectedRoute role="ADMIN">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Other admin pages go here */}
          </Route>

          {/* <Route path="/user/profile"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <Layout/>
                </ProtectedRoute>
              }
            >
                <Route index element={<UserProfile/>}></Route>
            </Route> */}
 
          {/* Catch-all 404 */}
          {/* <Route element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
 
export default App;


// import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Login from './auth/Login';
// import Register from './auth/Register';
// import ProtectedRoute from './components/ProtectedRoute';
// import UserDashboard from './pages/user/UserDashboard';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import Unauthorized from './pages/common/Unauthorized';
// import Navbar from './components/Navbar'; 

// function Layout(){
//   return <div className="min-h-screen flex flex-col">
//       <Navbar/>
//       <main className="flex-grow">
//         <Outlet/>
//       </main>
//   </div>
// }
 
// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
          
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />
    
//           <Route
//             path="/user/dashboard"
//             element={
//               <ProtectedRoute role="USER">
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute role="ADMIN">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>

//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
 
// export default App;
















// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
