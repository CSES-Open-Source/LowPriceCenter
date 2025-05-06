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
import { ProfilePage } from "../src/pages/ProfilePage";
import { EditProfile } from "../src/pages/EditProfile";
import FirebaseProvider from "../src/utils/FirebaseProvider";

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
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/user-profile/:id",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit-profile",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
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
