import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function PokemonList({ className = "", ...props }) {
  return (
    <List className={["PokemonList", className].join(" ").trim()} {...props} />
  );
}

function List({
  as: As = React.Fragment,
  items,
  renderItem = pokemon => <li key={pokemon.name} />,
  ...props
}) {
  return <As>{items.map(renderItem)}</As>;
}

async function getJson(url) {
  let res = await fetch(url);
  if (res.ok) {
    let json = await res.json();
    return json;
  } else {
    return Promise.reject();
  }
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
  let [{ pokemon, ...state }, dispatch] = React.useReducer(
    (state, action) => {
      if (action.type === "fetch_and_replace_pokemon") {
        getJson(action.payload).then(json =>
          dispatch({ type: "replace_pokemon", payload: json })
        );
        return state;
      }
      if (action.type === "replace_pokemon")
        return { ...state, pokemon: action.payload };
      throw new Error();
    },
    { pokemon: null }
  );
  let collection = usePokemon("");

  return (
    <div>
      {pokemon ? (
        <Pokemon name={pokemon.name} />
      ) : (
        <div>Select a Pokemon...</div>
      )}

      {collection ? (
        <PokemonList
          as="div"
          items={collection.results}
          renderItem={pokemon => (
            <div key={pokemon.name}>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "fetch_and_replace_pokemon",
                    payload: pokemon.url
                  })
                }
              >
                {pokemon.name}
              </button>
            </div>
          )}
        />
      ) : (
        <div>Fetching pokemon...</div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
