import { IBoardState, IBoardData } from 'app/dataset/types';
import { createContext, MutableRefObject } from 'react';

interface IDatasetContext {
  boardData: IBoardData;
  setBoardData: null | ((data: IBoardData) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  changeHistoryRef: React.MutableRefObject<IBoardData[]>;
  currentRevision?: MutableRefObject<number>;
  undo: () => void;
  redo: () => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
