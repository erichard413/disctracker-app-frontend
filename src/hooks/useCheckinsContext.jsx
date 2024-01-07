import { createContext, useContext, useState, useEffect } from "react";

//create a context for disc
export const CheckinsContext = createContext(null);

export function CheckinsProvider({ children }) {
  const [checkins, setCheckins] = useState(null);

  return (
    <CheckinsContext.Provider value={{ checkins, setCheckins }}>
      {children}
    </CheckinsContext.Provider>
  );
}

export const useCheckins = () => useContext(CheckinsContext);
