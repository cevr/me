import {

  index,
  prefix,
  route
} from "@react-router/dev/routes";
import type {RouteConfig} from "@react-router/dev/routes";

export default [
  //
  index("routes/home.tsx"),
  ...prefix("/hymns", [
    route("/", "routes/hymns/hymns.tsx"),
    route("/:hymnId", "routes/hymns/hymn.tsx"),
  ]),
] satisfies RouteConfig;
