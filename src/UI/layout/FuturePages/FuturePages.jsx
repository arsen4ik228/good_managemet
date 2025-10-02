import React from 'react'
import project from './project_primary.svg'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { useParams } from 'react-router-dom';

const arrayPages = [
    {
        id: "academy",
        name: "Академия",
    },
    {
        id: "education",
        name: "Корпоративное обучение",
    },
    {
        id: "CRM",
        name: "CRM",
    },
    {
        id: "bank",
        name: "Банк собственника",
    },
    {
        id: "channel",
        name: "Информационный канал",
    },
    {
        id: "finance",
        name: "Финансовые системы",
    },
];

export function FuturePages() {
  const { pageId } = useParams(); 
  const element = arrayPages.find(item => item.id === pageId);

  return (
    <MainContentContainer>
      <div
        style={{
          width: "630px",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          border: "1px solid #CCCCCC",
          borderRadius: "5px",
          padding: "0 20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={project} alt="project" />

          <div
            style={{
              padding: "15px 0",
              fontWeight: 600,
              fontSize: "20px",
              color: "#333333",
            }}
          >
            {element?.name ?? "Страница не найдена"}
          </div>

          <div
            style={{
              fontWeight: 200,
              fontSize: "14px",
              color: "#333333",
            }}
          >
            Раздел находится в разработке
          </div>
        </div>
      </div>
    </MainContentContainer>
  );
}
