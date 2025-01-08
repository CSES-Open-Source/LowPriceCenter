import { Helmet } from "react-helmet-async";
import { Navbar } from "src/components";

export function Marketplace() {
  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <Navbar />
      <main>Welcome to the marketplace</main>
    </>
  );
}
