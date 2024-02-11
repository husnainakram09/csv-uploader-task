"use client";
import {
  Spin,
  Table,
  Modal,
  Button,
  Form,
  Input,
  Flex,
  Typography,
  Col,
  Space,
  message,
} from "antd";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { firestore } from "./firebase";
import CSVReader from "react-csv-reader";

interface Props {}

const Dashboard: React.FC<Props> = ({}) => {
  const [form] = Form.useForm();
  const collectionRef = collection(firestore, "students");

  // const [tableColumns, setTableColumns] = useState<any>([]);
  const [snapShotStudent, setSnapShotsStudent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  // const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collectionRef);
      const students: any = [];

      querySnapshot.forEach((doc) => {
        students.push({ ...doc.data(), id: doc.id });
      });

      setSnapShotsStudent(students);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  const handleCSVUpload = async (data: any) => {
    console.log(data);
    setLoading(true);
    if (data.length > 0) {
      const keys = data[0];
      const studentObjects: any = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const student: any = {};

        for (let j = 0; j < keys.length; j++) {
          student[keys[j]] = row[j];
        }

        studentObjects.push(student);
      }

      try {
        const promises = studentObjects.map((object: any) =>
          addDoc(collectionRef, object)
        );
        await Promise.all(promises);
        messageApi.open({
          type: "success",
          content: "Documents uploaded successfully",
        });
        // console.log("Documents uploaded successfully");
      } catch (error) {
        console.error("Error adding documents: ", error);
      } finally {
        setLoading(false);
        fetchDataFromFirestore();
      }
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const docRef = doc(collectionRef, editingStudent.id);
      await updateDoc(docRef, values);

      setIsModalVisible(false);
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    setLoading(true);
    try {
      const studentDocRef = doc(collectionRef, id);
      await deleteDoc(studentDocRef);
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Roll No",
      dataIndex: "RollNo",
      key: "RollNo",
      width: "150",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: "150",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: "150",
    },
    {
      title: "Course",
      dataIndex: "Course",
      key: "Course",
      width: "150",
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: "150",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "150",
      render: (_: any, student: any) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(student)}>
            Edit
          </Button>{" "}
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(student.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const csvRef = useRef<any>(null);
  return (
    <Flex
      justify="center"
      align="center"
      style={{ flexDirection: "column", height: "100%" }}
      gap={15}
    >
      {contextHolder}
      <Typography.Title style={{ margin: 0 }}>
        Student Dashboard
      </Typography.Title>
      <Space>
        <span style={{ display: "none" }}>
          <CSVReader
            ref={csvRef}
            onFileLoaded={handleCSVUpload}
            parserOptions={{ skipEmptyLines: true }}
            // className="csv-reader"
          />
        </span>
        <Button onClick={() => csvRef.current.click()}>Upload CSV</Button>
      </Space>

      {loading ? (
        <Flex justify="center" align="center" flex={1}>
          <Spin size="large" tip="Uploading..." />
        </Flex>
      ) : (
        <div style={{ padding: "50px" }}>
          <Table dataSource={snapShotStudent} columns={columns} />
        </div>
      )}

      <Modal
        title="Edit Student"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleUpdate(values);
                  form.resetFields();
                })
                .catch((errorInfo) => {
                  console.error("Validation failed:", errorInfo);
                });
            }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Department"
            label="Department"
            rules={[{ required: true, message: "Please enter the Belongs" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Dashboard;
