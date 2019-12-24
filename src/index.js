import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

let PokemonContext = React.createContext({ name: "bulbasaur" });

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

function Pokemon({ ...props }) {
  let [
    {
      pokemon: { name }
    },
    dispatch
  ] = React.useContext(PokemonContext);
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
  let stateReducer = React.useReducer(
    (state, action) => {
      if (action.type === "fetch_and_replace_pokemon") {
        getJson(action.payload).then(json =>
          dispatch({ type: "replace_pokemon", payload: json })
        );
        return state;
      }
      if (action.type === "replace_pokemon")
        return { ...state, pokemon: action.payload };
      throw new Error(`${action.type} is not a known action.`);
    },
    { pokemon: null }
  );

  let [{ pokemon }, dispatch] = stateReducer;

  let collection = usePokemon("");

  return (
    <div>
      {pokemon ? (
        <PokemonContext.Provider value={stateReducer}>
          <Pokemon />
        </PokemonContext.Provider>
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
                    type: "bad_action",
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
);
