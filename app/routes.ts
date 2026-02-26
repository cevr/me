import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog/blog.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),
  route("blog/rss.xml", "routes/blog/rss[.]xml.tsx"),
] satisfies RouteConfig;
