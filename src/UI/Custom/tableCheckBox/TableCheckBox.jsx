import classes from "./TableCheckBox.module.css";

export default function TableCheckBox({
  deleteInputCheckbox,
  nameTable,
  array,
  arrayItem,
  arrayCheked,
  handleChecboxChange,
}) {

  const checkedArray = array
    ? array
      .filter((a) => arrayCheked.includes(a.id))
      .sort((a, b) => {
        const aValue = a[arrayItem] || "";
        const bValue = b[arrayItem] || "";
        return aValue.localeCompare(bValue);
      })
    : [];

  const uncheckedArray = array
    ? array
      .filter((a) => !arrayCheked.includes(a.id))
      .sort((a, b) => {
        const aValue = a[arrayItem] || "";
        const bValue = b[arrayItem] || "";
        return aValue.localeCompare(bValue);
      })
    : [];


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
            {checkedArray.map((item) => (
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

          <td>
            {uncheckedArray.map((item) => (
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