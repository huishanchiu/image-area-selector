import { useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { useTheme, Theme } from "@emotion/react";
import { SelectionStatus } from "@type/ImageAreaSelectorType";
import {
  ImageSelectorValue,
  ImageSelectorName,
} from "@constant/ImageSelectorValue";
import useDrawSelection from "@hooks/useDrawSelection";
import DeleteIcon from "@assets/SVG/deleteIcon";

const SelectHandle = styled.div<{
  xScale: number;
  yScale: number;
  width: number;
  height: number;
  name: string;
  warnStatus?: boolean;
}>`
  width: 8px;
  height: 8px;
  background-color: ${({
    warnStatus,
    theme,
  }: {
    warnStatus?: boolean;
    theme: Theme;
  }) => (warnStatus ? theme.colorWarning : theme.colorPrimary)};
  position: absolute;
  left: ${({ width, xScale }: { width: number; xScale: number }) =>
    xScale * width - 4}px;
  top: ${({ height, yScale }: { height: number; yScale: number }) =>
    yScale * height - 4}px;
  cursor: ${({ name }: { name: string }) => {
    switch (name) {
      case ImageSelectorName.TOP_LEFT:
      case ImageSelectorName.BOTTOM_RIGHT:
        return "nwse-resize";
      case ImageSelectorName.TOP_RIGHT:
      case ImageSelectorName.BOTTOM_LEFT:
        return "nesw-resize";
      case ImageSelectorName.TOP_CENTER:
      case ImageSelectorName.BOTTOM_CENTER:
        return "ns-resize";
      case ImageSelectorName.MIDDLE_LEFT:
      case ImageSelectorName.MIDDLE_RIGHT:
        return "ew-resize";
      default:
        return "default";
    }
  }};
`;

const Wrapper = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
  warnStatus?: boolean;
}>`
  border: solid 1px
    ${({ warnStatus, theme }: { warnStatus?: boolean; theme: Theme }) =>
      warnStatus ? theme.colorWarning : theme.colorPrimary};
  position: absolute;
  top: ${({ y }: { y: number }) => y}px;
  left: ${({ x }: { x: number }) => x}px;
  width: ${({ width }: { width: number }) => width}px;
  height: ${({ height }: { height: number }) => height}px;
`;

const IconWrapper = styled.div`
  background-color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -30px;
  top: 0;
  cursor: pointer;
  border-radius: 4px;
`;

const Index = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  margin: 6px;
  background-color: #fff;
  color: ${(props: { theme: Theme }) => props.theme.colorNeutral700};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
  border-radius: 50%;
`;

type Props = {
  selection: SelectionStatus;
  index: number;
};

const ImageSelector = (props: Props) => {
  const theme = useTheme();
  const { selection, index } = props;
  const { x: initX, y: initY, width, height, id, warnStatus } = selection;
  const rectRef = useRef<HTMLDivElement | null>(null);
  const {
    handleDelete,
    startMovingSelection,
    updateSelectionPosition,
    stopMovingSelection,
    startResizingSelection,
  } = useDrawSelection(rectRef, id);

  const handleResizing = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, selectorName: string) => {
      e.stopPropagation();
      startResizingSelection(
        e,
        selectorName,
        id,
        initX,
        initY,
        width,
        height,
        selection,
      );
    },
    [startResizingSelection, id, initX, initY, width, height, selection],
  );

  const handleMoving = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      updateSelectionPosition(e);
    },
    [updateSelectionPosition],
  );

  return (
    <Wrapper
      ref={rectRef}
      width={width}
      height={height}
      x={initX}
      y={initY}
      warnStatus={warnStatus}
      onMouseDown={startMovingSelection}
      onMouseMove={handleMoving}
      onMouseUp={stopMovingSelection}
    >
      <Index>{index}</Index>
      <IconWrapper onClick={() => handleDelete(id)}>
        <DeleteIcon color={theme.colorNeutral400} width={16} height={16} />
      </IconWrapper>
      {ImageSelectorValue.map((selector) => {
        return (
          <SelectHandle
            key={selector.name}
            name={selector.name}
            warnStatus={warnStatus}
            xScale={selector.x}
            yScale={selector.y}
            width={width}
            height={height}
            onMouseDown={(e) => handleResizing(e, selector.name)}
          />
        );
      })}
    </Wrapper>
  );
};

export default ImageSelector;
