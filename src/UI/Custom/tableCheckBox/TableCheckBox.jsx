import classes from "./TableCheckBox.module.css";

export default function TableCheckBox({
  deleteInputCheckbox,
  nameTable,
  array,
  arrayItem,
  arrayCheked,
  handleChecboxChange,
}) {

  const sortedArray = array ? [...array].sort((a, b) => {
    const aIsChecked = arrayCheked.includes(a.id);
    const bIsChecked = arrayCheked.includes(b.id);
    
    if (aIsChecked && !bIsChecked) return -1;
    if (!aIsChecked && bIsChecked) return 1;
    
    const aValue = a[arrayItem] || "";
    const bValue = b[arrayItem] || "";
    
    return aValue.localeCompare(bValue);
  }) : [];

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>{nameTable}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {sortedArray.map((item) => (
              <div
                key={item.id}
                className={classes.row}
                onClick={() => handleChecboxChange(item.id)}
              >
                {deleteInputCheckbox ? null : (
                  <input
                    type="checkbox"
                    checked={arrayCheked.includes(item.id)}
                    readOnly
                  />
                )}

                {item[arrayItem]}
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}