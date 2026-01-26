import { useState } from 'react' 
import TextAreaRdx from '../../../../../radixUI/textArea/TextAreaRdx'
import s from './Content.module.css'

export default function Content({ content }) {
  const [value, setValue] = useState(content);
  return (
    <TextAreaRdx
      className={s.content}
      style={{
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoSize
    />
  )
}
