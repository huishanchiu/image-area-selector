export interface Selection {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectionStatus extends Selection {
  warnStatus?: boolean;
}

export type ContextType = {
  selections: Selection[];
  imgBoundary: { width: number; height: number };
  imgIntrinsicSize: { width: number; height: number };
  setSelections: React.Dispatch<React.SetStateAction<Selection[]>>;
  setImgBoundary: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
  setImgIntrinsicSize: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
};
