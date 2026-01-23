import s from './Table.module.css'
import TableName from '../tableName/TableName.jsx'
import TableRow from '../row/TableRow.jsx'

export default function Table({ title, targets }) {
    return (
        <div className={s.table}>
            <TableName title={title} />
            {
                targets?.map((t) => (
                    <TableRow id={t.id} orderNumber={t.orderNumber} content={t.content} holderPostId={t.holderPostId} />
                ))
            }
        </div>
    )
}
