import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HandlerMutation from "@Custom/HandlerMutation";
import { isMobile } from "react-device-detect";

const Main = React.lazy(() => import("@app/Authorization/Main"));
const Content = React.lazy(() => import("@app/Constructions/content/Content"));
const NotFound = React.lazy(() => import("@app/NotFound/NotFound"));

function App() {
  console.log('mobile                                                        ', isMobile)

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrapper">
              <React.Suspense fallback={<HandlerMutation Loading={true}></HandlerMutation>}>
                <Main />
              </React.Suspense>
            </div>
          }
        />
        <Route
          path="/:group/:route"
          element={
            <div className="messages">
              <React.Suspense fallback={<HandlerMutation Loading={true}></HandlerMutation>}>
                <Content />
              </React.Suspense>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <React.Suspense fallback={<HandlerMutation Loading={true}></HandlerMutation>}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
