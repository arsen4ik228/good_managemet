import React from "react";

import { Table, Form } from "antd";

import { createStyles } from "antd-style";

import useCustomTableProject from "../../componentLogic/useCustomTableProject";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

export default function CustomTableProject({
  expandedRowKeys,
  setExpandedRowKeys,
  form,
  targetStateOnProduct,

  selectedProjectId,
  disabledTable,
  tables,
  setTables,
  isLoadingGetProjectId,
  isFetchingGetProjectId,
  targets,
  posts,
  setDescriptionProduct,
  descriptionProduct,
}) {
  const { styles } = useStyle();

  const stylesColumnSelect = {
    transitionName: "",
    style: { width: "100px" },
    dropdownStyle: {
      width: "150px",
      height: "145px",
      transform: "rotate(90deg)",
      overflow: "auto",
    },
  };

  const stylesColumnDate = {
    transitionName: "",
    popupStyle: {
      transform: "rotate(90deg)",
      transformOrigin: "left top",
      marginLeft: "40px",
      height: "200px",
      width: "200px",
      overflow: "visible",
      // Для внутреннего содержимого:
      "& .ant-picker-panel": {
        width: "100%",
        height: "100%",
      },
    },
  };

  const { groupColumns, dataWithGroups, expandableConfig } =
    useCustomTableProject({
      expandedRowKeys,
      setExpandedRowKeys,
      form,
      targetStateOnProduct,

      selectedProjectId,
      disabledTable,
      tables,
      setTables,
      isLoadingGetProjectId,
      isFetchingGetProjectId,
      targets,
      posts,
      setDescriptionProduct,
      descriptionProduct,

      stylesColumnSelect,
      stylesColumnDate,
    });

  return (
    <Form form={form} disabled={disabledTable}>
      <Table
        bordered
        className={styles.customTable}
        loading={isLoadingGetProjectId || isFetchingGetProjectId}
        columns={groupColumns}
        dataSource={dataWithGroups}
        rowKey="key"
        pagination={false}
        scroll={{ x: "calc(100vh - 220px)", y: "calc(100vw - 200px)" }}
        style={{ width: "100%" }}
        expandable={expandableConfig}
      />
    </Form>
  );
}
