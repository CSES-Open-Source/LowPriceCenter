import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "src/pages";
import { Marketplace } from "src/pages/Marketplace";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import FirebaseProvider from "../src/utils/FirebaseProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
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

