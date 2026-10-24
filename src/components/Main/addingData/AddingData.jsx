/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";

export function AddData({ category }) {
  // const [file, setFile] = useState(null);
  const [addedFiles, setAddedFiles] = useState(() => {
    if (localStorage.getItem("fileData")) {
      return JSON.parse(localStorage.getItem("fileData"));
    } else {
      return [];
    }
  });
  const addFileHandling = (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.fileInput;
    const file = fileInput.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    //додати хрінь на ще 1 локал сторандж, де буде масив обєктів в яких буде назва айді addedFiles
    //тіпа [{id: 1, name: "English quesitons"}, {id: 2, name: "organizacia leteckej dopravy"}] і читати для назви inserted file для кастомних питань
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      try {
        const jsonData = JSON.parse(fileContent);
        setAddedFiles((prevFiles) => {
          const updatedData = [...prevFiles, jsonData];
          localStorage.setItem("fileData", JSON.stringify(updatedData));
          return updatedData;
        });
        console.log("File added successfully:", jsonData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };
  return (
    <div>
      <h1>Adding Data for {category}</h1>
      <form onSubmit={addFileHandling}>
        <input
          accept=".json"
          name="fileInput"
          type="file"
          placeholder="add .json file"
        />
        <input type="text" />
        <button type="submit">Add Data</button>
      </form>

      <ul>
        {addedFiles.map((file, index) => (
          <li key={index}>
          {index}  {file.question}, {file.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
