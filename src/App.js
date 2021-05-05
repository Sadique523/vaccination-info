import { useState, useEffect } from "react";
import { Select, Table, DatePicker, Space } from "antd";
import "./styles.css";
const { Option } = Select;

export default function App() {
  // const [date, setDate] = useState(Date.now());
  const [district, setDistrict] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sessions, setSessions] = useState();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    }
  ];
  useEffect(() => {
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((res) => res.json())
      .then((res) => setStates(res.states));
  }, []);

  const getDistrict = (val) => {
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${val}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setDistricts(res.districts);
      });
  };

  const findAvailability = (date) => {
    fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.sessions.map(({ date, fee, name }, i) => {
          return {
            key: i,
            date,
            fee,
            name
          };
        });
        setSessions(data);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexBasis: "400px",
          textAlign: "center"
        }}
      >
        <h1>Vaccination Info</h1>
        <div style={{ display: "flex", flexDirection: "column", margin: 20 }}>
          <Select
            style={{ margin: "10px 0px" }}
            defaultValue="Select State"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            onChange={(val) => getDistrict(val)}
          >
            {states.map(({ state_name, state_id }) => {
              return <Option key={state_id} value={state_id}>{state_name}</Option>;
            })}
          </Select>
          <Select
            style={{ marginBottom: "10px" }}
            defaultValue="Select District"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            onChange={(val) => setDistrict(val)}
          >
            {districts.map(({ district_name, district_id }) => {
              return <Option key={district_id} value={district_id}>{district_name}</Option>;
            })}
          </Select>
          <Space style={{ width: "100%" }} direction="vertical">
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => {
                console.log(date, dateString);
                findAvailability(dateString);
              }}
            />
          </Space>
          ,
        </div>
        <Table dataSource={sessions} columns={columns} />
      </div>
    </div>
  );
}
