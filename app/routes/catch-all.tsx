import { data } from "react-router";

// A page route, not a resource route: the thrown 404 renders the root
// ErrorBoundary's not-found page instead of a JSON body.
export function loader() {
  throw data(null, { status: 404 });
}

export default function CatchAll() {
  return null;
}
