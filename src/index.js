import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function PokemonList({
  renderItem = pokemon => <li key={pokemon.name}>{pokemon.name}</li>,
  className,
  ...props
}) {
  return (
    <List
      className={["PokemonList", className].join(" ")}
      {...props}
      renderItem={renderItem}
    />
  );
}

function List({ as: As = React.Fragment, items, renderItem, ...props }) {
  return <As>{items.map(renderItem)}</As>;
}

async function fetchPokemon(id = "") {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (res.ok) {
    let json = await res.json();
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
        <PokemonList
          as="div"
          className="some-additional-classname"
          items={collection.results}
          renderItem={pokemon => <button type="button">{pokemon.name}</button>}
        />
      ) : (
        <div>Fetching pokemon...</div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
