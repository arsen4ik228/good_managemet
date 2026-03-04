import s from './TableRow.module.css';
import LineNumber from './partsRow/LineNumber';
import { homeUrl } from '@helpers/constants'
import {useParams} from "react-router-dom";
import ContentForReadOnly from "./partsRow/readOnly/ContentForReadOnly";
import HolderPostIdForReadOnly from "./partsRow/readOnly/HolderPostIdForReadOnly";
import DateForReadOnly from "./partsRow/readOnly/DateForReadOnly";

export default function TableRowForProjectsInProgram({ hrefProject, target, posts, updateTarget, addTarget, focusTargetId, orderNumber}) {
    const {organizationId} = useParams();
    const openProject = (projectId) => {
        window.open(homeUrl + `#/${organizationId}/helper/project/${projectId}`, '_blank');
    }
  return (
    <div className={s.row} onClick={(e) => openProject(hrefProject)}>
      <LineNumber orderNumber={orderNumber} target={target}/>
      <ContentForReadOnly
        content={target.content}
      />
      <HolderPostIdForReadOnly
        holderPostId={target.holderPostId}
        posts={posts}
      />
      <DateForReadOnly
        date={target.deadline}
      />
    </div>
  );
}
