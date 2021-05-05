import { useState, useEffect } from "react";
import { Select, Table, DatePicker, Space, Button, Radio, Input } from "antd";
import "./styles.css";
const { Option } = Select;

export default function App() {
  const [date, setDate] = useState();
  const [pincode, setPincode] = useState();
  const [type, setType] = useState('district');
  const [district, setDistrict] = useState();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [disabled, setDisabled] = useState(true);

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
    },
    {
      title: "Available Capacity",
      dataIndex: "capacity",
      key: "capacity"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    }
  ];
  useEffect(() => {
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((res) => res.json())
      .then((res) => setStates(res.states));
  }, []);

  useEffect(() => {
    if((district && date) || (pincode && date)) {
      setDisabled(false)
    }
  }, [district, date, pincode]);

  const getDistrict = (val) => {
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${val}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setDistricts(res.districts);
      });
  };

  const findAvailability = () => {
    const api = type === 'district' ? `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}` 
    : `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
    fetch(
      api
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.sessions.map(({ date, fee, name, address, available_capacity }, i) => {
          return {
            key: i,
            date,
            fee,
            name,
            address,
            capacity: available_capacity
          };
        });
        console.log(res);
        setSessions(data);
      });
  };

  const getType = () => {
    if(type === 'district') {
      return (
        <>
        <Select
        style={{ margin: "10px 0px", fontSize: 16  }}
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
        style={{ marginBottom: "10px", fontSize: 16 }}
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
      </>
      )
    }
    return (
      <Input style={{ margin: "10px 0px", fontSize: 16 }} value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Enter Pincode" />
    )
   
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexBasis: "600px",
          textAlign: "center"
        }}
      >
        <h1 style={{color: 'hotpink'}}>Vaccination Info</h1>
        <div style={{ display: "flex", flexDirection: "column", margin: 20 }}>
        <Radio.Group
          options={[
            { label: 'District', value: 'district' },
            { label: 'Pincode', value: 'pincode' },
          ]}
          onChange={(e) => setType(e.target.value)}
          value={type}
          optionType="button"
          buttonStyle="solid"
        />
        {getType()}
          <Space style={{ marginBottom: "20px" }} direction="vertical">
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => {
                setDate(dateString);
              }}
            />
          </Space>
          <Button disabled={disabled} onClick={findAvailability} style={{background: 'hotpink', border: '1px solid tomato'}} type="primary" block>
            Find Slots
          </Button>
        </div>
        <div style={{ overflow: 'auto'}}>
         { sessions.length ?  <Table style={{maxWidth: '300px'}} dataSource={sessions} columns={columns} /> : 'No Slots avaiable'}
         
        </div>
      </div>
    </div>
  );
}
