import { createContext, useContext, useState } from "react";

//create a context for disc
export const DiscsContext = createContext(null);

export function DiscsProvider({ children }) {
  const [discs, setDiscs] = useState(null);

  return (
    <DiscsContext.Provider value={{ discs, setDiscs }}>
      {children}
    </DiscsContext.Provider>
  );
}

export const useDiscs = () => useContext(DiscsContext);
