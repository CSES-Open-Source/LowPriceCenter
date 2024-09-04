import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Page, TaskForm } from "src/components";

export function Home() {
  return (
    <Page>
      <Helmet>
        <title>Home | TSE Todos</title>
      </Helmet>
      <p>
        {/* `<Link>` renders an `<a>` element with a correct `href` attribute
        but uses the react-router library's client-side routing so the new page
        loads faster (see https://reactrouter.com/en/main/components/link) */}
        <Link to="/about">About this app</Link>
      </p>
      <TaskForm mode="create" />
    </Page>
  );
}
