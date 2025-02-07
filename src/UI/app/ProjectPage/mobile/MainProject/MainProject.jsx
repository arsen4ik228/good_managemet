import React, { useEffect, useState } from "react";
import classes from "./MainProject.module.css";
import Header from "@Custom/Header/Header";
import sublist from "@Custom/icon/icon _ sublist.svg";
import { useNavigate } from "react-router-dom";
import { useProjectsHook } from "@hooks";

export default function MainProject() {
  const navigate = useNavigate();

  const [openProjects, setOpenProjects] = useState(false);
  const [openPrograms, setOpenPrograms] = useState(true);
  const [openArchive, setOpenArchive] = useState(false)
  const [open, setOpen] = useState()

  const activeProgramStyles = {
    color: '#005475',
    textDecoration: 'underline',
    fontWeight: '600'
  }


  const {
    projects,
    archivesProjects,
    programs,
    archivesPrograms,
    projectsWithProgram,
    archivesProjectsWithProgram,
  } = useProjectsHook({IsTypeProgram: false})

  const openProjectsOfProgram = (index) => {
    if (open === index) {
      setOpen(null)
    } else {
      setOpen(index)
    }
  }

  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Программы и Проекты"} create={true} ></Header>
        </>
        <div className={classes.body}>

          <div className={classes.ColumnContainer}>
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenProjects(!openProjects)}
            >
              <div className={classes.ElemTitle}> Проекты</div>
              <img
                src={sublist}
                alt="sublist"
                style={{ transform: openProjects ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openProjects && (
              <div className={classes.ContainerElem1}>
                <ol className={classes.ListOfProjects}>
                  {projects.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.projectName}
                    </li>
                  ))}
                </ol>
                {/* <ol className={classes.ListOfProjects}>
                  {projectsWithProgram.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.projectName}
                    </li>
                  ))}
                </ol> */}
              </div>
            )}
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenPrograms(!openPrograms)}
            >
              <div className={classes.ElemTitle}>Программы</div>
              <img
                src={sublist}
                alt="sublist"
                style={{ transform: openPrograms ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openPrograms && (
              <div className={classes.ContainerElem1}>
                <ol className={classes.ListOfProjects}>
                  {programs.map((item, index) => (
                    <>
                      <li
                        key={index}
                        className={classes.ProjectListItem}
                        onClick={() => openProjectsOfProgram(index)}
                        style={open === index ? activeProgramStyles : {}}

                      >
                        {item.projectName}
                      </li>
                      {open === index &&
                        (
                          <div className={classes.projectsOfProgram}>
                            <div
                              className={classes.directoryMenu}
                              onClick={() => navigate(`program/${item.id}`)}
                            >
                              <span>Редактировать программу</span>
                              {/* <img src={edit} alt="edit" /> */}
                            </div>
                            <ol className={classes.ListOfProgram}>
                              {/* <li style={{ color: '#005475' }} onClick={() => navigate(`program/${item.id}`)} >Раскрыть программу</li> */}
                              {projectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                <li key={index1} onClick={() => navigate(element.id)}>
                                  {element.projectName}
                                </li>
                              ))}
                            </ol>
                            <ol className={classes.ListOfProgram}>
                              {archivesProjectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                <li key={index1} style={{ color: 'grey' }} onClick={() => navigate(element.id)}>
                                  {element.projectName}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                    </>
                  ))}
                </ol>
              </div>
            )}
            {/* //////////////////////////////////////////// Архив */}
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenArchive(!openArchive)}
            >
              <div className={classes.ElemTitle}>Архив</div>
              <img
                src={sublist}
                alt="sublist"
                style={{ transform: openArchive ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openArchive && (
              <>
                <div className={classes.ContainerElem1}>
                  <ol className={classes.ListOfProjects}>
                    {archivesPrograms.map((item, index) => (
                      <>
                        <li key={index} style={{ color: 'grey' }} className={classes.ProjectListItem} onClick={() => openProjectsOfProgram(index)}>
                          {item.projectName}
                        </li>
                        {open === index &&
                          (
                            <div className={classes.projectsOfProgram}>
                              <div
                                className={classes.directoryMenu}
                                onClick={() => navigate(`program/${item.id}`)}
                              >
                                <span>Редактировать программу</span>
                                {/* <img src={edit} alt="edit" /> */}
                              </div>                              <ol className={classes.ListOfProgram}>
                                {/* <li style={{ color: '#005475' }} onClick={() => navigate(`program/${item.id}`)} >Раскрыть программу</li> */}
                                {archivesProjectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                  <li key={index1} style={{ color: 'grey' }} onClick={() => navigate(element.id)}>
                                    {element.projectName}
                                  </li>
                                ))}
                              </ol>
                              <ol className={classes.ListOfProgram}>
                                {projectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                  <li key={index1} onClick={() => navigate(element.id)}>
                                    {element.projectName}
                                  </li>
                                ))}
                              </ol>

                            </div>
                          )}
                      </>
                    ))}
                  </ol>
                  <ol className={classes.ListOfProjects}>
                    {archivesProjects.map((item, index) => (
                      <li
                        key={index}
                        style={{ color: 'grey' }}
                        className={classes.ProjectListItem}
                        onClick={() => navigate(item.id)}
                      >
                        {item.projectName}
                      </li>
                    ))}
                  </ol>
                  {/* <ol className={classes.ListOfProjects}>
                    {archivesProjectsWithProgram.map((item, index) => (
                      <li
                        key={index}
                        style={{ color: 'grey' }}
                        className={classes.ProjectListItem}
                        onClick={() => navigate(item.id)}
                      >
                        {item.projectName}
                      </li>
                    ))}
                  </ol> */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
