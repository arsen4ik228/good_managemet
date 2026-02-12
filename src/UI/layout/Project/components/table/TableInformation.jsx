import s from './Table.module.css';
import TableName from '../tableName/TableName.jsx';
import TableRowForInformation from '../row/TableRowForInformation.jsx';

export default function TableInformation({
                                             title,
                                             content,
                                             updateContent,
                                         }) {

    return (
        <div className={s.table}>
            <TableName title={title}/>

            <TableRowForInformation
                content={content}
                updateContent={updateContent}
            />

        </div>
    );
}
