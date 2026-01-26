
import s from './TableRow.module.css'

import LineNumber from './partsRow/LineNumber'
import Content from './partsRow/Content'
import HolderPostId from './partsRow/HolderPostId'
import Date from './partsRow/Date'

export default function TableRow({orderNumber, content, holderPostId, posts}) {
    return (
        <div className={s.row}>
            <LineNumber orderNumber={orderNumber}></LineNumber>
            <Content content={content}></Content>
            <HolderPostId posts={posts} holderPostId={holderPostId}></HolderPostId>
            <Date></Date>
        </div>
    )
}
