import { useRef } from "react";
import styled from "@emotion/styled";
import ImageSelector from "@component/ImageAreaSelector/ImageSelector";
import { useSelectionContext } from "@context/ImageAreaSelectorProvider";
import useDrawSelect from "@hooks/useDrawSelection";
import { Selection } from "@type/ImageAreaSelectorType";

const Wrapper = styled.div`
  position: relative;
  width: 355px;
  cursor: crosshair;
`;

type Props = {
  children: JSX.Element;
  imgBoundary: { width: number; height: number };
};

const ImagePreview = (props: Props) => {
  const { children } = props;
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { startDrawingSelection, updateSelectionArea, stopDrawingSelection } =
    useDrawSelect(imgRef);
  const { selections } = useSelectionContext();

  return (
    <Wrapper
      onMouseDown={startDrawingSelection}
      onMouseMove={updateSelectionArea}
      onMouseUp={stopDrawingSelection}
    >
      <div ref={imgRef}>{children}</div>
      {selections.map((selection: Selection, index: number) => (
        <ImageSelector
          index={index + 1}
          key={selection.id}
          selection={selection}
        />
      ))}
    </Wrapper>
  );
};

export default ImagePreview;
