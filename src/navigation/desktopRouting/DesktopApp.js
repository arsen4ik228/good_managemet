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
import CreateNewConvertPage from "../../UI/layout/Chat/CreateNewConvertPage/CreateNewConvertPage";

import { Strategy } from "../../UI/layout/Strategy/Strategy";
import { SchemaCompany } from "../../UI/layout/SchemaCompany/SchemaCompany";
import { Project } from "../../UI/layout/Project/Project";
import { WorkingPlan } from "../../UI/layout/WorkingPlan/WorkingPlan";

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
const ArchiveDialog = React.lazy(() =>
  import("@app/DialogPage/ArchiveDialog/ArchiveDialog.jsx")
);
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
            // Основные цвета
            colorPrimary: "#005475",
            colorSuccess: "#52c41a",
            colorError: "#ff4d4f",
            colorWarning: "#faad14",
            colorInfo: "#1890ff",

            // Hover-эффекты
            colorPrimaryHover: "#003d5c",
            colorPrimaryActive: "#002536",
            colorSuccessHover: "#389e0d",
            colorErrorHover: "#d9363e",
            colorWarningHover: "#d48806",
          },

          components: {
            Menu: {
              itemHoverBg: "#DDEBF1", // фон при наведении
              itemActiveBg: "#DDEBF1", // фон при клике (active)
              itemSelectedBg: "#DDEBF1", // фон у выбранного пункта
            },
          },
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense
                fallback={<HandlerMutation Loading={true}></HandlerMutation>}
              >
                <AuthPage />
              </React.Suspense>
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
                          {/* <DialogPage /> */}
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

                  {/* Маршрут для Pomoshnik и его вложенных маршрутов */}
                  <Route
                    path="pomoshnik/*"
                    element={
                      <div className="messages">
                        <Panel />
                        <div className="content">
                          <Chat />
                          <Routes>
                            <Route path="start" element={<Pomoshnik />} />
                            <Route path="goal" element={<Goal />} />
                            {/* <Route
                              path="policy/:policyId?"
                              element={<Policy />}
                            /> */}
                            <Route path="statistic" element={<Statistic1 />} />
                            {/* <Route path="svodka" element={<Svodka />} /> */}
                            <Route path="objective" element={<Objective />} />
                            {/* <Route path="strategy" element={<Strategy />} /> */}
                            <Route
                              path="projectWithProgramm"
                              element={<ProjectWithProgramm />}
                            />

                            <Route path="post/:postId?" element={<Post />} />
                            <Route path="postNew" element={<PostNew />} />
                            {/* <Route
                              path="workingPlan"
                              element={<WorkingPlan />}
                            /> */}
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

          {/* edit */}
          <Route
            path="editGoal"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <EditGoal />
              </React.Suspense>
            }
          />

          <Route
            path="editPolicy/:policyId"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <EditPolicy />
              </React.Suspense>
            }
          />

          <Route
            path="editStatisticInformation/:id"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <EditStatisticInformation />
              </React.Suspense>
            }
          />

          <Route
            path="editStatisticPointsData/:id"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <EditStatisticPointsData />
              </React.Suspense>
            }
          />

          <Route
            path="editPost/:postId"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <EditPost />
              </React.Suspense>
            }
          />
          {/* edit */}

          {/* Маршрут для ControlPanel */}
          <Route
            path="controlPanel"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <div className="tab">
                  <ControlPanel />
                </div>
              </React.Suspense>
            }
          />

          {/* Маршрут для Svodka */}
          <Route
            path="svodka"
            element={
              <React.Suspense
                fallback={
                  <div className="lazy">
                    <HandlerMutation Loading={true} />
                  </div>
                }
              >
                <div className="tab">
                  <Svodka />
                </div>
              </React.Suspense>
            }
          />

          <Route
            path=":organizationId/*"
            element={<ApplicationContainer></ApplicationContainer>}
          >
            <Route index element={<Navigate to="helper" replace />} />

            <Route
              path="createUser"
              element={
                <React.Suspense
                  fallback={
                    <div className="lazy">
                      <HandlerMutation Loading={true} />
                    </div>
                  }
                >
                  <User />
                </React.Suspense>
              }
            />
            <Route
              path="accountSettings"
              element={
                <React.Suspense
                  fallback={
                    <div className="lazy">
                      <HandlerMutation Loading={true} />
                    </div>
                  }
                >
                  <SettingsPage />
                </React.Suspense>
              }
            />

            {/* dialog */}
            <Route path="chat/:contactId/*">
              <Route
                index
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <CreateNewConvertPage></CreateNewConvertPage>
                  </React.Suspense>
                }
              />

              {/* <Route
                path="new"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <CreateNewConvertPage></CreateNewConvertPage>
                  </React.Suspense>
                }
              /> */}

              <Route
                path=":convertId"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <DesktopDialogPage></DesktopDialogPage>
                  </React.Suspense>
                }
              />
            </Route>
            {/* dialog */}

            {/* helper */}
            <Route path="helper">
              {/* Основной маршрут helper */}
              <Route
                index
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <HelperChat />
                  </React.Suspense>
                }
              />

              {/* Вложенный маршрут helper/goal */}

              <Route
                path="strategy"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Strategy />
                  </React.Suspense>
                }
              />

              <Route
                path="project"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Project />
                  </React.Suspense>
                }
              />

              <Route
                path="schemaCompany"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <SchemaCompany />
                  </React.Suspense>
                }
              />

              <Route
                path="workingPlan"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <WorkingPlan />
                  </React.Suspense>
                }
              />

              <Route
                path="goal"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Goal />
                  </React.Suspense>
                }
              />

              <Route
                path="policy"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <MessageSelectingList
                      presetName={"POLICIES"}
                    ></MessageSelectingList>
                  </React.Suspense>
                }
              />

              <Route
                path="policy/:policyId"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Policy />
                  </React.Suspense>
                }
              />

              <Route
                path="controlPanel"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <>controlPanel</>
                  </React.Suspense>
                }
              />

              <Route
                path="statistics"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <MessageSelectingList
                      presetName={"STATISTICS"}
                    ></MessageSelectingList>
                  </React.Suspense>
                }
              />

              <Route
                path="statistics/:statisticId"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Statistic></Statistic>
                  </React.Suspense>
                }
              />

              <Route
                path="posts"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <MessageSelectingList
                      presetName={"POSTS"}
                    ></MessageSelectingList>
                  </React.Suspense>
                }
              />

              <Route
                path="posts/:postId"
                element={
                  <React.Suspense
                    fallback={
                      <div className="lazy">
                        <HandlerMutation Loading={true} />
                      </div>
                    }
                  >
                    <Post></Post>
                  </React.Suspense>
                }
              />
            </Route>
            {/* //helper */}
          </Route>
        </Routes>
      </ConfigProvider>
    </div>
  );
}

export default DesktopApp;
