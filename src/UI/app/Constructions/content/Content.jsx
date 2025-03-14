import React from "react";
import classes from "./Content.module.css";
import { useParams } from "react-router-dom";
import pageComponents from "@helpers/pageComponents.js";
import HandlerQeury from "@Custom/HandlerQeury";

const NotFound = React.lazy(() => import("@app/NotFound/NotFound"));
const Panel = React.lazy(() => import("../panel/Panel"));
const Chat = React.lazy(() => import("@app/Chat/Chat"));


const PostSchema = React.lazy(() => import("@app/CompanySchema/desktop/CompanySchema"))

export default function Content() {
  const { group, route } = useParams();

  const Component =
    typeof pageComponents[group] === "object"
      ? pageComponents[group]?.[route]
      : pageComponents[group];


  return (
    <React.Suspense fallback={<HandlerQeury Loading={true}></HandlerQeury>}>
      {Component ? (
        <>
          <Panel />
          <div className={classes.content}>
            <Chat />
            <Component />
          </div>
        </>
      ) : (
        <div className={classes.notFound}>
          <NotFound />
        </div>
      )}
    </React.Suspense>
  );
}
