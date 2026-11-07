import { createContext, useContext } from "react";

export const SsrDataContext = createContext({});

export function useSsrData() {
  return useContext(SsrDataContext);
}
