import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const collection = [
  {name: "Robin"},
  {name: "Cristin"},
  {name: "Shajan"},
  {name: "Noel"}
];

function Friends({ name, ...props }) {
  return <h2 {...props}>{name}</h2>;
}

function App() {
  let [index, setIndex] = React.useState(0);
  let friend = collection[index];
  return (
    <div>
      <button type="button" onClick={() => setIndex(index + 1)}>
        Next
      </button>
      {friend ? <Friends name={friend.name}/> : <div>No friend for index {index}</div>}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
