import s from './TableRow.module.css';
import LineNumber from './partsRow/LineNumber';
import { homeUrl } from '@helpers/constants'
import {useParams} from "react-router-dom";
import ContentForProjectInProgram from "./partsRow/program/ContentForProjectInProgram";
import HolderPostIdForProjectInProgram from "./partsRow/program/HolderPostIdForProjectInProgram";
import DateForProjectInProgram from "./partsRow/program/DateForProjectInProgram";

export default function TableRowProgram({ hrefProject, target, posts, updateTarget, addTarget, focusTargetId, orderNumber}) {
    const {organizationId} = useParams();
    const openProject = (projectId) => {
        window.open(homeUrl + `#/${organizationId}/helper/project/${projectId}`, '_blank');
    }
  return (
    <div className={s.row} onClick={(e) => openProject(hrefProject)}>
      <LineNumber orderNumber={orderNumber} />
      <ContentForProjectInProgram
        content={target.content}
      />
      <HolderPostIdForProjectInProgram
        holderPostId={target.holderPostId}
        posts={posts}
      />
      <DateForProjectInProgram
        date={target.deadline}
      />
    </div>
  );
}
