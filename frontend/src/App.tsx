import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { Home } from "src/pages";
import { Marketplace } from "src/pages/Marketplace";
import { AddProduct } from "./pages/AddProduct";

import { Navbar } from "src/components/Navbar";
import { Footer } from "src/components/Footer";

import FirebaseProvider from "../src/utils/FirebaseProvider";
import { IndividualProductPage } from "./pages/Individual-product-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/marketplace",
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
    path: "/individual-product-page",
    element: <IndividualProductPage />,
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
