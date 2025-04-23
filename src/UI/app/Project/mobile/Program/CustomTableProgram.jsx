import React from "react";

import { Table, Form } from "antd";

import { createStyles } from "antd-style";

import useCustomTableProgram from "../../componentLogic/useCustomTableProgram";

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

export default function CustomTableProgram({
  expandedRowKeys,
  setExpandedRowKeys,
  form,
  selectedProgramId,
  targetStateOnProduct,
  setTargetStateOnProduct,

  disabledTable,
  tables,
  setTables,
  isLoadingGetProjectId,
  isFetchingGetProjectId,
  targets,
  currentProjects,
  posts,
  projects,
  selectedProjectIds,
  setSelectedProjectIds,
  setDescriptionProgram,
  descriptionProgram,
}) {
  const { styles } = useStyle();

  const stylesColumnProjectPopconfim = {
    transitionName: "",
    placement: "bottomLeft",
    overlayStyle: {
      transform: "rotate(90deg)",
      transformOrigin: "left top",
      height: "200px",
      width: "200px",
      overflow: "hidden",
    },
  };

  const stylesColumnProjectSelect = {
    transitionName: "",
    style: { width: "180px" },
    dropdownStyle: {
      width: "150px",
      height: "145px",
      transform: "rotate(90deg)",
      overflow: "auto",
    },
  };

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
    useCustomTableProgram({
      expandedRowKeys,
      setExpandedRowKeys,
      form,
      selectedProgramId,
      targetStateOnProduct,
      setTargetStateOnProduct,

      disabledTable,
      tables,
      setTables,
      isLoadingGetProjectId,
      isFetchingGetProjectId,
      targets,
      currentProjects,
      posts,
      projects,
      selectedProjectIds,
      setSelectedProjectIds,
      setDescriptionProgram,
      descriptionProgram,

      stylesColumnProjectPopconfim,
      stylesColumnProjectSelect,
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
