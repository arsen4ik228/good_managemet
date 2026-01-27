import s from './TableRow.module.css';
import LineNumber from './partsRow/LineNumber';
import Content from './partsRow/Content';
import HolderPostId from './partsRow/HolderPostId';
import CustomDatePicker from './partsRow/Date';

export default function TableRow({ target, posts, updateTarget }) {
  return (
    <div className={s.row}>
      <LineNumber orderNumber={target.orderNumber} isCreated={target.isCreated} />
      <Content
        content={target.content}
        onChange={(val) => updateTarget(target.id, 'content', val)}
      />
      <HolderPostId
        holderPostId={target.holderPostId}
        posts={posts}
        onChange={(val) => updateTarget(target.id, 'holderPostId', val)}
      />
      <CustomDatePicker
        date={target.date}
        onChange={(val) => updateTarget(target.id, 'date', val)}
      />
    </div>
  );
}
