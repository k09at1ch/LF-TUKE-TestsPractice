import "./App.css";
import { useState } from "react";
import { InsertedFile } from "../Main/insertingFile/InsertingFilePattern";
import { AddData } from "../Main/addingData/AddingData";
import eng from "../DataSet/Eng.json";
import LP from "../DataSet/LP.json";
import LaDI from "../DataSet/ladi.json";
import eko from "../DataSet/Ekonomika.json";
import cz from "../DataSet/1000czwords.json";
function App() {
  
  const [components, setComponents] = useState(() => {
    const initialComponents = [
      { id: 1, name: "English", questionsFile: eng },
      { id: 2, name: "LP", questionsFile: LP },
      { id: 3, name: "LaDI", questionsFile: LaDI },
      { id: 4, name: "Ekonomika", questionsFile: eko },
      { id: 5, name: "CZ", questionsFile: cz },
    ];
    if (localStorage.getItem("fileData")) {
      const storedData = JSON.parse(localStorage.getItem("fileData"));
      const storedComponents = storedData.map((item, index) => ({
        id: index + 7,
        name: item.name,
        questionsFile: item.data,
      }));
      return [...initialComponents, ...storedComponents];
    }
    return initialComponents;
  });

  const handleAddComponent = (newComponent) => {
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };
  return (
    <div >
      {/* <div style={{position: "absolute", zIndex: "-999", width: "100%", height: "100vh", backgroundColor: "black"}}></div> */}
      <div>
        <AddData category="niga" movingDataUp={handleAddComponent} />
      </div>
      <ul className="componentList" style={{ padding: 0 }}>
        {components.map((comp, index) => (
          <li key={index} className="componentListItem">
            <InsertedFile
              category={comp.name}
              questionsFile={comp.questionsFile}
            />
            {comp.id > 5 && (
              <button
                className="deleteButton"
                onClick={() => {
                  const updatedComponents = components.filter(
                    (_, i) => i !== index,
                  );
                  setComponents(updatedComponents);
                  const customFilesToSave = updatedComponents
                    .filter((comp) => comp.id > 5)
                    .map((comp) => ({
                      name: comp.name,
                      data: comp.questionsFile,
                    }));

                  localStorage.setItem(
                    "fileData",
                    JSON.stringify(customFilesToSave),
                  );
                }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
