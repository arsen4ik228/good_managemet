import React, { useEffect } from 'react'
// import classes from './Goal.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { ViewingGoal } from './ViewingGoal'
import { useGoalHook, usePolicyHook } from "@hooks";
import { useNavigate } from 'react-router-dom';


export default function Goal() {

  const {
    reduxSelectedOrganizationId,

    currentGoal,
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,

    updateGoal,
    isLoadingUpdateGoalMutation,
    isSuccessUpdateGoalMutation,
    isErrorUpdateGoalMutation,
    ErrorUpdateGoalMutation,
    localIsResponseUpdateGoalMutation,

    postGoal,
    isLoadingPostGoalMutation,
    isSuccessPostGoalMutation,
    isErrorPostGoalMutation,
    ErrorPostGoalMutation,
    localIsResponsePostGoalMutation,
  } = useGoalHook();

  const buutonsArr = [
    { text: 'Редактировать', click: () => window.open(window.location.origin + '/#/' + 'editGoal', '_blank') }
    // { text: 'Поделиться', click: () => navigate('1') },
    // { text: 'Распечатать', click: () => navigate('1') },
  ]

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
