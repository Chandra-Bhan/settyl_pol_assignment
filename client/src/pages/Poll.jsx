import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "../components/Notification";
import { FaChevronRight } from "react-icons/fa";

function Poll() {
  const { id } = useParams();
  const [poll, setPoll] = useState();
  const [response, setResponse] = useState({
    id: "",
    options: "",
    count: 0,
  });

  const [toast, setToast] = useState({
    snackbaropen: false,
    msg: "",
    not: "",
  });
  const [verifier, setVerifier] = useState({ id: "", selected: "", show: 0 });
  const [localkey, setLocalkey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLocalkey(
      poll
        ? poll.question.toLowerCase().trim().slice(0, 2)
        : "no" + id.slice(0, 4)
    );
    let cache = JSON.parse(localStorage.getItem(localkey));
  });

  const snackbarclose = (event) => {
    setToast({ snackbaropen: false });
  };

  const getpol = async () => {
    const pollinfo = await axios.get(`http://localhost:5000/api/poll/${id}`);
    setPoll(pollinfo.data);
    console.log(
      "Hello",
      pollinfo.data.options[0].id,
      pollinfo.data.options[0].options
    );
  };

  const settingResponse = ({ option }) => {
    setResponse({
      id: option.id,
      options: option.options,
      count: option.count + 1,
      pollid: id,
    });
    setVerifier({ id: id, selected: option.options, show: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.options.length > 0) {
      setToast({
        snackbaropen: true,
        msg: "Thankyou for your vote!, vote submitted!",
        not: "success",
      });
      localStorage.setItem(localkey, [JSON.stringify(verifier)]);
      axios
        .post("http://localhost:5000/submitresponse", response)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      navigate(`/poll-result/${id}`);
    } else {
      setToast({
        snackbaropen: true,
        msg: "Please, select a option!",
        not: "error",
      });
    }
  };

  useEffect(() => {
    getpol();
  }, []);

  return (
    <div className="ui-outer">
      <div className="ui-container py-5 px-5">
        <div>
          <h2 className="mb-5 w-100 heading" style={{ wordWrap: "break-word" }}>
            {poll && poll.question}
          </h2>
          <div className="flex flex-column w-75 mr-auto ml-auto">
            <form>
              {poll &&
                poll.options.map((option) => (
                  <div
                    className="py-3 w-100 mb-4 shadow-lg hover-zoom px-3 rounded bg-white radio-label"
                    key={option.id}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        id={option.id}
                        name="option"
                        value={option.options}
                        checked={response.options === option.options}
                        onChange={() => settingResponse({ option })}
                        className="d-inline-block ml-3 mr-3"
                      />
                      <label htmlFor={option.id} className="w-100">
                        <h4
                          className="font-weight-bold text-primary-dark d-inline-block"
                          style={{ wordWrap: "break-word", width: "93%" }}
                        >
                          {option.options}
                        </h4>
                      </label>
                    </div>
                  </div>
                ))}
              <Notification
                switcher={toast.snackbaropen}
                close={snackbarclose}
                message={toast.msg}
                nottype={toast.not}
              />
              <div className="mt-5 d-flex flex-column flex-md-row">
                <div className="col-0 col-md-8 d-flex px-0 justify-content-center justify-content-md-start">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="focus-outline-none py-3 font-weight-bold focus-shadow w-50 bg-success border-0 text-white px-2 shadow-lg hover-shadow-lg rounded-lg"
                  >
                    {" "}
                    Submit your vote
                  </button>
                </div>
                <div>
                  <Link to={`/poll-result/${id}`}>
                    <h5 className="display-8 float-right text-secondary font-weight-normal">
                      View Results <FaChevronRight />
                    </h5>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Poll;
