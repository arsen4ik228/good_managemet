import React, { useState, useEffect } from "react";
import classes from "./SchemeСompanies.module.css";

import _ from "lodash";

import { Card } from "antd";
import { Tree, TreeNode } from "react-organizational-chart";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders.jsx";

import Node from "./elementTree/Node.jsx";
import { useAllOrganizations } from "@hooks/Organization/useAllOrganizations.js";
import DrawerCreateOrganization from "../../drawer/drawerForOrganization/DrawerCreateOrganization";

const buildTree = (organizations) => {
  const postMap = {};
  const roots = [];

  // Создаем карту постов
  organizations.forEach((post) => {
    post.children = [];
    postMap[post.id] = post;
  });

  // Строим дерево
  organizations.forEach((post) => {
    if (post.parentOrganizationId === null) {
      roots.push(post);
    } else {
      if (postMap[post.parentOrganizationId]) {
        postMap[post.parentOrganizationId].children.push(post);
      }
    }
  });

  return roots;
};

const OrganizationTree = ({ organizations }) => {
  const tree = buildTree(organizations);
  return (
    <>
      {tree.map((org) => (
        <Node
          key={org.id}
          organization={org}
          allOrganizations={organizations}
          childrenOrg={org.children}
        />
      ))}
    </>
  );
};

export default function SchemeСompanies() {
  const { organizations, isLoadingOrganization, isErrorOrganization } =
    useAllOrganizations();

  const [getOrganizations, setGetOrganizations] = useState([]);
  const [openCreateOrganization, setOpenCreateOrganization] = useState(false);

  const createOrganization = () => {
    setOpenCreateOrganization(true);
  };

  useEffect(() => {
    if (!_.isEqual(getOrganizations, organizations)) {
      setGetOrganizations(_.cloneDeep(organizations));
    }
  }, [organizations]);

  return (
    <div className={classes.dialog}>
      <Headers name={"схема компании"}>
        <BottomHeaders create={createOrganization} />
      </Headers>

      <DrawerCreateOrganization
        open={openCreateOrganization}
        setOpen={setOpenCreateOrganization}
        allOrganizations={organizations}
      ></DrawerCreateOrganization>

      <div className={classes.main}>
        <Tree
          lineWidth={"2px"}
          lineColor={"#ccc"}
          lineBorderRadius={"10px"}
          label={
            <Card
              loading={false}
              style={{
                display: "inline-block",
                width: "300px",
                height: "175px",
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <p>МОЙ БИЗНЕС</p>
              <p>СОБСТВЕННИК</p>
              <p>Иванов Иван</p>
            </Card>
          }
        >
          <OrganizationTree organizations={getOrganizations}></OrganizationTree>
        </Tree>
      </div>
    </div>
  );
}
