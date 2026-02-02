import React, { useMemo } from "react";
import classes from "./PoliciesMenu.module.css";

import { Menu } from "antd";

import folder from "@image/folder.svg";
import instruction from "@image/instruction.svg";
import directive from "@image/directive.svg";
import disposal from "@image/disposal.svg";

export default function PoliciesMenu({
    objAllPolicies,
    statePolicy,
    openPolicy,
    seacrhPostsSectionsValue,
}) {
    const objFolder = useMemo(() => {
        const allPolicies = objAllPolicies[statePolicy] || [];

        const filtered = seacrhPostsSectionsValue?.trim()
            ? allPolicies.filter((item) =>
                item?.policyName?.toLowerCase().includes(seacrhPostsSectionsValue.toLowerCase())
            )
            : allPolicies;

        return {
            directives: filtered.filter((item) => item?.type === "Директива"),
            instructions: filtered.filter((item) => item?.type === "Инструкция"),
            disposals: filtered.filter((item) => item?.type === "Распоряжение"),
            all: filtered.filter((item) => item?.type === "Распоряжение" || item?.type === "Инструкция" || item?.type === "Директива")
        };
    }, [objAllPolicies, statePolicy, seacrhPostsSectionsValue]);


    const getPolicyIcon = (type) => {
        switch (type) {
            case "Инструкция":
                return <img src={instruction} alt="instruction" />;
            case "Директива":
                return <img src={directive} alt="directive" />;
            case "Распоряжение":
                return <img src={disposal} alt="disposal" />;
            default:
                return null;
        }
    };

    const menuItems = [
        {
            key: "directives",
            label: <span className={classes.menuLabel}>Директивы</span>,
            icon: <img src={folder} alt="folder" />,
            children: objFolder.directives?.map((item) => ({
                key: `dir-${item.id}`,
                label: <span className={classes.menuLabel}>{item.policyName}</span>,
                icon: getPolicyIcon(item.type),
                onClick: () => openPolicy(item.id),
            })),
        },
        {
            key: "instructions",
            label: <span className={classes.menuLabel}>Инструкции</span>,
            icon: <img src={folder} alt="folder" />,
            children: objFolder.instructions?.map((item) => ({
                key: `instr-${item.id}`,
                label: <span className={classes.menuLabel}>{item.policyName}</span>,
                icon: getPolicyIcon(item.type),
                onClick: () => openPolicy(item.id),
            })),
        },
        {
            key: "disposals",
            label: <span className={classes.menuLabel}>Распоряжения</span>,
            icon: <img src={folder} alt="folder" />,
            children: objFolder.disposals?.map((item) => ({
                key: `disp-${item.id}`,
                label: <span className={classes.menuLabel}>{item.policyName}</span>,
                icon: getPolicyIcon(item.type),
                onClick: () => openPolicy(item.id),
            })),
        },
        {
            key: "all",
            label: <span className={classes.menuLabel}>Общая папка</span>,
            icon: <img src={folder} alt="folder" />,
            children:  objFolder.all?.map((item) => ({
                key: `disp-${item.id}`,
                label: <span className={classes.menuLabel}>{item.policyName}</span>,
                icon: getPolicyIcon(item.type),
                onClick: () => openPolicy(item.id),
            })),
        },
    ];


    console.log(objAllPolicies)

    return (
        <Menu
            mode="inline"
            style={{
                width: "100%",
                background: "transparent",
                borderRight: "none",
            }}
            items={menuItems}
        />
    );
}
