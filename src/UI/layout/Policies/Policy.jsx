import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import classes from "./Policy.module.css"

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Mdxeditor from "@Custom/Mdxeditor/Mdxeditor.jsx";
import { homeUrl } from '@helpers/constants'
import { usePanelPreset, useRightPanel, useGetSinglePolicy, useModuleActions } from '@hooks';


export default function Policy() {
  const { policyId } = useParams();

  const { PRESETS } = useRightPanel();

  usePanelPreset(PRESETS["POLICIES"]);

 const { buttonsArr } = useModuleActions("policy", policyId);

  const {
    refetch,
    currentPolicy,
  } = useGetSinglePolicy({
    policyId: policyId,
  });


  useEffect(() => {
    const channel = new BroadcastChannel("policy_channel");

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
    <MainContentContainer buttons={buttonsArr} >

      <div className={classes.main}>

        {currentPolicy.content ?
          <Mdxeditor
            key={currentPolicy.id + "-" + currentPolicy.updatedAt}
            editorState={currentPolicy.content}
            readOnly={true}
            policyName={currentPolicy.policyName}
            policyNumber={currentPolicy.policyNumber}
            policyDate={currentPolicy.createdAt}
            policyType={(currentPolicy.type).toUpperCase()}
          ></Mdxeditor>
          : null
        }

      </div>

    </MainContentContainer>

  )
}
