import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Page } from "src/components";

export function About() {
  return (
    <Page>
      <Helmet>
        <title>About | TSE Todos</title>
      </Helmet>
      <p>This is a simple example app that demonstrates TSE&apos;s software development process.</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </Page>
  );
}
