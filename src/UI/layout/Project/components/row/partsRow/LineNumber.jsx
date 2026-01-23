import s from './LineNumber.module.css'

export default function LineNumber({orderNumber}) {
  return (
    <div className={s.number}>{orderNumber}</div>
  )
}
