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
            width: "300px",
            height: "175px",
            backgroundColor: organization.organizationColor,
            // boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <DrawerUpdateOrganization
            organizationId={organization.id}
            allOrganizations={allOrganizations}
          ></DrawerUpdateOrganization>

          <Button  data-tour = "click-companyName" type="link" onClick={() => cardClick(organization.id)}>
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