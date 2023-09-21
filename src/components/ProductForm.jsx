import React, { memo } from 'react';
import { Button, ConfigProvider, Form, Input, InputNumber, Select } from 'antd';

import { convertOptionSelect } from '../utils';

const { Option } = Select;

function ProductForm(props) {
  const {
    isHiddenSubmit,

    formName,

    form,
    optionStyle,
    suppliers,
    categories,

    onFinish,
  } = props;

  return (
    <div style={{textAlign: "center", fontSize: 20, fontWeight:700, marginTop:60}}>
    <Form
      form={form}
      className=""
      name={formName}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={optionStyle}
      onFinish={onFinish}
      initialValues={{
        gender: 'female',
      }}
    >
      

      <Form.Item
        label="Nhà cung cấp"
        name="supplierId"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn nhà cung cấp',
          },
        ]}
      >
        <Select options={convertOptionSelect(suppliers)} />
      </Form.Item>

      <Form.Item
        label="Danh mục sản phẩm"
        name="categoryId"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn danh mục',
          },
        ]}
      >
        <Select options={convertOptionSelect(categories)} />
      </Form.Item>

      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên sản phẩm' },
          { max: 50, message: 'Tối đa 50 ký tự' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Giá gốc"
        name="price"
        rules={[
          {
            type: 'number',
            min: 0,
            message: 'Vui lòng nhập giá gốc từ 0 đến 100',
          },
          { required: true, message: 'Vui lòng nhập giá gốc' },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Chiết khấu (%)"
        name="discount"
        rules={[
          {
            type: 'number',
            min: 0,
            max: 100,
            message: 'Vui lòng nhập giảm giá từ 0 đến 100',
          },
          { required: true, message: 'Vui lòng nhập giảm giá' },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Tồn kho"
        name="stock"
        rules={[
          {
            type: 'number',
            min: 0,
            message: 'Vui lòng nhập tồn kho lớn hơn 0',
          },
          { required: true, message: 'Vui lòng nhập tồn kho' },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input />
      </Form.Item>

      {!isHiddenSubmit && (
        <Form.Item wrapperCol={{  }}>
            <ConfigProvider theme={{ components:{Button:{colorPrimary:"#F81D22", colorPrimaryHover:"#E8D44D"}}}}>
      <Button type="primary" htmlType="submit">
            Submitt
          </Button>
      </ConfigProvider>
        </Form.Item>
      )}
    
    </Form>
    </div>
    
  );
}

export default memo(ProductForm);
