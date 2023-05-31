import axios from "axios";
import React, { useState } from "react";

function FileUploadComponent() {
  const [files, setFiles] = useState([null, null, null]);
  const [values, setValues] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e, index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = e.target.files[0];
    setFiles(updatedFiles);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    const filesArray = Array(3).fill(null);

    files.forEach((file, index) => {
      if (file) {
        formData.append(`files`, file);
        filesArray[index] = file.name;
      }
    });

    // console.log("Client-side files array:", filesArray);

    // Append filesArray to the formData
    formData.append("filesArray", JSON.stringify(filesArray));
    formData.append("values", JSON.stringify(values));


    axios
      .post("http://localhost:8080/api/upload", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Server responded with an error:", err.response.data);
        } else if (err.request) {
          console.log("No response received from the server");
        } else {
          console.log("Error setting up the request", err.message);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span>prefix : </span>
        <input name="prefix" value={values.prefix} onChange={handleChange} />
      </div>
      <div>
        <span>Firstname :</span>
        <input
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
        />
      </div>
      <div>
        <span>Lastname :</span>
        <input
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
        />
      </div>

      <input type="file" onChange={(event) => handleFileChange(event, 0)} />
      <input type="file" onChange={(event) => handleFileChange(event, 1)} />
      <input type="file" onChange={(event) => handleFileChange(event, 2)} />

      <button type="submit">Submit</button>
    </form>
  );
}

export default FileUploadComponent;
