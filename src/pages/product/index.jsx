import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  message,
  Alert,
  Popconfirm,
  Space,
  Modal,
  Pagination,
  Typography,
  Breadcrumb
} from 'antd';
import numeral from 'numeral';
import 'numeral/locales/vi';
import { DeleteOutlined, EditOutlined, SearchOutlined  } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import axiosClient from '../../libraries/axiosClient';
import ProductForm from '../../components/ProductForm';
import Search from 'antd/es/input/Search';
import CategoryForm from 'components/CategoryForm';
import SupplierForm from 'components/SupplierForm';

const {Text} = Typography;  
const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};
numeral.locale('vi');

const DEFAULT_LIMIT = 5; 

export default function Products() {
  // const [searchParameter, setSearchParameter] = React.useState();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: DEFAULT_LIMIT,
  });

  const [products, setProducts] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [refresh, setRefresh] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [updateForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onSelectProduct = useCallback(
    (data) => () => {
      setEditModalVisible(true);
      setSelectedProduct(data);
      updateForm.setFieldsValue(data);
    },
    [updateForm],
  );

  // const onFinish = useCallback(
  //   async (values) => {
  //     try {
  //       const res = await axiosClient.post('/products', values);

  //       setRefresh((preState) => preState + 1);
  //       createForm.resetFields();

  //       // onShowMessage('Thêm sản phẩm thành công');
  //       onShowMessage(res.data.message);
  //       // setRefresh(refresh + 1);

  //       // CASE 1
  //       // const newItem = res.data.payload;

  //       // setProducts((preState) => ([
  //       //   ...preState,
  //       //   newItem,
  //       // ]))
  //     } catch (error) {
  //       if (error?.response?.data?.errors) {
  //         error.response.data.errors.map((e) =>
  //           onShowMessage(e, MESSAGE_TYPE.ERROR),
  //         );
  //       }
  //     }
  //   },
  //   [createForm, onShowMessage],
  // );

 

  const onDeleteProduct = useCallback(
    (productId) => async () => {
      try {
        const response = await axiosClient.patch(`products/delete/${productId}`);
        onShowMessage(response.data.message);
        setRefresh((prevState) => prevState + 1);
      } catch (error) {
        console.log('««««« error »»»»»', error);
      }
    },
    [onShowMessage],
  );

  const onEditFinish = useCallback(
    async (values) => {
      try {
        const response = await axiosClient.put(
          `products/${selectedProduct._id}`,
          values,
        );
        updateForm.resetFields();
        setEditModalVisible(false);
        onShowMessage(response.data.message);
        // setRefresh((prevState) => prevState + 1);
        const newList = products.map((item)=>{
          if(item._id === selectedProduct._id) {
            return{
              ...item, 
              ...values, 
            }
          } 
          return item;
        })
        setProducts(newList)
      } catch (error) {
        console.log('Nguyenne error Nguyenne', error);
      }
    },
    [onShowMessage, selectedProduct?._id, updateForm, products],
  );

  const columns = [
    //COde 
    {
      title: 'No',
      dataIndex: 'No',
      key: 'no',
      width: '1%',

      render: function (text, record, index) {
        return <span>{(index + 1) + (pagination.pageSize * (pagination.page - 1))}</span>;
      },
    },
    // product Name 
    {
      title: 'Tên SP',
      dataIndex: 'name',
      key: 'name',
      sorter: (a,b) => a.name.localeCompare(b.name), 
      render: function (text, record) {
      return <Link  to={`/products/${record._id}`}>{text}</Link>;
      },
    },
    //Supplier 
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplierName',
      filters: [
        { text: 'Nike', value: 'Nike' },
        { text: 'Sports For Men', value: 'Sports For Men' },
      ],
      render: function (text, record) {
        return (
          <Link to={`suppliers/${record.supplier?._id}`}>
            {record.supplier?.name}
          </Link>
        ); // record.supplier && record.supplier._id
      },
    },
      //Category 
    {
      title: 'Danh mục sản phẩm',
      dataIndex: 'category',
      key: 'categoryName',
      render: function (text, record) {
        return (
          <Link to={`categories/${record.category?._id}`}>
            {record.category?.name}
          </Link>
        );
      },
    },
    //Price
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
      sorter: (a,b) => a.price - b.price, 
      render: function (text) {
        return  <Text delete>{numeral(text).format('0,0$')}</Text>;
      },
      width: 100,
    },
    //Discount
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      sorter: (a,b) => a.discount - b.discount, 
      render: function (text) {
        return <strong>{`${text}%`}</strong>;
      },
    },
    //Stock
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a,b) => a.stock - b.stock, 
      render: function (text) {
        return <i>{numeral(text).format('0,0')}</i>;
      },
    },
    //purchase price 
    {
      
      title: 'Giá bán',
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      sorter: (a,b) => a.discountedPrice - b.discountedPrice, 
      render: function (text, record, index) {
        const discountedPrice = record.price * (100 - record.discount) / 100;
        return <strong>{numeral(discountedPrice).format('0,0$')}</strong>;
      },
    },
    //description
    {
      title: 'Mô tả',
      key: 'description',
      dataIndex: 'description',
    },
    //action
    {
      title: 'Hành động',
      key: 'actions',
      width: '1%',
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={onSelectProduct(record)}
            />

            <Popconfirm
              title="Are you sure to delete?"
              okText="Đồng ý"
              cancelText="Đóng"
              onConfirm={onDeleteProduct(record._id)}
            >
              <Button danger type="dashed" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const getSuppliers = useCallback(async () => {
    try {
      const res = await axiosClient.get('/suppliers');
      setSuppliers(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data.payload || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/products?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      setProducts(res.data.payload);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
      }))
    } catch (error) {
      console.log(error);
    }
  }, [pagination.page, pagination.pageSize]);

  const onChangePage = useCallback((page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    getSuppliers();

    getCategories();
  }, [getCategories, getSuppliers]);

  useEffect(() => {
    getProducts();
  }, [getProducts, refresh]);

  return (
    <div style={{width: "1200px", height:"450px",  margin:'auto', paddingTop:'20px' }}> 
    <div >
      {contextHolder}
      <Breadcrumb style={{fontSize: 16, fontWeight: 800}}
        items = {[
          {
            title: <a href='/products/add'> Add Product </a>,
            component: <ProductForm/> 
          },  
          {
            title: <a href='/categories'> Add Category </a>, 
            component: <CategoryForm/> 
          }, 
          {
            title: <a href='/suppliers'>Add Supplier </a>,
            component: <SupplierForm/> 
          },
         
        ]}
      /> 
      <Search 
        placeholder="Tìm kiếm sản phẩm"
        allowClear
        enterButton="Tìm"
        size="large"
      />
       {/* <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button> */}
      {/* <ProductForm
        form={createForm}
        suppliers={suppliers}
        categories={categories}
        onFinish={onFinish}
        formName="add-product-form"
        optionStyle={{
          maxWidth: 900,
          margin: '60px auto',
        }}
      /> */}

        <Table
        rowKey="_id"
        dataSource={products}
        columns={columns}
        // style={{ maxHeight: 77}}
        pagination={false}
      /> 
      

      <Modal
        open={editModalVisible}
        centered
        title="Cập nhật thông tin"
        onCancel={() => {
          setEditModalVisible(false);
        }}
        cancelText="Đóng"
        okText="Lưu"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <ProductForm
          form={updateForm}
          suppliers={suppliers}
          categories={categories}
          onFinish={onEditFinish}
          formName="update-product"
          isHiddenSubmit
        />
      </Modal>
      <Pagination 
        defaultCurrent={1}
        total={pagination.total}
        pageSize={DEFAULT_LIMIT}
        onChange={onChangePage}
        current={pagination.page}
      />
    </div>
   
    </div>
  );
}