import React, { useEffect } from 'react'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { ViewingGoal } from './ViewingGoal'
import { useGoalHook, useModuleActions } from "@hooks";
import { homeUrl } from '@helpers/constants'

export default function Goal() {

  const {
    currentGoal,
    refetch
  } = useGoalHook();


  const { buttonsArr } = useModuleActions("goal");


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
        buttons={buttonsArr}
      >
        <ViewingGoal
          arrGoals={currentGoal.content}
        ></ViewingGoal>
      </MainContentContainer>
    </>
  )
}
