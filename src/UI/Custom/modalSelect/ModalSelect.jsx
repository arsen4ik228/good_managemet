import classes from "./ModalSelect.module.css";
import exitModal from "@image/exitModal.svg";

export function ModalSelect({
  nameTable,
  handleSearchValue,
  handleSearchOnChange,
  handleSelectedStatisticID,
  exit,
  filterArray,
  array,
  arrayItem,
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={() => exit()}
          className={classes.exit}
        />

        <div className={classes.header}>
          <div className={classes.item1}>
            <input
              type="search"
              placeholder="Найти"
              value={handleSearchValue}
              onChange={handleSearchOnChange}
              className={classes.search}
            />
          </div>


        </div>

        <table className={classes.table}>
          <thead>
            <tr>
              <th>{nameTable}</th>
            </tr>
          </thead>

          {filterArray.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {filterArray?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleSelectedStatisticID(item?.id)}
                    >
                      {item[arrayItem]}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {array?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleSelectedStatisticID(item?.id)}
                    >
                      {item[arrayItem]}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
