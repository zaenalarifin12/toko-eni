import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Table, Popconfirm, message, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import numeral from "numeral";

const ProductList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const formEdit = useRef(null);

  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Harga (Beli)",
      dataIndex: "price_buy",
      key: "price_buy",
      render: (text) => `Rp. ${numeral(text).format("0,0")}`,
    },
    {
      title: "Harga (Jual)",
      dataIndex: "price_sell",
      key: "price_sell",
      render: (text) => `Rp. ${numeral(text).format("0,0")}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Popconfirm
            title="yakin menghapus barang ini ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{ marginRight: 16 }}>Hapus</a>
          </Popconfirm>
          <a onClick={() => handleEdit(record)}>Edit</a>
        </span>
      ),
    },
  ];

  const getProducts = () => {
    setLoading(true);
    axios
      .get("http://toko-eni-be.arifinweb3.club/public/api/products")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to retrieve products");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://toko-eni-be.arifinweb3.club/public/api/products/${id}`)
      .then((res) => {
        message.success("Barang berhasil dihapus");
        getProducts();
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete product");
        setLoading(false);
      });
  };

  const handleEdit = (record) => {
    form.resetFields();

    console.log(record);
    setSelectedProduct(record);

    form.setFieldsValue({
      name: record.name,
      price_sell: record.price_sell,
      price_buy: record.price_buy,
      stock: record.stock,
    });
    setEditModalVisible(true);
  };

  const handleSubmit = (values) => {
    setLoading(true);
    axios
      .post("http://toko-eni-be.arifinweb3.club/public/api/products", values)
      .then((res) => {
        message.success("Barang berhasil ditambahkan");
        form.resetFields();
        getProducts();
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to add product");
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoading(true);

    console.log(form.getFieldsValue(), "asas");
    axios
      .put(
        `http://toko-eni-be.arifinweb3.club/public/api/products/${selectedProduct.id}`,
        form.getFieldsValue()
      )
      .then((res) => {
        message.success("Barang berhasil diedit");
        form.resetFields();
        setEditModalVisible(false);
        getProducts();
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to update product");
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredData = data.filter((item) => {
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter the Nama barang" }]}
        >
          <Input size="large" placeholder="Nama barang" />
        </Form.Item>

        <Form.Item
          name="price_buy"
          rules={[{ required: true, message: "Please enter the Harga Beli" }]}
        >
          <Input type="number" placeholder="Harga Beli" />
        </Form.Item>
        <Form.Item
          name="price_sell"
          rules={[{ required: true, message: "Please enter the Harga Jual" }]}
        >
          <Input type="number" size="large" placeholder="Harga Jual" />
        </Form.Item>
        <Form.Item
          name="stock"
          rules={[
            { required: true, message: "Please enter the Per Bendel/Pack" },
          ]}
        >
          <Input type="number" placeholder="Per Bendel/Pack" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tambah Barang
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Edit Barang"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          form.resetFields();

          setEditModalVisible(false);
        }}
      >
        <Form form={form} onFinish={handleUpdate}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter the Nama Barang" },
            ]}
          >
            <Input placeholder="Nama Barang" size="large" />
          </Form.Item>
          <Form.Item
            name="price_buy"
            rules={[{ required: true, message: "Please enter the Harga Beli" }]}
          >
            <Input placeholder="Harga Beli" size="large" />
          </Form.Item>

          <Form.Item
            name="price_sell"
            rules={[{ required: true, message: "Please enter the Harga Jual" }]}
          >
            <Input placeholder="Harga Jual" size="large" />
          </Form.Item>
          <Form.Item
            name="stock"
            rules={[
              { required: true, message: "Please enter the Per Bendel/Pack" },
            ]}
          >
            <Input placeholder="Per Bendel/Pack" />
          </Form.Item>
        </Form>
      </Modal>

      <br />
      <br />
      <Input
        placeholder="Cari Barang"
        value={searchValue}
        onChange={handleSearch}
        style={{ width: 200, marginBottom: 20 }}
        size="large"
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 20 }}
      />
    </>
  );
};

export default ProductList;
