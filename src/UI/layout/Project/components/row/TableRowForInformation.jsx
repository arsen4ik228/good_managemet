import s from './TableRowForInformation.module.css';
import Content from './partsRow/Content';

export default function TableRowForInformation({ content, updateContent }) {
  return (
     <div className={s.row}>
          <Content
            content={content}
            onChange={updateContent}
          />
        </div>
  )
}
