import { useState } from "react";
import { Selection } from "@type/ImageAreaSelectorType";
import { SelectionContext } from "./ImageAreaSelectorContext";

const ImageAreaSelectorProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [selections, setSelections] = useState<Selection[]>([]);
  const [imgBoundary, setImgBoundary] = useState({ width: 0, height: 0 });
  const [imgIntrinsicSize, setImgIntrinsicSize] = useState({
    width: 0,
    height: 0,
  });

  return (
    <SelectionContext.Provider
      value={{
        selections,
        imgBoundary,
        imgIntrinsicSize,
        setSelections,
        setImgBoundary,
        setImgIntrinsicSize,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export default ImageAreaSelectorProvider;
