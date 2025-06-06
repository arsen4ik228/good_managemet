import "./MobileApp.css";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthorizationPage } from "@app";
import { MobileMain } from "@app";
import { HelperChat } from "@app";
import { MainPolicy } from "@app";
import { MobilePolicy } from "@app";
import { CreatePolicyDirectory } from "@app";
import { EditPolicyDirectories } from "@app";
import { MainPost } from "@app";
import { Posts } from "@app";
import { NewPosts } from "@app";
import { AttachStatistics } from "@app";
import { MainStrategy } from "@app";
import { MobileStrategy } from "@app";
import { MobileGoal } from "@app";
import { MobileObjective } from "@app";
import { Projects } from "@app";
import { MainProject } from "@app";
import { NewProject } from "@app";
import { Programs } from "@app";
import { ProjectArchive } from "@app";
import { MainStatistics } from "@app";
import { Statistics } from "@app";
import { MobileMainWorkingPlan } from "@app";
import { MobileControlPanel } from "@app";
import { User } from "@app";
import { DialogPage } from "@app";
import { Message } from "../../UI/Custom/Message/Message.jsx";
import { ConvertsPage } from "@app";
import { CompanySchema } from "@app";
import { SchemeСompanies } from "@app";
import {
  SettingsPage,
  WatcherDialogPage,
  AgreementDialogPage,
  ArchiveDialog,
} from "@app";
import { ProjectWithProgramm } from "@app";
import ErrorPage from "@app/ErrorPage/ErrorPage.jsx";

import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

function MobileApp() {
  return (
    <ConfigProvider locale={ruRU}>
      <Routes>
        {/* <Route path={'/'} element={<Navigate replace to="Main" />}></Route> */}
        <Route path={"/"} element={<AuthorizationPage />}></Route>
        <Route
          path="/*"
          element={
            <Routes>
              <Route path="error" element={<ErrorPage />} />

              <Route path="Chat/:contactId" element={<ConvertsPage />} />
              <Route
                path="Chat/:contactId/:convertId"
                element={<DialogPage />}
              />
              <Route
                path="Chat/:contactId/watcher/:convertId"
                element={<WatcherDialogPage />}
              />
              <Route
                path="Chat/:contactId/archive/:convertId"
                element={<ArchiveDialog />}
              />
              <Route
                path="Chat/:contactId/agreement/:convertId"
                element={<AgreementDialogPage />}
              />

              <Route path="account" element={<SettingsPage></SettingsPage>} />
              <Route path="Main" element={<MobileMain />} />
              <Route path="ControlPanel" element={<MobileControlPanel />} />
              <Route
                path="pomoshnik/*"
                element={
                  <Routes>
                    <Route path="/" element={<Navigate to="start" replace />} />

                    <Route path="start" element={<HelperChat />} />

                    <Route path="Policy" element={<MainPolicy />} />
                    <Route path="Policy/:policyId" element={<MobilePolicy />} />
                    <Route
                      path="Policy/CreateDirectory"
                      element={<CreatePolicyDirectory />}
                    />
                    <Route
                      path="Policy/EditDirectory/:policyDirectoryId"
                      element={<EditPolicyDirectories />}
                    />

                    <Route path="Post" element={<MainPost />} />
                    <Route path="Post/:postId" element={<Posts />} />
                    <Route path="Post/new" element={<NewPosts />} />
                    <Route
                      path="Post/:postId/attachStatistics"
                      element={<AttachStatistics />}
                    />

                    <Route path="Strategy" element={<MainStrategy />} />
                    <Route
                      path="Strategy/:strategyId"
                      element={<MobileStrategy />}
                    />

                    <Route path="Goal" element={<MobileGoal />} />

                    <Route path="Objective" element={<MobileObjective />} />

                    <Route
                      path="projectWithProgramm"
                      element={<ProjectWithProgramm />}
                    />

                    <Route path="Statistics" element={<MainStatistics />} />
                    <Route
                      path="Statistics/:statisticId"
                      element={<Statistics />}
                    />

                    <Route
                      path="WorkingPlan"
                      element={<MobileMainWorkingPlan />}
                    />
                    <Route path="user" element={<User />} />

                    <Route
                      path="postSchema/:organizationId"
                      element={<CompanySchema />}
                    />
                    <Route path="companySchema" element={<SchemeСompanies />} />
                  </Routes>
                }
              />
            </Routes>
          }
        ></Route>
      </Routes>
    </ConfigProvider>
  );
}

export default MobileApp;
