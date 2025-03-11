import React from "react";

const Pomoshnik = React.lazy(() => import("@app/Pomoshnik/Pomoshnik"));
const ControlPanel = React.lazy(() => import("@app/ControlPanel/ControlPanel"));
const User = React.lazy(() => import("@app/UserPage/User"));
const Goal = React.lazy(() => import("@app/GoalPage/Goal"));
const Policy = React.lazy(() => import("@app/PolicyPage/Policy"));
const Statistic = React.lazy(() => import("@app/StatisticsPage/Statistic"));
const Objective = React.lazy(() => import("@app/ObjectivePage/Objective"));
const Strategy = React.lazy(() => import("@app/StrategyPage/Strategy"));
const StartProject = React.lazy(() => import("@app/ProjectPage/Start/Update/StartContent"));
const Project = React.lazy(() => import("@app/ProjectPage/Project/Update/Project"));
const ProjectNew = React.lazy(() => import("@app/ProjectPage/Project/Create/ProjectNew"));
const Program = React.lazy(() => import("@app/ProjectPage/Program/Update/Program"));
const ProgramNew = React.lazy(() => import("@app/ProjectPage/Program/Create/ProgramNew"));
const Post = React.lazy(() => import("@app/PostPage/Post"));
const PostNew = React.lazy(() => import("@app/PostPage/PostNew"));
const WorkingPlan = React.lazy(() => import("@app/WorkingPlanPage/MainWorkingPlan"))
const PostSchema = React.lazy(() => import("@app/CompanySchema/desktop/CompanySchema"))
const SchemeСompanies = React.lazy(() => import("@app/CompanySchema/desktop/schemeСompanies/SchemeСompanies"))

const pageComponents = {
  pomoshnik: {
    controlPanel: ControlPanel,
    user: User,
    companySchema: SchemeСompanies,
    postSchema: PostSchema,
    
    start: Pomoshnik,
    goal: Goal,
    policy: Policy,
    statistic: Statistic,
    objective: Objective,
    strategy: Strategy,
    startProject: StartProject,
    project: Project,
    projectNew: ProjectNew,
    program: Program,
    programNew: ProgramNew,
    post: Post,
    postNew: PostNew,
    workingPlan: WorkingPlan,
  },
};

export default pageComponents;