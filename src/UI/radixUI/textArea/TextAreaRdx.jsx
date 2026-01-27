import TextArea from "antd/es/input/TextArea";

export default function TextAreaRdx({ style, value, onChange,...props }) {
  return (
    <TextArea
      style={{
        resize: "none",
        border: "none",
        outline: "none",
        boxShadow: "none",
        ...style,
      }}
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
