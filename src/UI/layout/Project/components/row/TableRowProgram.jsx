import s from './TableRow.module.css';
import LineNumber from './partsRow/LineNumber';
import Content from './partsRow/Content';
import HolderPostId from './partsRow/HolderPostId';
import CustomDatePicker from './partsRow/Date';

export default function TableRowProgram({ target, posts, updateTarget, addTarget, focusTargetId, fieldDisabled, orderNumber}) {
  return (
    <div className={s.row}>
      <LineNumber orderNumber={orderNumber} />
      <Content
        content={target.content}
        onChange={(val) => updateTarget(target.id, 'content', val)}
        addTarget={addTarget}
        autoFocus={target.id === focusTargetId} // <- передаём условный фокус
        fieldDisabled={fieldDisabled}
      />
      <HolderPostId
        holderPostId={target.holderPostId}
        posts={posts}
        onChange={(val) => updateTarget(target.id, 'holderPostId', val)}
        fieldDisabled={fieldDisabled}
      />
      <CustomDatePicker
        date={target.deadline}
        onChange={(val) => updateTarget(target.id, 'deadline', val)}
        fieldDisabled={fieldDisabled}
      />
    </div>
  );
}
