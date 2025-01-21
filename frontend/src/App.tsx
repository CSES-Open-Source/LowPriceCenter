import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "src/pages";
import { Marketplace } from "src/pages/Marketplace";
import { Navbar } from "./components/Navbar";

import FirebaseProvider from "../src/utils/FirebaseProvider";
import { IndividualProductPage } from "./pages/Individual-product-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
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
        <Navbar />
        <RouterProvider router={router} />
      </FirebaseProvider>
    </HelmetProvider>
  );
}
