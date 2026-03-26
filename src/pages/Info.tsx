import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { apiImg } from "../counter/counterSlice";
import { Button, Tag, Typography, Divider, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const Info = () => {
  const { id } = useParams();
  const { data } = useSelector((state: any) => state.counter);
  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Link to="/">
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
          Back
        </Button>
      </Link>
      {data?.map(
        (e: any) =>
          e.id == id && (
            <div key={e.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Title level={3} style={{ margin: 0 }}>{e.name}</Title>
                <Tag color={e.isCompleted ? "green" : "red"}>
                  {e.isCompleted ? "Active" : "Inactive"}
                </Tag>
              </div>
              <Divider />
              <Text type="secondary">Description</Text>
              <Paragraph style={{ marginTop: 4 }}>{e.description}</Paragraph>
              {e.images?.length > 0 && (
                <>
                  <Divider />
                  <Text type="secondary">Images</Text>
                  <Space wrap style={{ marginTop: 12 }}>
                    {e.images.map((img: any) => (
                      <img
                        key={img.id}
                        src={`${apiImg}/${img.imageName}`}
                        alt=""
                        width={150}
                        height={150}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    ))}
                  </Space>
                </>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default Info;
