import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Import the Provider we just created in the context folder
import { EngineProvider } from "./context/EngineContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrapping the App here allows any component in the tree 
        to use the useEngine() hook without prop drilling */}
    <EngineProvider>
      <App />
    </EngineProvider>
  </React.StrictMode>,
);
