import s from './TableName.module.css'

export default function TableName({title}) {
  return (
    <div className={s.title}>{title}</div>
  )
}
