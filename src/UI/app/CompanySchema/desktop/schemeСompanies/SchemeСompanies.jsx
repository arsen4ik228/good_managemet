import React, { useState, useEffect, useRef } from "react";
import classes from "./SchemeСompanies.module.css";

import _ from "lodash";

import { Card } from "antd";
import { Tree, TreeNode } from "react-organizational-chart";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders.jsx";

import Node from "./elementTree/Node.jsx";
import { useAllOrganizations } from "@hooks/Organization/useAllOrganizations.js";
import DrawerCreateOrganization from "../../drawer/drawerForOrganization/DrawerCreateOrganization";

import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";
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

  const [openHint, setOpenHint] = useState(false);
  const refCreate = useRef(null);
  const steps = [
    {
      title: "Создать",
      description: "Нажмите для создания компании",
      target: () => refCreate.current,
    },
    {
      title: "Редактировать",
      description: "Нажмите и отредактируйте",
      target: () => document.querySelector('[data-tour="setting-button"]'),
      disabled: !document.querySelector('[data-tour="setting-button"]'),
    },
    {
      title: "Компания",
      description: "Нажмите для перехода в компанию",
      target: () => document.querySelector('[data-tour="click-companyName"]'),
      disabled: !document.querySelector('[data-tour="click-companyName"]'),
    },
  ].filter((step) => {
    if (step.target.toString().includes("querySelector")) {
      return !step.disabled;
    }
    return true;
  });

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
      <Headers name={"схема компании"} funcActiveHint={() => setOpenHint(true)}>
        <BottomHeaders create={createOrganization} refCreate={refCreate} />
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour
          open={openHint}
          onClose={() => setOpenHint(false)}
          steps={steps}
        />
      </ConfigProvider>

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
            <OrganizationTree
              organizations={getOrganizations}
            ></OrganizationTree>
          }
        />
      </div>
    </div>
  );
}
