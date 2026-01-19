import React from 'react'
import TextArea from "antd/es/input/TextArea";

export default function TextAreaRdx({ ...props }) {
  return (
    <TextArea
      style={{
        resize: "none",
        border: "none",
        outline: "none",
        boxShadow: "none",
      }}
      { ...props }
    />
  )
}
