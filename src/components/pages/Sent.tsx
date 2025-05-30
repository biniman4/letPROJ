import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

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
      }
    };

    fetchSentLetters();
  }, []);

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
    // TODO: Implement view functionality
    console.log("View letter:", letter);
  };

  const handleDelete = (letter: Letter) => {
    // TODO: Implement delete functionality
    console.log("Delete letter:", letter);
  };

  const filteredLetters = letters.filter(
    (letter) =>
      letter.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sent Letters</h1>
        <div className="flex space-x-4">
          <Input
            placeholder="Search letters..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
          <Select
            placeholder="Filter by status"
            className="w-40"
            suffixIcon={<FilterOutlined />}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="delivered">Delivered</Select.Option>
            <Select.Option value="read">Read</Select.Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredLetters}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </div>
  );
};

export default Sent;
