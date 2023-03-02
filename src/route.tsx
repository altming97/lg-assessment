import { lazy } from "react";
import { RouteObject, createBrowserRouter } from "react-router-dom";

const BookList = lazy(() => import("src/page/BookList"));
const BookDetail = lazy(() => import("src/page/BookDetail"));

const routes: RouteObject[] = [
  { path: "/", element: <BookList /> },
  { path: "detail", element: <BookDetail /> },
];

export default createBrowserRouter(routes);
