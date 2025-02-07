import React from "react";
import addCircle from "../../image/addCircle.svg";
import deleteGrey from "../../image/deleteGrey.svg";
import classes from "./TableProject.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TableProject({
  tableKey,
  nameTable,
  add,

  array,
  setArray,

  _array,
  _setArray,

  workers,
  deleteRow,
  disabledTable,

  createProgram,
  disabledProject,
  handleCheckBox,

  createProject,

  updateProject,

  updateProgramm,
  arraySelectProjects,
  openModal,
  lengthReceived,
}) {
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const items = Array.from(array);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setArray(items);
  };

  const _handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const items = Array.from(_array);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    _setArray(items);
  };

  return (
    <table key={tableKey} className={classes.table}>
      <caption>
        <div className={classes.nameRow}>
          <div>
            {(() => {
              const map = {
                Обычная: "ЗАДАЧА",
                Статистика: "МЕТРИКА",
              };
              return (createProgram || updateProgramm) &&
                nameTable === "Обычная"
                ? "ПРОЕКТЫ"
                : map[nameTable] || nameTable.toUpperCase();
            })()}
          </div>

          {createProgram &&
            nameTable !== "Обычная" &&
            nameTable !== "Продукт" && (
              <img
                src={addCircle}
                alt="addCircle"
                onClick={() => add(nameTable)}
              />
            )}

          {updateProgramm && !disabledTable && nameTable !== "Продукт" && (
            <img
              src={addCircle}
              alt={"addCircle"}
              onClick={
                nameTable === "Обычная"
                  ? () => openModal(true)
                  : () => add(nameTable)
              }
            />
          )}

          {createProject && (
            <>
              {nameTable !== "Продукт" && (
                <img
                  src={addCircle}
                  alt="addCircle"
                  onClick={() => add(nameTable)}
                />
              )}
            </>
          )}

          {updateProject && !disabledTable && nameTable !== "Продукт" && (
            <img
              src={addCircle}
              alt="addCircle"
              onClick={() => add(nameTable)}
            />
          )}
        </div>
      </caption>
      <tbody>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={nameTable}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${
                  snapshot.isDraggingOver
                    ? classes.fonTable__isDraggingOver
                    : classes.fonTable
                }`}
              >
                {array?.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                    isDragDisabled={disabledTable}
                  >
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps}>
                        <td
                          className={classes.numberTableColumn}
                          {...provided.dragHandleProps}
                        >
                          {index + 1}
                        </td>

                        {/*Имя проекта в программе */}
                        {(createProgram || updateProgramm) &&
                          nameTable === "Обычная" && (
                            <>
                              <td
                                className={
                                  classes.nameProjectToProgramTableColumn
                                }
                              >
                                {item?.nameProject}
                              </td>
                            </>
                          )}

                        <td className={classes.nameTableColumn}>
                          <input
                            type="text"
                            value={item.content}
                            onChange={(e) => {
                              const updated = [...array];
                              updated[index].content = e.target.value;
                              setArray(updated);
                            }}
                            disabled={
                              disabledTable ||
                              (disabledProject && nameTable === "Обычная")
                            }
                          />
                        </td>

                        <td className={classes.imageTableColumn}>
                          <select
                            name="mySelect"
                            value={item.holderUserId}
                            onChange={(e) => {
                              const updated = [...array];
                              updated[index].holderUserId = e.target.value;
                              setArray(updated);
                            }}
                            className={classes.select}
                            disabled={
                              disabledTable ||
                              (disabledProject && nameTable === "Обычная")
                            }
                          >
                            <option value="">Выберите сотрудника</option>
                            {workers.map((item) => {
                              return (
                                <option
                                  key={item.id}
                                  value={item.id}
                                >{`${item.firstName} ${item.lastName} `}</option>
                              );
                            })}
                          </select>
                        </td>

                        <td
                          className={`${
                            item.isExpired === true ? classes.expired : ""
                          } ${classes.dateTableColumn}`}
                        >
                          <input
                            type="date"
                            value={item.deadline.slice(0, 10)}
                            onChange={(e) => {
                              const updated = [...array];
                              const date = new Date(e.target.value);
                              date.setUTCHours(21, 0, 0, 0);
                              updated[index].deadline = date.toISOString();
                              setArray(updated);
                            }}
                            disabled={
                              disabledTable ||
                              (disabledProject && nameTable === "Обычная")
                            }
                            className={`${
                              item.isExpired === true ? classes.expired : ""
                            }`}
                          />
                        </td>

                        {createProgram && (
                          <>
                            {nameTable === "Обычная" ? (
                              <td className={classes.checkBox}>
                                {nameTable !== "Продукт" && (
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      handleCheckBox(item.id);
                                    }}
                                  />
                                )}
                              </td>
                            ) : (
                              <td className={classes.deleteTableColumn}>
                                {nameTable !== "Продукт" && (
                                  <img
                                    src={deleteGrey}
                                    alt="deleteGrey"
                                    onClick={() =>
                                      deleteRow(item.type, item.id)
                                    }
                                  />
                                )}
                              </td>
                            )}
                          </>
                        )}

                        {createProject && (
                          <td className={classes.deleteTableColumn}>
                            {!(
                              nameTable === "Продукт" ||
                              (index === 0 && nameTable === "Обычная")
                            ) && (
                              <img
                                src={deleteGrey}
                                alt="deleteGrey"
                                onClick={() => deleteRow(item.type, item.id)}
                              />
                            )}
                          </td>
                        )}

                        {updateProject && (
                          <td className={classes.statusTableColumn}>
                            <select
                              name="mySelect"
                              value={item.targetState}
                              onChange={(e) => {
                                const updated = [...array];
                                updated[index].targetState = e.target.value;
                                setArray(updated);
                              }}
                              className={classes.select}
                              disabled={disabledTable}
                            >
                              <option value="Активная">Активная</option>
                              <option value="Завершена">Завершена</option>
                              <option value="Отменена">Отменена</option>
                            </select>
                          </td>
                        )}

                        {updateProgramm && (
                          <>
                            <td className={classes.statusTableColumn}>
                              <select
                                name="mySelect"
                                value={item.targetState}
                                onChange={(e) => {
                                  const updated = [...array];
                                  updated[index].targetState = e.target.value;
                                  setArray(updated);
                                }}
                                className={classes.select}
                                disabled={
                                  disabledTable || nameTable === "Обычная"
                                }
                              >
                                <option value="Активная">Активная</option>
                                <option value="Завершена">Завершена</option>
                                <option value="Отменена">Отменена</option>
                              </select>
                            </td>

                            {nameTable === "Обычная" && (
                              <td className={classes.checkBox}>
                                {nameTable !== "Продукт" && (
                                  <input
                                    type="checkbox"
                                    checked={arraySelectProjects.includes(
                                      item.id
                                    )}
                                    onChange={() => {
                                      handleCheckBox(item.id);
                                    }}
                                    disabled={disabledTable}
                                  />
                                )}
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <DragDropContext onDragEnd={_handleOnDragEnd}>
          <Droppable droppableId={nameTable}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className={`${
                  snapshot.isDraggingOver
                    ? classes.fonTable__isDraggingOver
                    : classes.fonTable
                }`}
              >
                {_array?.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps}>
                        {updateProgramm ? (
                          <>
                            {nameTable === "Обычная" ? (
                              <>
                                <td
                                  {...provided.dragHandleProps}
                                  className={classes.numberTableColumn1}
                                >
                                  {lengthReceived + index + 1}
                                </td>

                                <td
                                  className={
                                    classes.nameProjectToProgramTableColumn
                                  }
                                >
                                  {item?.nameProject}
                                </td>

                                <td className={classes.nameTableColumn}>
                                  <input
                                    type="text"
                                    value={item.content}
                                    disabled={true}
                                  />
                                </td>

                                <td className={classes.imageTableColumn}>
                                  <select
                                    name="mySelect"
                                    value={item.holderUserId}
                                    disabled={true}
                                    className={classes.select}
                                  >
                                    <option value="">
                                      Выберите сотрудника
                                    </option>
                                    {workers.map((item) => {
                                      return (
                                        <option
                                          key={item.id}
                                          value={item.id}
                                        >{`${item.firstName} ${item.lastName} `}</option>
                                      );
                                    })}
                                  </select>
                                </td>

                                <td className={classes.dateTableColumn}>
                                  <input
                                    type="date"
                                    value={item.deadline.slice(0, 10)}
                                    disabled={true}
                                  />
                                </td>

                                <td className={classes.statusTableColumn}>
                                  <select
                                    name="mySelect"
                                    value={item.targetState}
                                    className={classes.select}
                                    disabled={true}
                                  >
                                    <option value="Активная">Активная</option>
                                    <option value="Завершена">Завершена</option>
                                    <option value="Отменена">Отменена</option>
                                  </select>
                                </td>
                              </>
                            ) : (
                              <>
                                <td
                                  {...provided.dragHandleProps}
                                  className={classes.numberTableColumn1}
                                >
                                  {lengthReceived + index + 1}
                                </td>

                                <td className={classes.nameTableColumn1}>
                                  <input
                                    type="text"
                                    value={item.content}
                                    onChange={(e) => {
                                      const updated = [..._array];
                                      updated[item.orderNumber - 1].content =
                                        e.target.value;
                                      _setArray(updated);
                                    }}
                                  />
                                </td>

                                <td className={classes.imageTableColumn}>
                                  <select
                                    name="mySelect"
                                    value={item.holderUserId}
                                    onChange={(e) => {
                                      const updated = [..._array];
                                      updated[
                                        item.orderNumber - 1
                                      ].holderUserId = e.target.value;
                                      _setArray(updated);
                                    }}
                                    className={classes.select}
                                  >
                                    <option value="">
                                      Выберите сотрудника
                                    </option>
                                    {workers.map((item) => {
                                      return (
                                        <option
                                          key={item.id}
                                          value={item.id}
                                        >{`${item.firstName} ${item.lastName} `}</option>
                                      );
                                    })}
                                  </select>
                                </td>

                                <td className={classes.dateTableColumn}>
                                  <input
                                    type="date"
                                    value={item.deadline.slice(0, 10)}
                                    onChange={(e) => {
                                      const updated = [..._array];
                                      const date = new Date(e.target.value);
                                      date.setUTCHours(21, 0, 0, 0);
                                      updated[item.orderNumber - 1].deadline =
                                        date.toISOString();
                                      _setArray(updated);
                                    }}
                                  />
                                </td>

                                <td className={classes.deleteTableColumn}>
                                  {nameTable !== "Продукт" && (
                                    <img
                                      src={deleteGrey}
                                      alt="deleteGrey"
                                      onClick={() =>
                                        deleteRow(item.type, item.id)
                                      }
                                    />
                                  )}
                                </td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <td
                              {...provided.dragHandleProps}
                              className={classes.numberTableColumn1}
                            >
                              {lengthReceived + index + 1}
                            </td>

                            <td className={classes.nameTableColumn1}>
                              <input
                                type="text"
                                value={item.content}
                                onChange={(e) => {
                                  const updated = [..._array];
                                  updated[index].content = e.target.value;
                                  _setArray(updated);
                                }}
                              />
                            </td>

                            <td className={classes.imageTableColumn}>
                              <select
                                name="mySelect"
                                value={item.holderUserId}
                                onChange={(e) => {
                                  const updated = [..._array];
                                  updated[index].holderUserId = e.target.value;
                                  _setArray(updated);
                                }}
                                className={classes.select}
                              >
                                <option value="">Выберите сотрудника</option>
                                {workers.map((item) => {
                                  return (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                    >{`${item.firstName} ${item.lastName} `}</option>
                                  );
                                })}
                              </select>
                            </td>

                            <td className={classes.dateTableColumn}>
                              <input
                                type="date"
                                value={item.deadline.slice(0, 10)}
                                onChange={(e) => {
                                  const updated = [..._array];
                                  const date = new Date(e.target.value);
                                  date.setUTCHours(21, 0, 0, 0);
                                  updated[index].deadline = date.toISOString();
                                  _setArray(updated);
                                }}
                              />
                            </td>

                            <td className={classes.deleteTableColumn}>
                              {nameTable !== "Продукт" && (
                                <img
                                  src={deleteGrey}
                                  alt="deleteGrey"
                                  onClick={() => deleteRow(item.type, item.id)}
                                />
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </tbody>
    </table>
  );
}
