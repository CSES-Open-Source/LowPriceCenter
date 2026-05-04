import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import { RootLayout } from "src/components/RootLayout";
import { Messages } from "src/components/messages/Messages";
import { Home } from "src/pages";
import { AddProduct } from "src/pages/AddProduct";
import { EditProduct } from "src/pages/EditProduct";
import { IndividualProductPage } from "src/pages/Individual-product-page";
import { Marketplace } from "src/pages/Marketplace";
import { MyListings } from "src/pages/MyListings";
import { PageNotFound } from "src/pages/PageNotFound";
import { Profile } from "src/pages/Profile";
import { SavedProducts } from "src/pages/SavedProducts";
import { StudentOrgProfile } from "src/pages/StudentOrgProfile";
import { StudentOrganizations } from "src/pages/StudentOrganizations";
import { StudentOrganizationPublicProfile } from "src/pages/StudentOrganizationPublicProfile";
import ChatProvider from "src/utils/ChatProvider";
import FirebaseProvider from "src/utils/FirebaseProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
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
        path: "/my-listings",
        element: (
          <PrivateRoute>
            <MyListings />
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
        path: "/student-org-profile",
        element: (
          <PrivateRoute>
            <StudentOrgProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/student-organizations",
        element: (
          <PrivateRoute>
            <StudentOrganizations />
          </PrivateRoute>
        ),
      },
      {
        path: "/student-organizations/:id",
        element: (
          <PrivateRoute>
            <StudentOrganizationPublicProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <FirebaseProvider>
        <ChatProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <RouterProvider router={router} />
            </div>
          </div>
        </ChatProvider>
      </FirebaseProvider>
    </HelmetProvider>
  );
}
