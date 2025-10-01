import React from 'react'
import project from './project.svg'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
export function Project() {

    return (

        <MainContentContainer>
            <div style={{
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
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <img src={project} alt="strategy" />

                    <div
                        style={{
                            padding: "15px 0",
                            fontWeight: 600,
                            fontSize: "20px",
                            color: "#333333",
                        }}
                    >
                        Проекты
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
        </MainContentContainer >
    )
}
