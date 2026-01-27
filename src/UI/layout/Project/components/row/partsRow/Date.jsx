import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import s from './Date.module.css';

export default function CustomDatePicker({ date, onChange }) {
  return (
    <DatePicker
      value={date}
      onChange={onChange}
      format="DD.MM.YY"
      placeholder=""
      className={s.date}
      suffixIcon={date ? null : <CalendarOutlined style={{ fontSize: 20, color: '#999', marginRight: 22 }} />}
      style={{
        textAlign: 'center',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: "#F0F0F0"
      }}
    />
  );
}
