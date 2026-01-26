
import s from './TableRow.module.css'

import LineNumber from './partsRow/LineNumber'
import Content from './partsRow/Content'
import HolderPostId from './partsRow/HolderPostId'
import Date from './partsRow/Date'

export default function TableRow({orderNumber, content, holderPostId}) {
    return (
        <div className={s.row}>
            <LineNumber orderNumber={orderNumber}></LineNumber>
            <Content content={content}></Content>
            <HolderPostId></HolderPostId>
            <Date></Date>
        </div>
    )
}
