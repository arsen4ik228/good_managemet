import React, { useState } from "react";
import classes from "./Input.module.css";
import { Form, Input as InputAnt, Search } from "antd";

export default function Input({
  children,
  name,
  value,
  onChange,
  disabledPole,
  isShowInput,
}) {
  // const [form] = Form.useForm();
  // const [formLayout, setFormLayout] = useState("horizontal");
  // const onFormLayoutChange = ({ layout }) => {
  //   setFormLayout(layout);
  // };

  // const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    // <Form
    //   layout={"horizontal"}
    //   form={form}
    //   initialValues={{
    //     layout: formLayout,
    //   }}
    //   onValuesChange={onFormLayoutChange}
    //   style={{
    //     maxWidth: formLayout === "inline" ? "none" : 600,
    //   }}
    // >
    //   <Form.Item label="Form Layout" name="layout">
    //     <Radio.Group value={formLayout}>
    //       <Radio.Button value="horizontal">Horizontal</Radio.Button>
    //       <Radio.Button value="vertical">Vertical</Radio.Button>
    //       <Radio.Button value="inline">Inline</Radio.Button>
    //     </Radio.Group>
    //   </Form.Item>
    //   <Form.Item label="Field A">
    //     <InputAnt placeholder="input placeholder" />
    //   </Form.Item>
    //   <Form.Item label="Field B">
    //     <InputAnt placeholder="input placeholder" />
    //   </Form.Item>
    //   <Form.Item>
    //     <Button type="primary">Submit</Button>
    //   </Form.Item>
    // </Form>

    // <Form layout={"vertical"}>
    //   <Form.Item label={name} className={classes.customForm}>
    //   <InputAnt placeholder={name} />
    // </Form.Item>
    // </Form>

    // <InputAnt.Search
    //   placeholder="search"
    //   onSearch={onSearch}
    //   style={{
    //     width: 200,
    //   }}
    // />

    <div className={classes.item}>
      <div className={classes.itemName}>
        <span>
          {name} <span style={{ color: "red" }}>*</span>
        </span>
      </div>
      <div className={classes.div}>
        {!isShowInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            title={name}
            className={classes.select}
            disabled={disabledPole}
          ></input>
        )}
        {children}
      </div>
    </div>
  );
}
