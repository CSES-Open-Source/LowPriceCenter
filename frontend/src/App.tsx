import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Footer } from "src/components/Footer";
import { Navbar } from "src/components/Navbar";
import { PrivateRoute } from "src/components/PrivateRoute";
import { Messages } from "src/components/messages/Messages";
import { Home } from "src/pages";
import { AddProduct } from "src/pages/AddProduct";
import { EditProduct } from "src/pages/EditProduct";
import { IndividualProductPage } from "src/pages/Individual-product-page";
import { Marketplace } from "src/pages/Marketplace";
import { PageNotFound } from "src/pages/PageNotFound";
import { SavedProducts } from "src/pages/SavedProducts";
import ChatProvider from "src/utils/ChatProvider";
import FirebaseProvider from "src/utils/FirebaseProvider";

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
    path: "/saved-products",
    element: (
      <PrivateRoute>
        <SavedProducts />
      </PrivateRoute>
    ),
  },
  {
    path: "/messages",
    element: (
      <PrivateRoute>
        <Messages />
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
        <ChatProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <RouterProvider router={router} />
            </div>
            <Footer />
          </div>
        </ChatProvider>
      </FirebaseProvider>
    </HelmetProvider>
  );
}
