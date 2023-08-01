import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllPolls() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const getData = async () => {
    const res = await axios.get("http://localhost:5000/api/poll");
    console.log(res.data);
    // setDataChange(!dataChange);
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <h1>All Polls</h1>

      <table
        className="table w-65 mt-5 table-hover table-striped"
        style={{ border: "2px solid", margin: "auto" }}
      >
        <thead>
          <tr>
            <th>Polls</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((poll) => (
              <tr key={poll._id}>
                <td>{poll.question}</td>
                <td>
                  <button
                    className="btn btn-danger ps-5 pe-5 view-button"
                    onClick={() => navigate(`/poll/${poll.pollid}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={{ textAlign: "center" }}>No record or Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllPolls;
