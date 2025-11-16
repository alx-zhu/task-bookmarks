import { createContext, useContext } from "react";

/* eslint-disable react-refresh/only-export-components */
const ShadowRootContext = createContext<ShadowRoot | null>(null);

export const ShadowRootProvider = ShadowRootContext.Provider;

export function useShadowRoot() {
  return useContext(ShadowRootContext);
}
