import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

async function fetchPokemon(id = "") {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (res.ok) {
    let json = await res.json();
    console.log(json);
    return json;
  } else {
    return Promise.reject();
  }
}

function Pokemon({ name, ...props }) {
  return <h2 {...props}>{name}</h2>;
}

function usePokemon(index) {
  let [pokemon, setPokemon] = React.useState(null);

  React.useEffect(() => {
    fetchPokemon(index).then(json => setPokemon(json));
  }, [index]);

  return pokemon;
}

function App() {
  let [index, setIndex] = React.useState(1);
  let pokemon = usePokemon(index);
  let collection = usePokemon("");

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

      {collection ? (
        <PokemonList as="ol" items={collection.results} />
      ) : (
        <div>Fetching pokemon...</div>
      )}
    </div>
  );
}

function PokemonList({ as: As = React.Fragment, items, ...props }) {
  return (
    <As {...props}>
      {items.map(pokemon => (
        <li key={pokemon.name}>{pokemon.name}</li>
      ))}
    </As>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
