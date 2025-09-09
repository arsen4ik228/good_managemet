import React from 'react'
// import classes from './Goal.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { ViewingGoal } from './ViewingGoal'
import { useGoalHook, usePolicyHook } from "@hooks";
import { useNavigate } from 'react-router-dom';


export default function Goal() {

  const navigate = useNavigate()

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

  const test = [
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero labore maiores nisi, iste at dolorum hic provident dicta temporibus similique incidunt quam nemo corrupti libero sunt laborum est repellat?',
  ]

  return (
    <>
      <MainContentContainer
        buttons={buutonsArr}
      >
        <ViewingGoal
          arrGoals={test}
        ></ViewingGoal>
      </MainContentContainer>
    </>
  )
}
