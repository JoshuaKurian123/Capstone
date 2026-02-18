import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes/AppRoutes";
import ErrorBoundary from "./app/shared/ErrorBoundary";
import "./App.css";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
