import React from "react";
import { Modal, Input, Button, List, Avatar } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import classes from "./ModalSelectRadio.module.css";

export function ModalSelectRadio({
  nameTable,
  handleSearchValue,
  handleSearchOnChange,
  exit,
  filterArray,
  array,
  arrayItem,
  selectedItemID,
  handleRadioChange,
  save,
}) {
  const dataSource = filterArray.length > 0 ? filterArray : array;

  return (
    <Modal
      title={
        <div className={classes.titleContainer}>
          <span>{nameTable}</span>
        </div>
      }
      visible={true}
      onCancel={exit}
      footer={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={save}>
            Создать
          </Button>
        </div>
      }
      style={{
        padding: "16px 24px",
      }}
      width={700}
      closeIcon={<CloseOutlined />}
    >
      <div className={classes.searchContainer}>
        <Input.Search
          placeholder="Найти"
          value={handleSearchValue}
          onChange={handleSearchOnChange}
          allowClear
          enterButton
        />
      </div>

      <List
        bordered
        className={classes.list}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item
            style={{ marginBottom: "5px", marginTop: "5px" }}
            className={`${classes.listItem} ${
              selectedItemID === item.id ? classes.selectedItem : ""
            }`}
            onClick={() => handleRadioChange(item.id, item)}
          >
            <div className={classes.itemContent}>{item[arrayItem]}</div>
          </List.Item>
        )}
      />
    </Modal>
  );
}
