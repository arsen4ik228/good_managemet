import React from "react";
import classes from "./SelectBorder.module.css";

import { Select } from "antd";
const { Option } = Select;

export default function SelectBorder({
  value,
  onChange,
  array,
  array1,
  arrayItem,
  prefix,
  styleSelected,
  refSelectBorder
}) {
  return (
    <Select
      ref={refSelectBorder}
      value={value}
      onChange={onChange}
      className={styleSelected}
      placeholder="Выберите стратегию"
      style={{ width: "180px" }}
    >
      {array?.map((item) => (
        <Option 
          key={item.id} 
          value={item.id}
          className={item.state}
          disabled={item.disabled}
        >
          {prefix}
          {item[arrayItem]}
        </Option>
      ))}

      {array1?.map((item) => (
        <Option 
          key={item.id} 
          value={item.id}
          className={item.state}
          disabled={item.disabled}
        >
          {prefix}
          {item[arrayItem]}
        </Option>
      ))}
    </Select>
  );
}

// export default function SelectBorder({
//   value,
//   onChange,
//   array,
//   array1,
//   arrayItem,
//   prefix,
//   styleSelected,
//   refSelectBorder
// }) {

//   return (
//     <div className={classes.item} ref={refSelectBorder}>
//       <select
//         name="mySelect"
//         value={value}
//         onChange={(e) => {
//           onChange(e.target.value);
//         }}
//         className={`${classes.select} ${classes[styleSelected]}`}
//       >
//         <option value="" disabled>
//           Выберите стратегию
//         </option>

//         {array?.map((item) => (
//           <>
//             <option key={item.id} value={item.id} className={classes[item.state]}>
//               {prefix}
//               {item[arrayItem]}
//             </option>
//           </>
//         ))}

//         {array1?.map((item) => {
//           return (
//             <option key={item.id} value={item.id} className={classes[item.state]}>
//               {prefix}
//               {item[arrayItem]}
//             </option>
//           );
//         })}
//       </select>
//     </div>
//   );
// }
