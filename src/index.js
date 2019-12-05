import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const collection = [
  {name: "Robin"},
  {name: "Christian"},
  {name: "Shajan"},
  {name: "Noel"}
];

function Friends({ name, ...props }) {
  return <h2 {...props}>{name}</h2>;
}

function App() {
  let [index, setIndex] = React.useState(0);
  return (
    <div>
      <button type="button" onClick={() => setIndex(index + 1)}>
        Next
      </button>
      <Friends name={collection[index].name} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
