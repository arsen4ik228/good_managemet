import React, { useRef, useEffect } from "react";
import classes from "./Lupa.module.css";
import subbarSearch from "../../image/subbarSearch.svg";

export default function Lupa({
  setIsOpenSearch,
  isOpenSearch,
  select,

  projects,
  archivesProjects,
  projectsWithProgram,
  archivesProjectsWithProgram,

  programs,
  archivesPrograms,

  array,
  arrayItem
}) {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef}>
      <img
        src={subbarSearch}
        alt="subbarSearch"
        onClick={() => {
          setIsOpenSearch(true);
        }}
      />
      {isOpenSearch && (
        <ul className={classes.ul}>
          {projects?.length !== 0 && projects && (
            <li value="Активные" disabled className={classes.activeText}>
              Активные
            </li>
          )}

          {projects?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item.projectName}
              </li>
            );
          })}

          {archivesProjects?.length !== 0 && archivesProjects && (
            <li value="Завершенные" disabled className={classes.completedText}>
              Завершенные
            </li>
          )}

          {archivesProjects?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                className={classes.li}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
              >
                {item.projectName}
              </li>
            );
          })}

          {projectsWithProgram?.length !== 0 && projectsWithProgram && (
            <li
              value="Проекты с программами"
              disabled
              className={classes.activeText}
            >
              Проекты с программами
            </li>
          )}

          {projectsWithProgram?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item.projectName}
              </li>
            );
          })}

          {archivesProjectsWithProgram?.length !== 0 &&
            archivesProjectsWithProgram && (
              <li
                value="Архивные проекты с программами"
                disabled
                className={classes.completedText}
              >
                Архивные проекты с программами
              </li>
            )}

          {archivesProjectsWithProgram?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item.projectName}
              </li>
            );
          })}

          {programs?.length !== 0 && programs && (
            <li value="Активные" disabled className={classes.activeText}>
              Активные
            </li>
          )}

          {programs?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item.projectName}
              </li>
            );
          })}

          {archivesPrograms?.length !== 0 && archivesPrograms && (
            <li value="Завершенные" disabled className={classes.completedText}>
              Завершенные
            </li>
          )}

          {archivesPrograms?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item.projectName}
              </li>
            );
          })}

          {array?.map((item) => {
            return (
              <li
                key={item.id}
                value={item.id}
                onClick={() => {
                  select(item.id);
                  setIsOpenSearch(false);
                }}
                className={classes.li}
              >
                {item[arrayItem]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
