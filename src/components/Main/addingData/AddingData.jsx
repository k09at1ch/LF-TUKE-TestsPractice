/* eslint-disable no-unused-vars */

import { useState } from "react";

export function AddData({ movingDataUp }) {
  const [addedData, setAddedData] = useState(() => {
    if (localStorage.getItem("fileData")) {
      return JSON.parse(localStorage.getItem("fileData"));
    } else {
      return [];
    }
  });
  const addFileHandling = (e) => {
    e.preventDefault();
    const fileInputed = e.target.elements.fileInput;
    const file = fileInputed.files[0];

    const categoryInputed = e.target.elements.categoryText;
    const category = categoryInputed.value;

    if (!file) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      try {
        const jsonData = JSON.parse(fileContent);

        movingDataUp({
          id: Date.now(),
          name: category,
          questionsFile: jsonData,
        });

        //local storage for added data
        setAddedData((prevData) => {
          const updatedData = [
            ...prevData,
            { id: prevData.length, name: category, data: jsonData },
          ];

          localStorage.setItem("fileData", JSON.stringify(updatedData));

          return updatedData;
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.readAsText(file);
  };
  const addindAnswerLength = (e) => {
    e.preventDefault();
    const number = e.target.elements.answerAmount.value;
    localStorage.setItem("answerAmount", number);
    e.target.reset();
  };
  const resetAnswersAmount = () => {
    localStorage.removeItem("answerAmount");
    const inputElement = document.getElementById("1488");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  return (
    <div style={{display: "flex", flexDirection:"row"}}>
      <form onSubmit={addFileHandling}>
        <input accept=".json" name="fileInput" type="file" />
        <input type="text" placeholder="add .json file" name="categoryText" />
        <button type="submit">Add Data</button>
      </form>
      <form action="" onSubmit={addindAnswerLength}>
        <input
          type="number"
          default={4}
          name="answerAmount"
          id="1488"
          placeholder="Input answer amount"
        />
        <button type="submit">Set</button>
      </form>
      <button onClick={resetAnswersAmount}>
        Reset answers amount
      </button>
    </div>
  );
}
