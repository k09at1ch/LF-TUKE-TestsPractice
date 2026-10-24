/* eslint-disable no-unused-vars */
import "./App.css";
import { useState } from "react";
import { InsertedFile } from "../Main/insertingFile/InsertingFilePattern";
import { AddData } from "../Main/addingData/AddingData";
import insert from "../DataSet/insert2-15LP.json";
import eng from "../DataSet/Eng.json";
import LP from "../DataSet/LP.json";
import LaDI from "../DataSet/ladi.json";
import eko from "../DataSet/Ekonomika.json";
import cz from "../DataSet/1000czwords.json";
import "./App.css";
function App() {
  const [components, setComponents] = useState(() => {
    if (localStorage.getItem("componentData")) {
      return JSON.parse(localStorage.getItem("componentData"));
    } else {
      localStorage.setItem(
        "componentData",
        JSON.stringify([
          { name: "English", questionsFile: eng },
          { name: "LP", questionsFile: LP },
          { name: "LaDI", questionsFile: LaDI },
          { name: "Ekonomika", questionsFile: eko },
          { name: "CZ", questionsFile: cz },
          { name: "InsertedFile", questionsFile: insert },
        ]),
      );
      return [
        { name: "English", questionsFile: eng },
        { name: "LP", questionsFile: LP },
        { name: "LaDI", questionsFile: LaDI },
        { name: "Ekonomika", questionsFile: eko },
        { name: "CZ", questionsFile: cz },
        { name: "InsertedFile", questionsFile: insert },
      ];
    }
  });
  return (
    <>
      <div className="h">Adding Data</div>
      <div>
        <AddData />
      </div>
      <ul className="componentList" style={{ padding: 0 }}>
        {components.map((comp, index) => (
          <li key={index} className="componentListItem">
            <InsertedFile
              category={comp.name}
              questionsFile={comp.questionsFile}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
