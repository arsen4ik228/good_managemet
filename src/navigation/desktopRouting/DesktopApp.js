import React from "react";
import { Routes, Route } from "react-router-dom";
import "./DesktopApp.css";
import HandlerMutation from "@Custom/HandlerMutation";
import ErrorPage from "@app/ErrorPage/ErrorPage";

const Main = React.lazy(() => import("@app/Authorization/Main"));
const NotFound = React.lazy(() => import("@app/NotFound/NotFound"));

// Добавил
const Panel = React.lazy(() => import("@app/Panel/Panel"));
const Chat = React.lazy(() => import("@app/Chat/Chat"));

const Pomoshnik = React.lazy(() => import("@app/Pomoshnik/Pomoshnik"));
const ControlPanel = React.lazy(() => import("@app/ControlPanel/ControlPanel"));
const User = React.lazy(() => import("@app/UserPage/User"));
const Goal = React.lazy(() => import("@app/GoalPage/Goal"));
const Policy = React.lazy(() => import("@app/PolicyPage/Policy"));
const Statistic = React.lazy(() => import("@app/StatisticsPage/Statistic"));
const Objective = React.lazy(() => import("@app/ObjectivePage/Objective"));
const Strategy = React.lazy(() => import("@app/StrategyPage/Strategy"));
const StartProject = React.lazy(() =>
  import("@app/ProjectPage/Start/Update/StartContent")
);
const ProjectWithProgramm = React.lazy(() =>
  import("@app/Project/Main")
);
const Post = React.lazy(() => import("@app/PostPage/Post"));
const PostNew = React.lazy(() => import("@app/PostPage/PostNew"));
const WorkingPlan = React.lazy(() =>
  import("@app/WorkingPlanPage/MainWorkingPlan")
);
const PostSchema = React.lazy(() =>
  import("@app/CompanySchema/desktop/CompanySchema")
);
const SchemeСompanies = React.lazy(() =>
  import("@app/CompanySchema/desktop/schemeСompanies/SchemeСompanies")
);
const DesktopConvertsPage = React.lazy(() =>
  import("@app/ConvertsPage/desktop/DesktopConvertPage.jsx")
);
const DesktopDoalogPage = React.lazy(() =>
  import("@app/DialogPage/desktop/DesktopDoalogPage.jsx")
);
const DialogPage = React.lazy(() =>
  import("@app/DialogPage/DialogPage.jsx")
);
const CardProject = React.lazy(() =>
  import("@app/CardProject/CardProject.jsx")
);
const SettingsPage = React.lazy(() =>
  import("@app/SettingsPage/desktop/SettingsPage.jsx")
);
const WatcherDialogPage = React.lazy(() =>
  import("@app/DialogPage/WatcherDialogPage/WatcherDialogPage.jsx")
)
const ArchiveDialog = React.lazy(() => 
import("@app/DialogPage/ArchiveDialog/ArchiveDialog.jsx")
)
const AgreementDialogPage = React.lazy(() => 
import("@app/DialogPage/AgreementDialogPage/AgreementDialogPage.jsx")
)

function DesktopApp() {
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
          path="/*"
          element={
            <React.Suspense
              fallback={
                <div className="lazy">
                  <HandlerMutation Loading={true}></HandlerMutation>
                </div>
              }
            >
              <Routes>

                <Route
                  path="account"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <SettingsPage />
                      </div>
                    </div>
                  }
                />

                {/* Маршрут для чата */}
                <Route
                  path="chat/:contactId"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <DesktopConvertsPage />
                      </div>
                    </div>
                  }
                />

                <Route
                  path="chat/:contactId/:convertId"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <DialogPage />
                      </div>
                    </div>
                  }
                />

                <Route
                  path="chat/:contactId/watcher/:convertId"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <WatcherDialogPage />
                      </div>
                    </div>
                  }
                />

                <Route
                  path="chat/:contactId/archive/:convertId"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <ArchiveDialog />
                      </div>
                    </div>
                  }
                />

                <Route
                  path="Chat/:contactId/agreement/:convertId"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <AgreementDialogPage />
                      </div>
                    </div>
                  }
                />

                {/* Маршрут для пользователя */}
                <Route
                  path="user"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <User />
                      </div>
                    </div>
                  }
                />

                {/* Маршрут для ControlPanel */}
                <Route
                  path="controlPanel"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <ControlPanel />
                      </div>
                    </div>
                  }
                />

                {/* Маршрут для Pomoshnik и его вложенных маршрутов */}
                <Route
                  path="pomoshnik/*"
                  element={
                    <div className="messages">
                      <Panel />
                      <div className="content">
                        <Chat />
                        <Routes>
                          <Route path="card" element={<CardProject />} />

                          <Route path="start" element={<Pomoshnik />} />
                          <Route path="goal" element={<Goal />} />
                          <Route path="policy/:policyId?" element={<Policy />} />
                          <Route path="statistic" element={<Statistic />} />
                          <Route path="objective" element={<Objective />} />
                          <Route path="strategy" element={<Strategy />} />
                          <Route
                            path="startProject"
                            element={<StartProject />}
                          />
                          <Route path="projectWithProgramm" element={<ProjectWithProgramm />} />

                          <Route path="post/:postId?" element={<Post />} />
                          <Route path="postNew" element={<PostNew />} />
                          <Route path="workingPlan" element={<WorkingPlan />} />
                          <Route
                            path="companySchema"
                            element={<SchemeСompanies />}
                          />
                          <Route
                            path="postSchema/:organizationId"
                            element={<PostSchema />}
                          />
                          {/* Маршрут для NotFound внутри Pomoshnik */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </div>
                  }
                />

                {/* Маршрут для NotFound на верхнем уровне */}
                <Route path="*" element={<NotFound />} />
              </Routes>
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

export default DesktopApp;
