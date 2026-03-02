import {DatePicker} from 'antd';
import {CalendarOutlined} from '@ant-design/icons';
import s from '../Date.module.css';
import dayjs from 'dayjs';

export default function DateForProjectInProgram({date}) {
    return (
        <DatePicker
            open={false}
            value={date ? dayjs(date) : null}
            onChange={undefined}
            inputReadOnly
            format="DD.MM.YY"
            placeholder=""
            className={s.date}
            suffixIcon={date ? null : <CalendarOutlined style={{fontSize: 20, color: '#999', marginRight: 25}}/>}
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
