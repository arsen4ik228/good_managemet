import React, { useState } from 'react'
import { DatePicker } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import s from './Date.module.css'

export default function CustomDatePicker() {
    const [date, setDate] = useState(null)

    return (
        <DatePicker
            value={date}
            onChange={(d) => setDate(d)}
            format="DD.MM.YY"
            placeholder=""
            className={s.date}
            suffixIcon={
                !date ? <CalendarOutlined style={{
                    fontSize: '20px', color: '#999', marginRight: "22px"
                }} /> : null
            }
            style={{
                textAlign: 'center', // центрируем текст/иконку
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
            }}
        />
    )
}
