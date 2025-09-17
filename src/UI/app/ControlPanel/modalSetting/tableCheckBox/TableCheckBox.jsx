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

    <div className={classes.container}>

      <table className={classes.table}>

        <thead>
          <tr>
            <th>{nameTable[0]}</th>
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
          </tr>
        </tbody>
      </table>


      <table className={classes.table}>
        <thead>
          <tr>
            <th>{nameTable[1]}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
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

    </div>

  );
}