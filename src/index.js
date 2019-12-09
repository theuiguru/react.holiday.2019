import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const collection = [
  { name: "Bulbasaur" },
  { name: "Ivysaur" },
  { name: "Venusaur" }
];

function Pokemon({ name, ...props }) {
  return <h2 {...props}>{name}</h2>;
}

async function fetchPokemon(id = "") {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (res.ok) {
    return await res.json();
  } else {
    return Promise.reject();
  }
}

function usePokemon(index) {
  let [pokemon, setPokemon] = React.useState(null);

  React.useEffect(() => {
    fetchPokemon(index).then(json => setPokemon(json));
  });

  return pokemon;
}

function App() {
  let [index, setIndex] = React.useState(0);
  let pokemon = usePokemon(index);

  return (
    <div>
      <button type="button" onClick={() => setIndex(index + 1)}>
        Next
      </button>
      {pokemon ? (
        <Pokemon name={pokemon.name} />
      ) : (
        <div>No pokemon for index {index}</div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
