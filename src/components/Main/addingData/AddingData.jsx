/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";

export function AddData({ category, movingDataUp }) {
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

        movingDataUp({id: Date.now(), name: category, questionsFile: jsonData });

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

  return (
    <div>
      <form onSubmit={addFileHandling}>
        <input
          accept=".json"
          name="fileInput"
          type="file"
          placeholder="add .json file"
        />
        <input type="text" name="categoryText" />
        <button type="submit">Add Data</button>
      </form>

    </div>
  );
}
