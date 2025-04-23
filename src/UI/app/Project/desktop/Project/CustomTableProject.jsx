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
    style: { width: "100%" },
    placement: "topLeft",
  };

  const stylesColumnDate = {
    style: { width: "100%" },
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
        scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
        style={{ width: "100%" }}
        expandable={expandableConfig}
      />
    </Form>
  );
}
