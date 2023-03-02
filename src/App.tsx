import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./route";

function App() {
  return (
    <Suspense fallback={<div className="loader">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
