import './MobileApp.css';
import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import AuthorizationPage from './UI/Authorization/AuthorizationPage.jsx'
import Main from './UI/Main/Main.jsx'
import HelperChat from './UI/Chat/Chat.jsx'
import MainPolicy from './UI/Policy/MainPolicy.jsx'
import Policy from './UI/Policy/Policy.jsx'
import CreatePolicyDirectory from './UI/Policy/PolicyDirectory/CreatePolicyDirectory.jsx';
import EditPolicyDirectories from './UI/Policy/PolicyDirectory/EditPolicyDirectory.jsx';
import MainPost from './UI/Posts/MainPost.jsx'
import Posts from './UI/Posts/Posts'
import NewPosts from "./UI/Posts/NewPosts";
import AttachStatistics from './UI/Posts/AttachStatistics/AttachStatistics.jsx';
import MainStrategy from './UI/Strategy/MainStartegy.jsx';
import Strategy from "./UI/Strategy/Strategy";
import Goal from "./UI/Goal/Goal";
import Objective from "./UI/Objective/Objective.jsx"
import Projects from './UI/Projects/Projects.jsx';
import MainProject from './UI/Projects/MainProject/MainProject.jsx';
import Target from './UI/Projects/Targets/Target.jsx';
import NewProject from './UI/Projects/NewProject/NewProject.jsx';
import Programs from './UI/Projects/Programs.jsx';
import ProjectArchive from './UI/Projects/Archive/ProjectArchive.jsx';
import MainStatistics from './UI/Statistics/MainStatistics.jsx';
import Statistics from './UI/Statistics/Statistics.jsx';
import NewStatistic from './UI/Statistics/NewStatistic.jsx';
import MainWorkingPlan from './UI/WorkingPlan/MainWorkingPlan.jsx';
import ModalContainer from './UI/Custom/ModalContainer/ModalContainer.jsx';
import ControlPanel from './UI/ControlPanel/ControlPanel.jsx';

function MobileApp() {
    return (
        <>
            <Routes>
                {/* <Route path={'/'} element={<Navigate replace to="Main" />}></Route> */}
                <Route path={'/'} element={<AuthorizationPage />}></Route>
                <Route path="/*"
                    element={
                        <Routes>
                            <Route path="test" element={<ModalContainer />} />
                            <Route path="Main" element={<Main />} />
                            <Route path='ControlPanel' element={<ControlPanel />} />
                            <Route path="pomoshnik/*"
                                element={
                                    <Routes>
                                        <Route path="/" element={<Navigate to="start" replace />} />

                                        <Route path="start" element={<HelperChat />} />

                                        <Route path="Policy" element={<MainPolicy />} />
                                        <Route path="Policy/:policyId" element={<Policy />} />
                                        <Route path="Policy/CreateDirectory" element={<CreatePolicyDirectory />} />
                                        <Route path="Policy/EditDirectory/:policyDirectoryId" element={<EditPolicyDirectories />} />

                                        <Route path="Posts" element={<MainPost />} />
                                        <Route path="Posts/:postId" element={<Posts />} />
                                        <Route path="Posts/new" element={<NewPosts />} />
                                        <Route path="Posts/:postId/attachStatistics" element={<AttachStatistics />} />

                                        <Route path="Strategy" element={<MainStrategy />} />
                                        <Route path="Strategy/:strategyId" element={<Strategy />} />

                                        <Route path="Goal" element={<Goal />} />

                                        <Route path="Objective" element={<Objective />} />

                                        <Route path="Projects" element={<MainProject />} />
                                        <Route path="Projects/:projectId" element={<Projects />} />
                                        <Route path="Projects/Target" element={<Target />} />
                                        <Route path="Projects/new" element={<NewProject />} />
                                        <Route path="Projects/program/:programId" element={<Programs />} />
                                        <Route path="Projects/archive/:projectId" element={<ProjectArchive />} />

                                        <Route path="Statistics" element={<MainStatistics />} />
                                        <Route path="Statistics/:statisticId" element={<Statistics />} />
                                        <Route path="Statistics/new/:paramPostID?" element={<NewStatistic />} />

                                        <Route path='WorkingPlan' element={<MainWorkingPlan />} />
                                       
                                    </Routes>
                                }
                            />



                        </Routes>
                    }>
                </Route>
            </Routes>
        </>
    );
}

export default MobileApp;
