import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import classes from "./Policy.module.css"

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Mdxeditor from "@Custom/Mdxeditor/Mdxeditor.jsx";

import { usePanelPreset, useRightPanel, usePolicyHook } from '@hooks';


export default function Policy() {
  const { policyId } = useParams();

  const { PRESETS } = useRightPanel();

  usePanelPreset(PRESETS["POLICIES"]);

  const buutonsArr = [
    // { text: 'редактировать', click: () => window.open(window.location.origin + '/#/' + 'editPolicy/' + policyId, '_blank') },
  ]

  const [editorState, setEditorState] = useState();

  const {
    currentPolicy,
  } = usePolicyHook({
    policyId: policyId,
  });

  console.log("currentPolicy = ", currentPolicy.content);

  return (
    <MainContentContainer buttons={buutonsArr} >

      <div className={classes.main}>

        {currentPolicy.content ?
          <Mdxeditor
            key={currentPolicy.id}
            editorState={currentPolicy.content}
            setEditorState={setEditorState}
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
