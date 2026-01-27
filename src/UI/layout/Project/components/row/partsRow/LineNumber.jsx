import s from './LineNumber.module.css'

export default function LineNumber({orderNumber, isCreated}) {
  return (
    <div className={s.number} data-created={isCreated ? 'true' : undefined}>{orderNumber}</div>
  )
}
