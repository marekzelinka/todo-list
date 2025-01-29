import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/todos.tsx"),
  route("api/theme", "api/theme.ts"),
] satisfies RouteConfig;
