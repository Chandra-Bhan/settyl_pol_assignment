import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { TextField } from "@mui/material";
import { FaPlus, FaSave } from "react-icons/fa";

function PollEdit() {
  const { id } = useParams();
  const [poll, setPoll] = useState();
  const navigate = useNavigate();
  const [questions, setQuestion] = useState({
    id: uuidv4(),
    question: "",
    error: false,
  });
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), options: "", error: false },
    { id: uuidv4(), options: "", error: false },
  ]);

  const handleQuestion = (id, event) => {
    setQuestion({ id: id, question: event.target.value });
  };

  const handleAddfields = () => {
    setInputFields([
      ...inputFields,
      { id: uuidv4(), options: "", error: false },
    ]);
  };
  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyQuestion = questions.question.trim().length > 0;
    const emptyOptions = inputFields.every((obj) => {
      return obj.options.length > 0;
    });
    if (!emptyQuestion) {
      setQuestion({ ...questions, error: true });
    }
    if (!emptyOptions) {
      setInputFields([
        ...inputFields.map((object) => {
          if (object.options === "") {
            return {
              ...object,
              error: true,
            };
          } else {
            return object;
          }
        }),
      ]);
    } else {
      const data = { question: questions, options: inputFields, pollid: id };
      axios
        .put("https://poll-votting-backend.onrender.com/api/poll", data)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
      localStorage.setItem("polledited", 0);
      navigate("/allpolls");
    }
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });
    setInputFields(newInputFields);
  };

  const getpol = async () => {
    const pollinfo = await axios.get(
      `https://poll-votting-backend.onrender.com/api/poll/${id}`
    );
    setPoll(pollinfo.data);
    setQuestion({ question: pollinfo.data.question });
    let medium = [];
    pollinfo.data.options.map((option) => {
      medium.push(option);
      return medium;
    });
    setInputFields(medium);
    console.log(
      "Hello",
      pollinfo.data.options[0].id,
      pollinfo.data.options[0].options
    );
  };

  useEffect(() => {
    getpol();
  }, []);

  const showError = (value, error) => value.trim().length === 0 && error;

  return (
    <div className="ui-outer">
      <div className="ui-container py-5 px-5">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mx-auto">
            <div className="d-flex justify-content-between flex-column flex-md-row align-items-baseline">
              <div>
                <h3>Edit Poll</h3>
                <p className="mt-4 mb-0 text-large text-secondary font-medium">
                  Edit below fields as you need.
                </p>
              </div>
              <Link to={"/allpolls"}>
                <span className="text-light bg-danger align-self-end font-weight-bold rounded-lg px-4 py-2">
                  Cancel
                </span>
              </Link>
            </div>

            <div className="mt-4">
              <div className="flex flex-column question">
                <label className="mb-3 w-100 font-weight-bold content-text">
                  Poll Question
                </label>
                <TextField
                  {...(showError(questions.question, questions.error) && {
                    ...{
                      error: questions.error,
                      helperText: "Enter the question.",
                    },
                  })}
                  id={questions.id}
                  name="question"
                  multiline={true}
                  rows={3}
                  className="textareastyle question-ui w-100 py-4 rounded-lg px-3 outline-none  border border-gray "
                  placeholder="What's you favorite TV Show?"
                  defaultValue={questions.question}
                  onChange={(event) => handleQuestion(questions.id, event)}
                />
              </div>

              {inputFields.map((inputField, index) => (
                <div className="options mt-2 flex-column" key={inputField.id}>
                  <div className="flex align-items-center mb-3">
                    <div className="flex flex-column">
                      <label className="mb-3 w-100 content-text font-weight-bold">
                        Option {index + 1}
                      </label>
                      <div className="flex align-items-center justify-content-between">
                        <TextField
                          {...(showError(
                            inputField.options,
                            inputField.error
                          ) && {
                            ...{
                              error: inputField.error,
                              helperText: "Enter atleast 2 options",
                            },
                          })}
                          id={inputField.id}
                          name="options"
                          className=" py-3 question-ui rounded-lg px-3 textareastyle inputfield focus-shadow transition-all duration-200 text-gray-700 focus-outline-none  border border-gray-300 focus:shadow-outline"
                          placeholder={"Option" + (index + 1)}
                          defaultValue={inputField.options}
                          onChange={(event) =>
                            handleChangeInput(inputField.id, event)
                          }
                        />
                        <button
                          hidden={inputFields.length === 2}
                          onClick={() => handleRemoveFields(inputField.id)}
                          className=" delete ml-2"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddfields}
                className="px-5 py-3 border-0  bg-dark rounded-lg font-weight-bold flex align-items-center justify-content-between text-white"
              >
                <span className="mr-3">
                  Add another option &nbsp;
                  <FaPlus />
                </span>
              </button>
            </div>
            <div className="flex justify-content-center mt-5 pt-3 ">
              <button
                type="submit"
                className="px-5 py-3 bg-success border-0 text-white font-weight-bold rounded-lg"
              >
                <FaSave /> &nbsp; Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PollEdit;
