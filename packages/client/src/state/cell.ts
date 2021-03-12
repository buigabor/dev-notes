export type CellTypes = 'code' | 'text' | 'sketch';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
