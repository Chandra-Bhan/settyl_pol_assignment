import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";
import Notification from "../components/Notification";
import Slide from "@mui/material/Slide";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  const [questions, setQuestion] = useState({
    id: uuidv4(),
    question: "",
    error: false,
  });

  const [toast, setToast] = useState({
    snackbaropen: false,
    msg: "",
    not: "",
    Transition: Slide,
  });

  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), options: "", error: false },
    { id: uuidv4(), options: "", error: false },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("deletepoll") == 0) {
      setToast({ snackbaropen: true, msg: "Poll deleted!", not: "success" });
      localStorage.removeItem("deletepoll");
    }
  });

  const snackbarclose = (event) => {
    setToast({ snackbaropen: false });
  };

  const showError = (value, error) => value.trim().length === 0 && error;

  const handleQuestion = (id, event) => {
    setQuestion({ id: id, question: event.target.value });
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

  const handleAddfields = () => {
    setInputFields([
      ...inputFields,
      { id: uuidv4(), options: "", error: false },
    ]);
    setToast({ snackbaropen: true, msg: "Added another field!", not: "info" });
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id == id),
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
      const data = { question: questions, options: inputFields };
      console.log(data);
      axios
        .post("https://poll-votting-backend.onrender.com/api/poll", data)
        .then((response) => {
          console.log(response);
          setToast({
            snackbaropen: true,
            msg: "Success, poll submitted!",
            not: "success",
          });
        })
        .catch((error) => console.log(error));
      localStorage.setItem("pollcreated", 0);
      // navigate("/allpolls");
    }
  };

  return (
    <div className="ui-outer">
      <div className="ui-container py-5 px-5">
        <form onSubmit={handleSubmit}>
          <div className="mx-auto">
            <div className="d-flex justify-content-between flex-column flex-md-row align-items-baseline">
              <div>
                <h3>Create Poll</h3>
                <p className="mt-4 mb-0 text-large text-secondary font-medium">
                  Complete below fields to create a poll
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex flex-column">
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
                  className=" w-100 py-4 bg-light rounded-lg px-3 outline-none  border border-gray question-ui"
                  placeholder="What's you favorite TV Show?"
                  value={questions.question}
                  onChange={(event) => handleQuestion(questions.id, event)}
                />
              </div>
              <Notification
                switcher={toast.snackbaropen}
                close={snackbarclose}
                message={toast.msg}
                nottype={toast.not}
              />
              {inputFields.map((inputField, index) => (
                <div key={inputField.id}>
                  <div>
                    <div>
                      <label>Option {index + 1}</label>
                      <div>
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
                          className="py-3 rounded-lg px-3 bg-light inputfield focus-shadow focus-outline-none border question-ui"
                          placeholder={"Option" + (index + 1)}
                          value={inputField.options}
                          onChange={(event) =>
                            handleChangeInput(inputField.id, event)
                          }
                        />
                        <button
                          hidden={inputFields.length === 2}
                          onClick={() => handleRemoveFields(inputField.id)}
                          className="delete ml-2"
                        >
                          <BsFillTrashFill className="text-danger" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddfields}
                className="px-5 py-3 bg-dark rounded-lg mt-3 font-weight-bold border-0 text-white create-poll-btn"
              >
                <span className="mr-3">
                  Add another option
                  <AiOutlinePlus className="ml-2" />
                </span>
              </button>
            </div>
            <div className="mt-5 pt-3">
              <button
                type="submit"
                className="px-5 py-3 bg-success text-white font-weight-bold border-0 rounded-lg create-poll-btn"
              >
                <FaBolt className="mr-2" /> Create your poll
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
