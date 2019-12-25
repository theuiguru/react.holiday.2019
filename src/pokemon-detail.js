import React from "react";
import Context from "./pokemon-context";

export default function Pokemon(props) {
  let [
    {
      pokemon: { name }
    }
  ] = React.useContext(Context);
  return <h1 {...props}>{name}</h1>;
}
