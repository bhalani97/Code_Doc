import React from "react";

import { Form, Input, Button, Checkbox } from "antd";
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 5,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const ProjectPathForm = (props) => {
 

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
    //   {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={props.onFinish}
      onFinishFailed={onFinishFailed}
    >
        <span>

      <Form.Item
      style={{float:"left"}}
        label="Your main file"
        name="starts"
        rules={[
          {
            required: true,
            message: "Cant be blank!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dir"
        name="path"
      style={{float:"left"}}

        rules={[
          {
            required: true,
            message: "Please input your Directory!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
    //   {...tailLayout}
      style={{float:"left"}} 
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </span>

    </Form>
  );
};

export default ProjectPathForm;
