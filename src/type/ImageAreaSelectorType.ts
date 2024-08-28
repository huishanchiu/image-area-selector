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
