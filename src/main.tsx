import { NextUIProvider } from "@nextui-org/react";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout";
import { locales } from "./locale";
import {
  APP_MIDDLEWARE,
  LOGIN_PAGE_MIDDLEWARE,
} from "./middlewares/auth.middleware";
import LoginPage from "./pages/login";
import MainPage from "./pages/main/main";
import { RoutePath } from "./routes";

i18n.use(initReactI18next).init({
  resources: locales,
  lng: locales.tr.lang,
  fallbackLng: locales.sv.lang,

  interpolation: {
    escapeValue: false,
  },
});

export function lazyLoadRoutes(component: string) {
  const LazyElement = lazy(() => import(component));

  // Wrapping around the suspense component is mandatory
  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: RoutePath.Root,
    element: <AppLayout />,
    children: [
      {
        path: RoutePath.Root,
        element: <MainPage />,
        loader: APP_MIDDLEWARE,
        children: [
          {
            path: RoutePath.SlutProv,
            element: lazyLoadRoutes("./pages/slutprov/SlutProv"),
          },
        ],
      },
      {
        path: RoutePath.Login,
        element: <LoginPage />,
        loader: LOGIN_PAGE_MIDDLEWARE,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>,
);
