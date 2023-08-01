import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import randomColor from "randomcolor";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PollResult() {
  const { id } = useParams();
  const [poll, setPoll] = useState();
  const navigate = useNavigate();
  let totalvotes = 0;

  poll &&
    poll.options.map((option) => {
      return (totalvotes += option.count);
    });

  const getpol = async () => {
    const pollinfo = await axios.get(`http://localhost:5000/api/poll/${id}`);
    setPoll(pollinfo.data);
    console.log(
      "Hello",
      pollinfo.data.options[0].id,
      pollinfo.data.options[0].options
    );
  };

  useEffect(() => {
    getpol();
  }, []);

  const deletePoll = () => {
    localStorage.removeItem(
      poll.question.toLowerCase().trim().slice(0, 2) + id.slice(0, 4)
    );
    const data = { id: id };
    axios
      .post("http://localhost:5000/deletepoll", data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    localStorage.setItem("deletepoll", 0);
    navigate("/");
  };

  return (
    <div className="ui-outer">
      <div className="ui-container py-5 position-relative">
        <div className="d-flex align-items-center mr-4 mr-md-4 justify-content-around justify-content-md-center">
          {totalvotes === 0 ? (
            <Link
              to={`/poll-edit/${id}`}
              className="text-primary-dark p-2 outline-none rounded hover-shadow text-warning border-0 bg-transparent"
              style={{ fontSize: "1.5rem" }}
            >
              <FaPencilAlt />
            </Link>
          ) : null}

          <button
            className="text-primary-dark p-2 outline-none rounded hover-shadow text-danger border-0 bg-transparent"
            style={{ fontSize: "1.5rem" }}
            onClick={() => deletePoll()}
          >
            <FaTrashAlt />
          </button>
        </div>
        <div className="mb-5 mb-md-5 pb-md-0 my-4">
          <h2 className="mb-5 w-100 heading" style={{ wordWrap: "break-word" }}>
            {poll && poll.question}
          </h2>
          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex w-100 col-12 col-md-8 flex-column">
              <div style={{ position: "relative" }}>
                <div>
                  {poll &&
                    poll.options.map((option) => (
                      <div
                        className="py-0 bg-white px-3 rounded-lg shadow-lg position-relative"
                        key={option.id}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "88%" }}
                          >
                            <h2
                              className="font-weight-bold text-primary-dark"
                              style={{ wordWrap: "break-word", width: "80%" }}
                            >
                              {option.options}
                            </h2>
                          </div>
                          <div>
                            <h2 className="font-weight-bold text-primary-dark">
                              {totalvotes === 0
                                ? 0
                                : ((option.count / totalvotes) * 100).toFixed(
                                    0
                                  )}
                              %
                            </h2>
                          </div>
                        </div>
                        <div className="w-100 rounded-lg">
                          <div
                            className="rounded-lg d-block mt-3"
                            style={{
                              width: `${
                                totalvotes === 0
                                  ? 0
                                  : (option.count / totalvotes) * 100
                              }%`,
                              height: "0.5rem",
                              backgroundColor: `${randomColor()}`,
                            }}
                          >
                            &nbsp;
                          </div>
                        </div>
                        <p className="mt-3 text-green">{option.count} Votes</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="d-flex flex-column w-100 col-12 col-md-4 mb-0 rounded-lg">
              <div className="w-100 bg-white d-flex flex-column border-t border-gray-300 border-top-0 rounded-lg self-start px-3 py-3">
                <div className="d-flex flex-column justify-content-between">
                  <div>
                    <p className="font-weight-normal text-secondary text-left mb-0 text-sm lg:text-base">
                      {" "}
                      Total Votes
                    </p>
                    <h3 className="count font-weight-bold text-primary-dark">
                      {totalvotes}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollResult;
