import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layouts/dashboard.tsx", [index("routes/todos.tsx")]),
  route("resources/theme", "resources/theme.tsx"),
] satisfies RouteConfig;
