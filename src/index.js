import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function Friends({ name, ...props }) {
  return <h2 {...props}>{name}</h2>;
}

function App() {
  return (
    <div>
      <h1>My Friends</h1>
      <Friends name="Robin" class="friend" />
      <Friends name="Shajan" id="2" />
      <Friends name="Noel" data-something="something" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
