import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layouts/dashboard.tsx", [index("routes/todos.tsx")]),
  layout("layouts/auth.tsx", [
    route("signup", "routes/signup.tsx"),
    route("signin", "routes/signin.tsx"),
  ]),
  route("resources/signout", "resources/signout.tsx"),
  route("resources/theme", "resources/theme.tsx"),
] satisfies RouteConfig;
