import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addData, deleteData, editData, getData } from "./counter/counterSlice";
import { Modal, Table, Button, Input, Select, Space, Tag } from "antd";

const { Option } = Select;

const App = () => {
  const [idx, setIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (e) => {
    if (e) {
      setIdx(e);
      reset({
        name: e.name,
        age: e.age,
        status: e.status,
      });
    } else {
      setIdx(null);
      reset({
        name: "",
        age: "",
        status: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  interface IData {
    name: string;
    age: number;
    status: boolean;
    id: number;
  }

  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.counter);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const Submit = (value) => {
    if (idx) {
      dispatch(editData({ id: idx.id, updatedUser: value }));
      handleCancel();
    } else {
      dispatch(addData(value));
      handleCancel();
    }
  };

  useEffect(() => {
    dispatch(getData());
  }, []);

  const columns = [
    {
      title: "Image",
      render: () => (
        <img
          style={{ width: 60, borderRadius: 8 }}
          src="https://img.freepik.com/free-photo/young-male-posing-isolated-against-blank-studio-wall_273609-12356.jpg?semt=ais_hybrid&w=740&q=80"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      render: (e) => (
        <Tag color={e.status ? "green" : "red"}>
          {e.status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (e) => (
        <Space>
          <Button onClick={() => showModal(e)} type="primary">
            Edit
          </Button>
          <Button danger onClick={() => dispatch(deleteData(e.id))}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => showModal(null)}>
          ADD
        </Button>
        <Input
          placeholder="Search"
          onChange={(e) => dispatch(getData({ search: e.target.value }))}
        />
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={(value) => dispatch(getData({ select: value }))}
        >
          <Option value="all">All</Option>
          <Option value="true">Active</Option>
          <Option value="false">Inactive</Option>
        </Select>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(Submit)}>
          <Input placeholder="Name" {...register("name")} />
          <Input
            style={{ marginTop: 10 }}
            placeholder="Age"
            type="number"
            {...register("age")}
          />
          <Select
            style={{ width: "100%", marginTop: 10 }}
            {...register("status")}
          >
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>
          <Button
            style={{ marginTop: 15 }}
            type="primary"
            htmlType="submit"
            block
          >
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default App;
