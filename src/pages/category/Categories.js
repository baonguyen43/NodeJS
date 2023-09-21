import React, { useCallback, useEffect, useMemo, useState } from "react";
import CategoryForm from "../../components/CategoryForm";
import { Button, Form, message } from "antd";
import axiosClient from "../../libraries/axiosClient";
import { LOCATIONS } from "constants";
import { useNavigate, useParams } from "react-router-dom";

const MESSAGE_TYPE = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};
export default function CategoryPage() {
  const params = useParams(); 
  const navigate = useNavigate(); 
  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi]
  );

  const onDeleteCategory = useCallback(async () => {
    try {
      const response = await axiosClient.delete(`categories/delete/${params.id}`);

      onShowMessage(response.data.message);

      navigate(LOCATIONS.CATEGORIES);
    } catch (error) {
      console.log('««««« error »»»»»', error);
    }
  }, [navigate, onShowMessage, params.id]);

  const onFinish = useCallback(
    async (values) => {
      try {
        const res = await axiosClient.post("/categories", {
          ...values,
          isDeleted: false,
        });

        setRefresh((preState) => preState + 1);
        createForm.resetFields();

        onShowMessage(res.data.message);
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowMessage(e, MESSAGE_TYPE.ERROR)
          );
        }
      }
    },
    [createForm, onShowMessage]
  );

  const getCategoryData = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/categories/${params.id}`);

      createForm.setFieldsValue(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, [params.id, createForm]);

  const isEditCategory = useMemo(() => !(params.id === 'add'), [params.id]);

  useEffect(() => {
    if (isEditCategory) {
      getCategoryData();
    }
  }, [getCategoryData, isEditCategory, params.id]);

  return (
    <>
      {contextHolder}
      <CategoryForm
        form={createForm}
        onFinish={onFinish}
        formName="add-category-form"
        optionStyle={{
          maxWidth: 650,
          margin: "60px auto",
        }}
      />
      <Button onChange={onDeleteCategory}>Delete</Button>
    </>
  );
}
