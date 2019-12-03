import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function Friends(props) {
  return <h2>{props.name}</h2>;
}

function App() {
  return (
    <div>
      <h1>My Friends</h1>
      <Friends name="Robin" />
      <Friends name="Shajan" />
      <Friends name="Noel" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
