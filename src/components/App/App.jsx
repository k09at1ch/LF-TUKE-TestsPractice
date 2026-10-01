import "./App.css";
import { English } from "../Main/eng/English";
import { LP } from "../Main/LP/LP";
import { LaDI } from "../Main/LaDI/LaDI";
import { Ekonomika } from "../Main/eko/Ekonomika";
import { CZ } from "../Main/CZ/CZ";
import "./App.css";
function App() {
  return (
    <>
      <ul className="componentList" style={{padding: 0}}>
        <li className="componentComponent">
          <English />
        </li>
        <li className="componentComponent">
          <LP />
        </li>
        <li className="componentComponent">
          <LaDI />
        </li>
        <li className="componentComponent">
          <Ekonomika />
        </li>
        <li className="componentComponent">
          <CZ />
        </li>
      </ul>
    </>
  );
}

export default App;
