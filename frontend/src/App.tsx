import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "src/pages";
import { Marketplace } from "src/pages/Marketplace";
import { Navbar } from "./components/Navbar";

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
        <Navbar />
        <RouterProvider router={router} />
      </FirebaseProvider>
    </HelmetProvider>
  );
}
