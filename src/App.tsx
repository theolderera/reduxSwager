import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addData,
  addImg,
  apiImg,
  completeData,
  deleteData,
  deleteImg,
  editData,
  getData,
} from "./counter/counterSlice";
import { useDispatch } from "react-redux";
import { Modal, Button, Table, Space, Tag, Popconfirm, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Route, Routes, useNavigate } from "react-router-dom";
import Info from "./pages/Info";

const { Title } = Typography;

interface IImage {
  id: number;
  imageName: string;
}
interface IData {
  id: number;
  isCompleted: boolean;
  images: IImage[];
  name: string;
  description: string;
}
interface IState {
  counter: {
    data: IData[];
    loading: boolean;
    error: string | null;
  };
}
interface IForm {
  name: string;
  description: string;
  isCompleted: boolean;
  images: IImage[];
}

const App = () => {
  const [idx, setIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAddImg, setIsModalOpenAddImg] = useState(false);
  const showModalAddImg = (id) => {
    setIdx(id);
    setIsModalOpenAddImg(true);
  };
  const handleCancelAddImg = () => {
    setIsModalOpenAddImg(false);
  };

  const showModal = (e) => {
    if (e) {
      setIdx(e.id);
      reset({
        name: e.name,
        description: e.description,
        isCompleted: e.isCompleted,
        images: e.images,
      });
    } else {
      setIdx(null);
      reset({
        name: "",
        description: "",
        isCompleted: false,
        images: [],
      });
    }
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  const { data } = useSelector((state: IState) => state.counter);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<IForm>();
  const onSubmit = async (formData: IForm) => {
    if (idx) {
      await dispatch(editData({ id: idx, updateUser: formData }));
    } else {
      await dispatch(addData(formData));
    }
    dispatch(getData());
    handleCancel();
    reset();
  };

  const onSubmitAddImg = async (formData: IForm) => {
    await dispatch(addImg({ id: idx, images: formData.images }));
    dispatch(getData());
    handleCancelAddImg();
    reset();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (val: boolean) => (
        <Tag color={val ? "green" : "red"}>{val ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images: IImage[], record: IData) => (
        <Space wrap>
          {images?.map((el) => (
            <Space key={el.id} direction="vertical" size={2} align="center">
              <img
                width={60}
                height={60}
                src={`${apiImg}/${el.imageName}`}
                alt=""
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <Popconfirm
                title="Delete this image?"
                onConfirm={() => dispatch(deleteImg(el.id))}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" danger type="link">
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          ))}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IData) => (
        <Space>
          <Button size="small" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button size="small" onClick={() => showModalAddImg(record.id)}>
            + Image
          </Button>
          <Button size="small" onClick={() => navigate(`/info/${record.id}`)}>
            Details
          </Button>
          <input
            type="checkbox"
            checked={record.isCompleted}
            onChange={() => dispatch(completeData(record.id))}
          />
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => dispatch(deleteData(record.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Todo Manager</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
                Add New
              </Button>
            </div>

            <Table
              dataSource={data}
              columns={columns}
              rowKey="id"
              bordered
              size="middle"
              pagination={{ pageSize: 8 }}
            />

            <Modal
              title={idx ? "Edit Item" : "Add New Item"}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Space direction="vertical" style={{ width: "100%" }} size={10}>
                  <Input placeholder="Name" {...register("name")} />
                  <Input placeholder="Description" {...register("description")} />
                  <select {...register("isCompleted")} style={{ width: "100%", padding: "6px 8px", border: "1px solid #d9d9d9", borderRadius: 6 }}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <input multiple type="file" {...register("images")} />
                  <Button type="primary" htmlType="submit" block>
                    Save
                  </Button>
                </Space>
              </form>
            </Modal>

            <Modal
              title="Add Image"
              open={isModalOpenAddImg}
              onCancel={handleCancelAddImg}
              footer={null}
            >
              <form onSubmit={handleSubmit(onSubmitAddImg)}>
                <Space direction="vertical" style={{ width: "100%" }} size={10}>
                  <input multiple type="file" {...register("images")} />
                  <Button type="primary" htmlType="submit" block>
                    Upload
                  </Button>
                </Space>
              </form>
            </Modal>
          </div>
        }
      />
      <Route path="/info/:id" element={<Info />} />
    </Routes>
  );
};

export default App;
