import React from "react";
import { TreeNode } from "react-organizational-chart";
import { Card, Button } from "antd";
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
            width: "150px",
            height: "100px",
            backgroundColor: organization.organizationColor,
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <DrawerUpdateOrganization
            organizationId={organization.id}
            allOrganizations={allOrganizations}
          ></DrawerUpdateOrganization>

          <Button
            type="link"
            onClick={() => cardClick(organization.id)}
            style={{
              display: "block",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {organization.organizationName}
          </Button>
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
