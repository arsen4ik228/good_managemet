import TextArea from "antd/es/input/TextArea";

export default function TextAreaRdx({ style, ...props }) {
  return (
    <TextArea
      style={{
        resize: "none",
        border: "none",
        outline: "none",
        boxShadow: "none",
        ...style,
      }}
      { ...props }
    />
  )
}
