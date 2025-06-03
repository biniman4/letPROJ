import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Modal, Form } from "antd";
import { SearchOutlined, FilterOutlined, SendOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Letter {
  id: string;
  subject: string;
  recipient: string;
  date: string;
  status: string;
}

const Sent: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [composeVisible, setComposeVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSentLetters = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockData: Letter[] = [
          {
            id: "1",
            subject: "Meeting Request",
            recipient: "John Doe",
            date: "2024-03-20",
            status: "Delivered",
          },
          {
            id: "2",
            subject: "Project Update",
            recipient: "Jane Smith",
            date: "2024-03-19",
            status: "Read",
          },
        ];
        setLetters(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sent letters:", error);
        setLoading(false);
        toast.error("Failed to fetch sent letters.");
      }
    };

    fetchSentLetters();
  }, []);

  // Simulated send letter function
  const handleSendLetter = async (values: { subject: string; recipient: string }) => {
    try {
      // Simulate API call delay
      await new Promise((res) => setTimeout(res, 1000));
      // Simulate success and add to table
      const newLetter: Letter = {
        id: `${Date.now()}`,
        subject: values.subject,
        recipient: values.recipient,
        date: new Date().toISOString().slice(0, 10),
        status: "Delivered",
      };
      setLetters((prev) => [newLetter, ...prev]);
      toast.success("Letter sent successfully!");
      setComposeVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Failed to send the letter.");
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a: Letter, b: Letter) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Recipient",
      dataIndex: "recipient",
      key: "recipient",
      sorter: (a: Letter, b: Letter) => a.recipient.localeCompare(b.recipient),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: Letter, b: Letter) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            status === "Delivered"
              ? "bg-green-100 text-green-800"
              : status === "Read"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Letter) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => handleView(record)}>
            View
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleView = (letter: Letter) => {
    toast.info(`Viewing letter: ${letter.subject}`);
    console.log("View letter:", letter);
  };

  const handleDelete = (letter: Letter) => {
    setLetters((prev) => prev.filter((l) => l.id !== letter.id));
    toast.success("Letter deleted successfully.");
    console.log("Delete letter:", letter);
  };

  const filteredLetters = letters.filter(
    (letter) =>
      (letter.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        letter.recipient.toLowerCase().includes(searchText.toLowerCase())) &&
      (statusFilter === "all" ||
        letter.status.toLowerCase() === statusFilter.toLowerCase())
  );

  return (
    <div className="px-4 py-6 lg:px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Sent Letters</h1>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => setComposeVisible(true)}
            className="w-full sm:w-auto"
          >
            New Letter
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search letters..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            placeholder="Filter by status"
            className="w-full sm:w-40"
            suffixIcon={<FilterOutlined />}
            defaultValue="all"
            onChange={(val) => setStatusFilter(val)}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
            <Select.Option value="Read">Read</Select.Option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredLetters}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            responsive: true,
          }}
          scroll={{ x: 'max-content' }}
          className="min-w-full"
        />
      </div>

      <Modal
        title="Compose New Letter"
        open={composeVisible}
        onCancel={() => setComposeVisible(false)}
        footer={null}
        destroyOnClose
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendLetter}
          className="mt-4"
        >
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter the subject" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Recipient"
            name="recipient"
            rules={[{ required: true, message: "Please enter the recipient" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              block
            >
              Send Letter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sent;