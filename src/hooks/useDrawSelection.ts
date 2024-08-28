import { useCallback, useState } from "react";
import { useSelectionContext } from "@context/ImageAreaSelectorProvider";
import { Selection } from "@type/ImageAreaSelectorType";
import { ImageSelectorName } from "@constant/ImageSelectorValue";

const useDrawSelection = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  id?: number,
) => {
  const { imgBoundary, selections, setSelections } = useSelectionContext();
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOverlap, setIsOverlap] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [initRect, setInitRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const checkOverlap = (
    newRec: Selection,
    selections: Selection[],
    type: "DRAW" | "RESIZE" | "MOVE",
    currentIdForMove?: number, //  for MOVE or RESIZE
  ) => {
    // MOVE and RESIZE should only trigger overlap check if there are more than 1 selection
    if ((type === "MOVE" || type === "RESIZE") && selections.length < 2) {
      return false;
    }

    return selections.some(({ x, y, width, height, id }) => {
      if (type !== "DRAW" && id === currentIdForMove) {
        return false;
      }
      const overlapX = newRec.x < x + width && newRec.x + newRec.width > x;
      const overlapY = newRec.y < y + height && newRec.y + newRec.height > y;
      return overlapX && overlapY;
    });
  };

  const handleDelete = (id: number) => {
    setSelections(selections.filter((selection) => selection.id !== id));
  };
  /**
   * draw selection functions
   */
  const startDrawingSelection = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const newId = Date.now();
        const newStartPoint = {
          id: newId,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        setStartPoint(newStartPoint);
        setIsDragging(true);
        setSelections((prevSelections) => [
          ...prevSelections,
          {
            id: newId,
            x: newStartPoint.x,
            y: newStartPoint.y,
            width: 0,
            height: 0,
          },
        ]);
        setCurrentId(newId);
      }
    },
    [ref, setSelections],
  );
  const updateSelectionArea = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const currentPoint = {
          x: Math.max(0, Math.min(imgBoundary.width, e.clientX - rect.left)),
          y: Math.max(0, Math.min(imgBoundary.height, e.clientY - rect.top)),
        };

        const newSelection = {
          id: currentId,
          x: Math.min(startPoint.x, currentPoint.x),
          y: Math.min(startPoint.y, currentPoint.y),
          width: Math.abs(currentPoint.x - startPoint.x),
          height: Math.abs(currentPoint.y - startPoint.y),
          warnStatus: false,
        };

        const isOverlap = checkOverlap(newSelection, selections, "DRAW");
        newSelection.warnStatus = isOverlap;
        setIsOverlap(isOverlap);

        setSelections((prevSelections) => {
          const updatedSelections = [...prevSelections];
          updatedSelections[updatedSelections.length - 1] = newSelection;
          return updatedSelections;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragging, ref, startPoint, currentId, imgBoundary, isOverlap],
  );

  const stopDrawingSelection = () => {
    if (isOverlap) {
      handleDelete(currentId);
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  /**
   * move selection functions
   */
  const startMovingSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!ref.current || !id) return;

    const rect = ref.current.getBoundingClientRect();

    setStartPoint({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    setCurrentId(id);

    const initSelection = {
      x: ref.current.offsetLeft,
      y: ref.current.offsetTop,
      width: rect.width,
      height: rect.height,
    };

    setInitRect(initSelection);
  };

  const updateSelectionPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isDragging || !id) return;
    const deltaX = e.clientX - startPoint.x;
    const deltaY = e.clientY - startPoint.y;

    const newX = initRect.x + deltaX;
    const newY = initRect.y + deltaY;

    const clampedX = Math.max(
      0,
      Math.min(imgBoundary.width - initRect.width, newX),
    );
    const clampedY = Math.max(
      0,
      Math.min(imgBoundary.height - initRect.height, newY),
    );
    const newSelection = {
      ...initRect,
      x: clampedX,
      y: clampedY,
      id,
      warnStatus: false,
    };

    const isOverlap = checkOverlap(newSelection, selections, "MOVE", id);
    newSelection.warnStatus = isOverlap;
    setIsOverlap(isOverlap);

    setSelections((prevSelections) => {
      const updatedSelections = [...prevSelections];
      updatedSelections[updatedSelections.length - 1] = newSelection;
      return updatedSelections;
    });
  };

  const stopMovingSelection = () => {
    if (!id) return;
    if (isDragging) {
      setIsDragging(false);
    }
    if (isOverlap) {
      handleDelete(id);
    }
  };

  /**
   * resize selection functions
   */
  const startResizingSelection = (
    e: React.MouseEvent<HTMLDivElement>,
    handleName: string,
    id: number,
    initX: number,
    initY: number,
    initWidth: number,
    initHeight: number,
    selection: Selection,
  ) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    setCurrentId(id);

    const updateSelectionSize = (e: MouseEvent) => {
      if (!ref.current || !id) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = initWidth;
      let newHeight = initHeight;
      let newX = initX;
      let newY = initY;

      switch (handleName) {
        case ImageSelectorName.TOP_LEFT:
          newWidth = initWidth - deltaX;
          newHeight = initHeight - deltaY;
          newX = initX + deltaX;
          newY = initY + deltaY;
          break;
        case ImageSelectorName.TOP_RIGHT:
          newWidth = initWidth + deltaX;
          newHeight = initHeight - deltaY;
          newY = initY + deltaY;
          break;
        case ImageSelectorName.BOTTOM_LEFT:
          newWidth = initWidth - deltaX;
          newHeight = initHeight + deltaY;
          newX = initX + deltaX;
          break;
        case ImageSelectorName.BOTTOM_RIGHT:
          newWidth = initWidth + deltaX;
          newHeight = initHeight + deltaY;
          break;
        case ImageSelectorName.TOP_CENTER:
          newHeight = initHeight - deltaY;
          newY = initY + deltaY;
          break;
        case ImageSelectorName.BOTTOM_CENTER:
          newHeight = initHeight + deltaY;
          break;
        case ImageSelectorName.MIDDLE_LEFT:
          newWidth = initWidth - deltaX;
          newX = initX + deltaX;
          break;
        case ImageSelectorName.MIDDLE_RIGHT:
          newWidth = initWidth + deltaX;
          break;
      }

      const newSelection = {
        ...selection,
        x: Math.max(0, Math.min(newX, newX + (newWidth < 0 ? newWidth : 0))),
        y: Math.max(0, Math.min(newY, newY + (newHeight < 0 ? newHeight : 0))),
        width: Math.abs(newWidth),
        height: Math.abs(newHeight),
        warnStatus: false,
      };

      newSelection.width = Math.min(
        imgBoundary.width - newSelection.x,
        Math.abs(newWidth),
      );
      newSelection.height = Math.min(
        imgBoundary.height - newSelection.y,
        Math.abs(newHeight),
      );

      const isOverlap = checkOverlap(
        newSelection,
        selections,
        "RESIZE",
        newSelection.id,
      );
      newSelection.warnStatus = isOverlap;
      setIsOverlap(isOverlap);

      setSelections((prevSelections) => {
        const updatedSelections = [...prevSelections];
        updatedSelections[updatedSelections.length - 1] = newSelection;
        return updatedSelections;
      });
    };

    const stopResizingSelection = () => {
      document.removeEventListener("mousemove", updateSelectionSize);
      document.removeEventListener("mouseup", stopResizingSelection);
    };

    document.addEventListener("mousemove", updateSelectionSize);
    document.addEventListener("mouseup", stopResizingSelection);
  };

  return {
    handleDelete,
    startDrawingSelection,
    updateSelectionArea,
    stopDrawingSelection,
    startMovingSelection,
    updateSelectionPosition,
    stopMovingSelection,
    startResizingSelection,
  };
};

export default useDrawSelection;
