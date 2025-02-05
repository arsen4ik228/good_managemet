import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HandlerMutation from "@Custom/HandlerMutation";
import ErrorPage from "./UI/app/ErrorPage/ErrorPage";

const Main = React.lazy(() => import("@app/Authorization/Main"));
const Content = React.lazy(() => import("@app/Constructions/content/Content"));
const NotFound = React.lazy(() => import("@app/NotFound/NotFound"));

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrapper">
              <React.Suspense
                fallback={<HandlerMutation Loading={true}></HandlerMutation>}
              >
                <Main />
              </React.Suspense>
            </div>
          }
        />
        <Route
          path="/:group/:route"
          element={
            <React.Suspense
              fallback={
                <div className="lazy">
                  <HandlerMutation Loading={true}></HandlerMutation>
                </div>
              }
            >
              <div className="messages">
                <Content />
              </div>
            </React.Suspense>
          }
        />
        <Route
          path="*"
          element={
            <React.Suspense
              fallback={<HandlerMutation Loading={true}></HandlerMutation>}
            >
              <NotFound />
            </React.Suspense>
          }
        />
        <Route
          path="/error"
          element={
            <React.Suspense
              fallback={<HandlerMutation Loading={true}></HandlerMutation>}
            >
              <ErrorPage />
            </React.Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
