import React from "react";
import ReactDOM from "react-dom";
import PokemonContext from "./pokemon-context";
import "./styles.css";

const Pokemon = React.lazy(() => import("./pokemon-detail"));

// Assignment:s
// Import `Pokemon` from `PokemonDetail` using React's code-splitting features: React.lazy() and Suspense

function App() {
  let stateReducer = React.useReducer(
    (state, action) => {
      if (action.type === "fetch_and_replace_pokemon") {
        getJson(action.payload).then(json =>
          dispatch({ type: "replace_pokemon", payload: json })
        );
        return state;
      }
      if (action.type === "replace_pokemon") {
        return { ...state, pokemon: action.payload };
      }
      throw new Error();
    },
    { pokemon: null }
  );

  let [{ pokemon }, dispatch] = stateReducer;

  let collection = usePokemon("");

  return (
    <div>
      {pokemon ? (
        <PokemonContext.Provider value={stateReducer}>
          <React.Suspense fallback={<div>Couldn't Catch Pokemon...</div>}>
            <Pokemon />
          </React.Suspense>
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

function usePokemon(index) {
  let [pokemon, setPokemon] = React.useState(null);

  React.useEffect(() => {
    fetchPokemon(index).then(json => setPokemon(json));
  }, [index]);

  return pokemon;
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

function PokemonList({ className = "", ...props }) {
  return (
    <List className={["PokemonList", className].join(" ").trim()} {...props} />
  );
}

function List({
  as: As = React.Fragment,
  items,
  renderItem = pokemon => <li key={pokemon.name}>{pokemon.name}</li>,
  ...props
}) {
  return <As {...props}>{items.map(renderItem)}</As>;
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

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
);
