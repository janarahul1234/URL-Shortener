import { RouterProvider } from "react-router-dom";
import router from "./routes";

const App = () => {
  return (
    <main className="overflow-hidden">
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
