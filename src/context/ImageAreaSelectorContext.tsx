import { createContext } from "react";
import { ContextType } from "@type/ImageAreaSelectorType";

const initialState: ContextType = {
  selections: [],
  imgBoundary: { width: 0, height: 0 },
  imgIntrinsicSize: { width: 0, height: 0 },
  setSelections: () => {},
  setImgBoundary: () => {},
  setImgIntrinsicSize: () => {},
};

export const SelectionContext = createContext<ContextType>(initialState);
