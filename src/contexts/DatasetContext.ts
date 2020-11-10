import { IBoardState, IBoardData, IBoardMeta } from 'app/dataset/types';
import { createContext } from 'react';

interface IDatasetContext {
  datasetMeta: IBoardMeta;
  boardData: IBoardData;
  setBoardData: null | ((data: IBoardData) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  changeHistoryRef: React.MutableRefObject<IBoardData[]>;
  currentRevision: number;
  setCurrentRevision: (revision: number) => void;
  undo: () => void;
  redo: () => void;
  getRowSlice: (start: number, end: number) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
