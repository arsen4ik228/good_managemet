import s from './TableRowForInformation.module.css';
import Content from './partsRow/Content';

export default function TableRowForInformation({ target,updateTarget }) {
  return (
     <div className={s.row}>
          <Content
            content={target.content}
            onChange={(val) => updateTarget(target.id, 'content', val)}
          />
        </div>
  )
}
