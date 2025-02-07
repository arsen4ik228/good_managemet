import './MobileApp.css';
import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import AuthorizationPage from './UI/Authorization/AuthorizationPage.jsx'
import Main from './UI/Main/Main.jsx'
import HelperChat from '@app'
import MainPolicy from '@app'
import Policy from '@app'
import CreatePolicyDirectory from '@app'
import EditPolicyDirectories from '@app'
import MainPost from '@app'
import Posts from '@app'
import NewPosts from '@app'
import AttachStatistics from '@app'
import MainStrategy from '@app'
import Strategy from '@app'
import Goal from '@app'
import Objective from '@app'
import Projects from '@app'
import MainProject from '@app'
import Target from '@app'
import NewProject from '@app'
import Programs from '@app'
import ProjectArchive from '@app'
import MainStatistics from '@app'
import Statistics from '@app'
import NewStatistic from '@app'
import MainWorkingPlan from '@app'
import ModalContainer from '@app'
import ControlPanel from '@app'


function MobileApp() {
    return (
        <>
            <Routes>
                {/* <Route path={'/'} element={<Navigate replace to="Main" />}></Route> */}
                <Route path={'/'} element={<AuthorizationPage />}></Route>
                <Route path="/*"
                    element={
                        <Routes>
                            {/* <Route path="test" element={<ModalContainer />} /> */}
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
