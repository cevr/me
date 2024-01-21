import { RemixBrowser } from "@remix-run/react";
import { startTransition } from "react";
import ReactDOM from "react-dom/client";

startTransition(() => {
  ReactDOM.hydrateRoot(document, <RemixBrowser />);
});
