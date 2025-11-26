import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./DesktopApp.css";
import HandlerMutation from "@Custom/HandlerMutation";
import ErrorPage from "@app/ErrorPage/ErrorPage";

import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import ApplicationContainer from "../../UI/layout/ApplicationContainer/ApplicationContainer";
import HelperChat from "../../UI/layout/HelperChat/HelperChat";
import Goal from "../../UI/layout/Goal/Goal";
// import User from "../../UI/layout/CreateUser/CreateUser";
import SettingsPage from "../../UI/layout/AccountSettingsPage/SettingsPage";
import EditGoal from "../../UI/layout/Goal/EditGoal";
import Statistic from "../../UI/layout/Statistics/Statistic";
import Post from "../../UI/layout/Posts/Post";
import EditPost from "../../UI/layout/Posts/EditPost";
import Policy from "../../UI/layout/Policies/Policy";
import EditPolicy from "../../UI/layout/Policies/EditPolicy";
import { EditStatisticInformation } from "../../UI/layout/Statistics/EditStatisticInformation";
import MessageSelectingList from "../../UI/Custom/MessageSelectingList/MessageSelectingList";
import { EditStatisticPointsData } from "../../UI/layout/Statistics/EditStatisticPointsData";
import DesktopDialogPage from "../../UI/layout/Chat/desktop/DesktopDoalogPage";
import ArchiveDialogPage from "../../UI/layout/Chat/ArchiveDialog/ArchiveDialog";
import CreateNewConvertPage from "../../UI/layout/Chat/CreateNewConvertPage/CreateNewConvertPage";

import { Strategy } from "../../UI/layout/Strategy/Strategy";
import { SchemaCompany } from "../../UI/layout/SchemaCompany/SchemaCompany";
import { Project } from "../../UI/layout/Project/Project";
// import { WorkingPlan } from "../../UI/layout/WorkingPlan/WorkingPlan";
import { FuturePages } from "../../UI/layout/FuturePages/FuturePages";
import Worker from "../../UI/layout/Workers/Worker";
import EditWorker from "../../UI/layout/Workers/EditWorker";
import MainWorkingPlan from "../../UI/app/WorkingPlanPage/MainWorkingPlan"
import WorkingPlanPage from "../../UI/layout/WorkingPlan/WorkingPlanPage";
const AuthPage = React.lazy(() => import("@app/Authorization/AuthPage"));
const NotFound = React.lazy(() => import("@app/NotFound/NotFound"));

// Добавил
const Panel = React.lazy(() => import("@app/Panel/Panel"));
const Chat = React.lazy(() => import("@app/Chat/Chat"));

const Pomoshnik = React.lazy(() => import("@app/Pomoshnik/Pomoshnik"));
const ControlPanel = React.lazy(() => import("@app/ControlPanel/ControlPanel"));
const User = React.lazy(() => import("@app/UserPage/User"));
// const Goal = React.lazy(() => import("@app/GoalPage/Goal"));
// const Policy = React.lazy(() => import("@app/PolicyPage/Policy"));
const Statistic1 = React.lazy(() => import("@app/StatisticsPage/Statistic"));
const Svodka = React.lazy(() => import("@app/Svodka/Svodka"));
const Objective = React.lazy(() => import("@app/ObjectivePage/Objective"));
// const Strategy = React.lazy(() => import("@app/StrategyPage/Strategy"));
const ProjectWithProgramm = React.lazy(() =>
  import("@app/Project/desktop/Main")
);
// const Post = React.lazy(() => import("@app/PostPage/Post"));
const PostNew = React.lazy(() => import("@app/PostPage/PostNew"));
// const WorkingPlan = React.lazy(() =>
//   import("@app/WorkingPlanPage/MainWorkingPlan")
// );
const PostSchema = React.lazy(() =>
  import("@app/CompanySchema/desktop/CompanySchema")
);
const SchemeСompanies = React.lazy(() =>
  import("@app/CompanySchema/desktop/schemeСompanies/SchemeСompanies")
);
const DesktopConvertsPage = React.lazy(() =>
  import("@app/ConvertsPage/desktop/DesktopConvertPage.jsx")
);

// const DialogPage = React.lazy(() => import("@app/DialogPage/DialogPage.jsx"));

// const SettingsPage = React.lazy(() =>
//   import("@app/SettingsPage/desktop/SettingsPage.jsx")
// );
const WatcherDialogPage = React.lazy(() =>
  import("@app/DialogPage/WatcherDialogPage/WatcherDialogPage.jsx")
);
// const ArchiveDialog = React.lazy(() =>
//   import("@app/DialogPage/ArchiveDialog/ArchiveDialog.jsx")
// );
const AgreementDialogPage = React.lazy(() =>
  import("@app/DialogPage/AgreementDialogPage/AgreementDialogPage.jsx")
);

function DesktopApp() {
  return (
    <div>
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorPrimary: "#005475",
            colorSuccess: "#52c41a",
            colorError: "#ff4d4f",
            colorWarning: "#faad14",
            colorInfo: "#1890ff",
            colorPrimaryHover: "#003d5c",
            colorPrimaryActive: "#002536",
            colorSuccessHover: "#389e0d",
            colorErrorHover: "#d9363e",
            colorWarningHover: "#d48806",
          },
          components: {
            Menu: {
              itemHoverBg: "#DDEBF1",
              itemActiveBg: "#DDEBF1",
              itemSelectedBg: "#DDEBF1",
            },
          },
        }}
      >
        <Routes>
          <Route
            path="/projectWithProgramm"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <ProjectWithProgramm />
              </React.Suspense>
            }
          />

          {/* ==== Главная (логин) ==== */}
          <Route
            path="/"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <AuthPage />
              </React.Suspense>
            }
          />

          {/* ==== Error ==== */}
          <Route
            path="/error"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <ErrorPage />
              </React.Suspense>
            }
          />

          {/* ==== Edit pages ==== */}
          <Route
            path="editGoal"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditGoal />
              </React.Suspense>
            }
          />
          <Route
            path="editPolicy/:policyId"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditPolicy />
              </React.Suspense>
            }
          />
          <Route
            path="editStatisticInformation/:id"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditStatisticInformation />
              </React.Suspense>
            }
          />
          <Route
            path="editStatisticPointsData/:id"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditStatisticPointsData />
              </React.Suspense>
            }
          />
          <Route
            path="editPost/:postId"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditPost />
              </React.Suspense>
            }
          />
          <Route
            path="editUsers/:userId"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <EditWorker />
              </React.Suspense>
            }
          />

          {/* ==== Панель управления / Сводка ==== */}
          <Route
            path="controlPanel"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <div className="tab">
                  <ControlPanel />
                </div>
              </React.Suspense>
            }
          />
          <Route
            path="svodka"
            element={
              <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                <div className="tab">
                  <Svodka />
                </div>
              </React.Suspense>
            }
          />

          {/* ==== Основная ветка организации ==== */}
          <Route
            path=":organizationId/*"
            element={<ApplicationContainer />} // ВАЖНО: в ApplicationContainer должен быть <Outlet />
          >
            {/* При заходе только на /:organizationId перенаправляем в helper */}
            <Route index element={<Navigate to="accountSettings" replace />} />

            {/* Создание пользователя */}
            <Route
              path="createUser"
              element={
                <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                  <User />
                </React.Suspense>
              }
            />

            {/* Настройки */}
            <Route
              path="accountSettings"
              element={
                <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                  <SettingsPage />
                </React.Suspense>
              }
            />

            {/* ==== Диалоги ==== */}
            <Route path="chat/:contactId/*">
              <Route
                index
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <CreateNewConvertPage />
                  </React.Suspense>
                }
              />
              <Route
                path=":convertId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <DesktopDialogPage />
                  </React.Suspense>
                }
              />
              <Route
                path="archive/:convertId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <ArchiveDialogPage />
                  </React.Suspense>
                }
              />
            </Route>

            {/* ==== Helper ==== */}
            <Route path="helper/*">
              {/* <Route
                index
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <HelperChat />
                  </React.Suspense>
                }
              /> */}
              <Route
                path="strategy"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Strategy />
                  </React.Suspense>
                }
              />
              <Route
                path="project"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Project />
                  </React.Suspense>
                }
              />
              <Route
                path="schemaCompany"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <SchemaCompany />
                  </React.Suspense>
                }
              />
              <Route
                path="workingPlan"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              />
              <Route
                path="workingPlan/currentTasks"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              />
              <Route  
                path="workingPlan/currentOrders"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              />
              <Route  
                path="workingPlan/myOrder"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              />
              <Route
                path="workingPlan/allTasks"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              /> 
              <Route
                path="workingPlan/archiveTasks"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <WorkingPlanPage />
                  </React.Suspense>
                }
              />
              <Route
                path="goal"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Goal />
                  </React.Suspense>
                }
              />
              <Route
                path="policy"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <MessageSelectingList presetName="POLICIES" />
                  </React.Suspense>
                }
              />
              <Route
                path="policy/:policyId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Policy />
                  </React.Suspense>
                }
              />
              <Route
                path="users"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <MessageSelectingList presetName="USERS" />
                  </React.Suspense>
                }
              />
              <Route
                path="users/:userId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Worker />
                  </React.Suspense>
                }
              />
              <Route
                path="controlPanel"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <>controlPanel</>
                  </React.Suspense>
                }
              />
              <Route
                path="statistics"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <MessageSelectingList presetName="STATISTICS" />
                  </React.Suspense>
                }
              />
              <Route
                path="statistics/:statisticId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Statistic />
                  </React.Suspense>
                }
              />
              <Route
                path="posts"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <MessageSelectingList presetName="POSTS" />
                  </React.Suspense>
                }
              />
              <Route
                path="posts/:postId"
                element={
                  <React.Suspense fallback={<HandlerMutation Loading={true} />}>
                    <Post />
                  </React.Suspense>
                }
              />
            </Route>
          </Route>

          {/* ==== Фолбэк ==== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
}

export default DesktopApp;
