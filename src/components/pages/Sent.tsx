import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Modal, Form } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SendOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface Attachment {
  filename: string;
  contentType: string;
  uploadDate: string;
}

interface Letter {
  _id: string;
  subject: string;
  to: string;
  toEmail: string;
  createdAt: string;
  status: string;
  department: string;
  priority: string;
  attachments: Attachment[];
}

const Sent: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [composeVisible, setComposeVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewType, setPreviewType] = useState<string>("");
  const [form] = Form.useForm();
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    fetchSentLetters();
  }, []);

  const fetchSentLetters = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/letters/sent"
      );
      setLetters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sent letters:", error);
      setLoading(false);
      toast.error("Failed to fetch sent letters.");
    }
  };

  const handleDownload = async (letterId: string, filename: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/letters/download/${letterId}/${filename}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleView = async (
    letterId: string,
    filename: string,
    contentType: string
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/letters/view/${letterId}/${filename}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      setPreviewUrl(url);
      setPreviewType(contentType);
      setPreviewVisible(true);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file");
    }
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) =>
        priority.charAt(0).toUpperCase() + priority.slice(1),
    },
    {
      title: "Attachments",
      key: "attachments",
      render: (record: Letter) => (
        <div className="flex gap-2">
          {record.attachments && record.attachments.length > 0 ? (
            record.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-1">
                <PaperClipOutlined className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {attachment.filename}
                </span>
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() =>
                    handleView(
                      record._id,
                      attachment.filename,
                      attachment.contentType
                    )
                  }
                  size="small"
                />
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() =>
                    handleDownload(record._id, attachment.filename)
                  }
                  size="small"
                />
              </div>
            ))
          ) : (
            <span className="text-gray-400">No attachments</span>
          )}
        </div>
      ),
    },
  ];

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      letter.to.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || letter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendLetter = async (values: {
    subject: string;
    recipient: string;
    content: string;
    department: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("to", values.recipient);
      formData.append("content", values.content);
      formData.append("department", values.department);
      formData.append("priority", "normal");

      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await axios.post(
        "http://localhost:5000/api/letters",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLetters((prev) => [response.data.letter, ...prev]);
      toast.success("Letter sent successfully!");
      setComposeVisible(false);
      form.resetFields();
      setAttachment(null);
    } catch (error) {
      console.error("Error sending letter:", error);
      toast.error("Failed to send the letter.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sent Letters</h1>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => setComposeVisible(true)}
        >
          New Letter
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search letters..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-40"
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="sent">Sent</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="read">Read</Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredLetters}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Compose New Letter"
        open={composeVisible}
        onCancel={() => {
          setComposeVisible(false);
          setAttachment(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSendLetter}>
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
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please enter the department" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Attachment">
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {attachment && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PaperClipOutlined />
                  <span>{attachment.name}</span>
                  <Button
                    type="link"
                    danger
                    onClick={removeAttachment}
                    size="small"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
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

      {/* Preview Modal */}
      <Modal
        title="File Preview"
        open={previewVisible}
        onCancel={handlePreviewClose}
        footer={[
          <Button key="close" onClick={handlePreviewClose}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              if (previewUrl) {
                const link = document.createElement("a");
                link.href = previewUrl;
                link.download = "file";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            Download
          </Button>,
        ]}
        width={800}
      >
        <div className="w-full h-[600px] flex items-center justify-center">
          {previewType.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : previewType === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                Preview not available for this file type
              </p>
              <p className="text-sm text-gray-400">
                Please download the file to view it
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Sent;
