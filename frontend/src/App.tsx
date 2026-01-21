import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Footer } from "src/components/Footer";
import { Navbar } from "src/components/Navbar";
import { Home } from "src/pages";
import { Marketplace } from "src/pages/Marketplace";

import { PrivateRoute } from "../src/components/PrivateRoute";
import { AddProduct } from "../src/pages/AddProduct";
import { EditProduct } from "../src/pages/EditProduct";
import { IndividualProductPage } from "../src/pages/Individual-product-page";
import { PageNotFound } from "../src/pages/PageNotFound";
import FirebaseProvider from "../src/utils/FirebaseProvider";
import { SavedProducts } from "./pages/SavedProducts";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: (
      <PrivateRoute>
        <Marketplace />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
  )
  },
  {
    path: "/add-product",
    element: (
      <PrivateRoute>
        <AddProduct />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit-product/:id",
    element: (
      <PrivateRoute>
        <EditProduct />
      </PrivateRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <PrivateRoute>
        <IndividualProductPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/saved-products",
    element: (
      <PrivateRoute>
        <SavedProducts />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <FirebaseProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <RouterProvider router={router} />
          </div>
          <Footer />
        </div>
      </FirebaseProvider>
    </HelmetProvider>
  );
}

//using a layout with navbar and footer:

// import { Outlet } from "react-router-dom";

// // 1. Create a Layout component inside App.tsx
// function Layout() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="flex-grow">
//         <Outlet /> {/* Child routes (Profile, Marketplace, etc.) render here */}
//         </div>
//         <Footer />
//       </div>
//     );
//   }
  
//   const router = createBrowserRouter([
//     {
//     element: <Layout />, // Use the layout for all routes
//     children: [
//         {
//           path: "/products",
//           element: (
//             <PrivateRoute>
//               <Marketplace />
//             </PrivateRoute>
//           ),
//         },
//         {
//           path: "/profile",
//           element: (
//             <PrivateRoute>
//               <Profile />
//             </PrivateRoute>
//           )
//         },
//         {
//           path: "/add-product",
//           element: (
//             <PrivateRoute>
//               <AddProduct />
//             </PrivateRoute>
//           ),
//         },
//         {
//           path: "/edit-product/:id",
//           element: (
//             <PrivateRoute>
//               <EditProduct />
//             </PrivateRoute>
//           ),
//         },
//         {
//           path: "/products/:id",
//           element: (
//             <PrivateRoute>
//               <IndividualProductPage />
//             </PrivateRoute>
//           ),
//         },
//         {
//           path: "/saved-products",
//           element: (
//             <PrivateRoute>
//               <SavedProducts />
//             </PrivateRoute>
//           ),
//         },
//         {
//           path: "*",
//           element: <PageNotFound />,
//         }
//       ]
//     }
//   ]);
  
//   export default function App() {
//     return (
//       <HelmetProvider>
//         <FirebaseProvider>
//           <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <div className="flex-grow">
//               <RouterProvider router={router} />
//             </div>
//             <Footer />
//           </div>
//         </FirebaseProvider>
//       </HelmetProvider>
//     );
//   }  


