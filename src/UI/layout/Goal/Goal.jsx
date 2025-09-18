import React, { useEffect } from 'react'
// import classes from './Goal.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { ViewingGoal } from './ViewingGoal'
import { useGoalHook, usePolicyHook } from "@hooks";
import { useNavigate } from 'react-router-dom';


export default function Goal() {

  const {
    currentGoal,
    refetch
  } = useGoalHook();

  const buutonsArr = [
    { text: 'Редактировать', click: () => window.open(window.location.origin + '/#/' + 'editGoal', '_blank') }
    // { text: 'Поделиться', click: () => navigate('1') },
    // { text: 'Распечатать', click: () => navigate('1') },
  ]


useEffect(() => {
  const channel = new BroadcastChannel("goal_channel"); 

  const handler = (event) => {
    if (event.data === "updated") {
      refetch(); 
    }
  };

  channel.addEventListener("message", handler);

  return () => {
    channel.removeEventListener("message", handler);
    channel.close(); 
  };
}, [refetch]);


  return (
    <>
      <MainContentContainer
        buttons={buutonsArr}
      >
        <ViewingGoal
          arrGoals={currentGoal.content}
        ></ViewingGoal>
      </MainContentContainer>
    </>
  )
}
