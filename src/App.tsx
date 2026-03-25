import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addData,
  deleteData,
  getData,
  editData,
  addImage,
  deleteImg,
  completeData,
} from "./counter/counterSlice";
import { useForm } from "react-hook-form";
import {
  Modal,
  Card,
  Button,
  Checkbox,
  Upload,
  Row,
  Col,
  Image,
  Space,
} from "antd";

let apiImg = "http://37.27.29.18:8001/images";

const App = () => {
  const [idx, setIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (e) => {
    if (e) {
      setIdx(e);
      reset({
        name: e.name,
        description: e.description,
      });
    } else {
      setIdx(null);
      reset({
        name: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getData());
  }, []);

  const { register, handleSubmit, reset } = useForm();

  const Submit = async (values: any) => {
    if (idx) {
      await dispatch(
        editData({
          id: (idx as any).id,
          updateUser: values,
        }) as any,
      );
    } else {
      await dispatch(
        addData({ ...values, images: Array.from(values.images || []) }) as any,
      );
    }
    dispatch(getData() as any);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={() => showModal(null)}>
        Add New
      </Button>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {data?.map((e) => (
          <Col span={6} key={e.id}>
            <Card
              title={e.name}
              extra={
                <Checkbox
                  checked={e.isCompleted}
                  onChange={async () => {
                    await dispatch(completeData(e.id) as any);
                    dispatch(getData() as any);
                  }}
                >
                  {e.isCompleted ? "Active" : "Inactive"}
                </Checkbox>
              }
              actions={[
                <Button
                  danger
                  onClick={() => dispatch(deleteData(e.id) as any)}
                >
                  Delete
                </Button>,
                <Button onClick={() => showModal(e)}>Edit</Button>,
              ]}
            >
              <p>{e.description}</p>

              <Space wrap>
                {e?.images?.map((img: any) => (
                  <div key={img.id}>
                    <Image width={80} src={`${apiImg}/${img.imageName}`} />
                    <Button
                      danger
                      size="small"
                      onClick={async () => {
                        await dispatch(deleteImg(img.id) as any);
                        dispatch(getData() as any);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </Space>

              <Upload
                multiple
                showUploadList={false}
                beforeUpload={() => false}
                onChange={async (info) => {
                  const files = info.fileList.map((f) => f.originFileObj);
                  await dispatch(addImage({ id: e.id, images: files }) as any);
                  dispatch(getData() as any);
                }}
              >
                <Button style={{ marginTop: "10px" }}>Add Image</Button>
              </Upload>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Form"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(Submit)}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <input placeholder="Name" {...register("name")} />
            <input placeholder="Description" {...register("description")} />
            <input
              {...register("images", { required: !idx })}
              multiple
              type="file"
            />
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </form>
      </Modal>
    </div>
  );
};

export default App;
