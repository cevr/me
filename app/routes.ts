import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog/blog.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
] satisfies RouteConfig;
