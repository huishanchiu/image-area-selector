import { useMemo, useRef, useContext } from "react";
import { SelectionContext } from "@context/ImageAreaSelectorContext";
import styled from "@emotion/styled";
import ImageSelector from "@component/ImageAreaSelector/ImageSelector";
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
  const { selections } = useContext(SelectionContext);

  const idMapRef = useRef<Map<number, number>>(new Map());

  useMemo(() => {
    selections.forEach((selection, index) => {
      if (!idMapRef.current.has(selection.id)) {
        idMapRef.current.set(selection.id, index + 1);
      }
    });
  }, [selections]);

  return (
    <Wrapper
      onMouseDown={startDrawingSelection}
      onMouseMove={updateSelectionArea}
      onMouseUp={stopDrawingSelection}
    >
      <div ref={imgRef}>{children}</div>
      {selections.map((selection: Selection) => (
        <ImageSelector
          index={idMapRef.current.get(selection.id) || 0}
          key={selection.id}
          selection={selection}
        />
      ))}
    </Wrapper>
  );
};

export default ImagePreview;
