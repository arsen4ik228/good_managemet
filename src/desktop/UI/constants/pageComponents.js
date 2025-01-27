import React from "react";

const Pomoshnik = React.lazy(() => import("@app/Pomoshnik/Pomoshnik"));
const ControlPanel = React.lazy(() => import("@app/ControlPanel/ControlPanel"));
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

const pageComponents = {
  pomoshnik: {
    start: Pomoshnik,
    controlPanel: ControlPanel,
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
  },
};

export default pageComponents;