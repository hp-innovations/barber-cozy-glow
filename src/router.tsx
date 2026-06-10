import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Serve the app under a subpath (e.g. http://your-ip/barbershop).
    // Set VITE_BASE_PATH=/barbershop at build time on your server.
    // Defaults to "/" so the in-sandbox preview is unaffected.
    basepath: import.meta.env.VITE_BASE_PATH || "/",
  });

  return router;
};
