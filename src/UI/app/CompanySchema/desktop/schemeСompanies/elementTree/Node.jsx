import React from "react";
import { TreeNode } from "react-organizational-chart";
import { Card, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import DrawerUpdateOrganization from "../../../drawer/drawerForOrganization/DrawerUpdateOrganization";

export default function Node({ organization, allOrganizations, childrenOrg }) {
  const navigate = useNavigate();
  const cardClick = (organizationId) => {
    navigate(`/pomoshnik/postSchema/${organizationId}`);
  };

  return (
    <TreeNode
      label={
        <Card
          loading={false}
          style={{
            display: "inline-block",
            width: "300px",
            height: "175px",
            backgroundColor: organization.organizationColor,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <DrawerUpdateOrganization
            organizationId={organization.id}
            allOrganizations={allOrganizations}
          />
          <Tooltip
            title={organization.organizationName} // Показывать полное название при наведении
            placement="top" // Позиция подсказки
            mouseEnterDelay={0.3} // Задержка перед появлением (опционально)
          >
            <Button
              data-tour="click-companyName"
              type="link"
              onClick={() => cardClick(organization.id)}
              style={{
                display: "inline-block",
                maxWidth: "250px", // Фиксируем максимальную ширину
                whiteSpace: "nowrap", // Запрещаем перенос текста
                overflow: "hidden", // Скрываем выходящий за границы текст
                textOverflow: "ellipsis", // Добавляем "..." если текст не помещается
              }}
            >
              {organization.organizationName}
            </Button>
          </Tooltip>
        </Card>
      }
    >
      {/* Рекурсивно отображаем дочерние элементы */}
      {childrenOrg && childrenOrg.length > 0
        ? childrenOrg.map((child) => (
            <Node
              key={child.id}
              organization={child}
              allOrganizations={allOrganizations}
              childrenOrg={child.children}
            />
          ))
        : null}
    </TreeNode>
  );
}
