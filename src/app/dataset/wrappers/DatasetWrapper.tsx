import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as R from 'ramda';
import { useParams } from 'react-router-dom';
import useDatasetsSockets from 'hooks/useDatasetsSockets';
import { useQuery } from 'react-query';
import skyvueFetch from 'services/skyvueFetch';
import { IBoardState, IBoardData, IBoardHead } from '../types';
import DatasetWrapperOwner from './DatasetWrapperOwner';
import makeBoardDiff from '../lib/makeBoardDiff';
import DatasetNotFound from '../DatasetNotFound';
// import DatasetDisconnected from '../DatasetDisconnected';

enum DatasetUserTypes {
  owner,
  editor,
  viewer,
  unauthorized,
}

const getUserType = (
  userId: string,
  visibility?: IBoardData['visibilitySettings'],
): DatasetUserTypes => {
  if (!visibility) return DatasetUserTypes.viewer;
  if (userId === visibility.owner) {
    return DatasetUserTypes.owner;
  }
  if (visibility.editors.includes(userId)) {
    return DatasetUserTypes.editor;
  }
  if (visibility.viewers.includes(userId)) {
    return DatasetUserTypes.viewer;
  }
  return DatasetUserTypes.unauthorized;
};

export const initialBoardState = {
  cellsState: {
    activeCell: '',
    selectedCell: '',
    highlightedCells: [],
    copyingCell: '',
  },
  rowsState: {
    selectedRow: '',
    draggedRows: [],
  },
  columnsState: {
    selectedColumn: -1,
    activeColumn: -1,
    draggedColumns: [],
  },
  formulaBar: {
    active: false,
  },
  changeHistory: [],
};

const initial_layers = {
  joins: {},
  filters: [],
  groupings: {},
  smartColumns: [],
  sortings: [],
  formatting: [],
};

const DatasetWrapper: React.FC = () => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState<IBoardData | undefined>(undefined);
  const [boardState, setBoardState] = useState<IBoardState>(initialBoardState);
  const [boardHead, setBoardHead] = useState<{
    rowCount?: number;
  }>({});
  const [queriedDatasets, setQueriedDatasets] = useState<
    Pick<IBoardData, 'columns' | 'visibilitySettings' | 'layers' | '_id'>[]
  >([]);

  const [estCSVSize, setEstCSVSize] = useState<number | undefined>(undefined);
  const [filesToDownload, setFilesToDownload] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<string | undefined>();

  const { datasetId } = useParams<{ datasetId: string }>();

  const localStorageLookup = `${datasetId}-change-history`;
  if (datasetId && !localStorage.getItem(localStorageLookup)) {
    localStorage.setItem(localStorageLookup, JSON.stringify([]));
  }

  const changeHistoryRef = useRef<string[]>(
    JSON.parse(localStorage.getItem(localStorageLookup) ?? '[]'),
  );

  const { data, isLoading } = useQuery(user.accessToken, () =>
    user.accessToken
      ? skyvueFetch(user.accessToken).get(`/datasets/${datasetId}`)
      : () => undefined,
  );

  const title = data?.dataset?.title;

  useEffect(() => {
    if (title && `${title} - Skyvue` !== document.title) {
      document.title = `${title} - Skyvue`;
    }

    return () => {
      document.title = 'Skyvue';
    };
  }, [title]);

  const datasetHead = useMemo<IBoardHead>(
    () => ({
      _id: data?.dataset?._id,
      title: data?.dataset?.title,
      createdAt: data?.dataset?.createdAt,
      updatedAt: data?.dataset?.updatedAt,
      skyvueFileSize: data?.head?.ContentLength,
      csvFileSize: estCSVSize,
      rowCount: boardHead.rowCount,
    }),
    [boardHead, data, estCSVSize],
  );

  const params = useParams<{
    datasetId: string;
  }>();

  const { socket } = useDatasetsSockets(
    {
      userId: user.userId,
      datasetId: params.datasetId,
    },
    {
      boardData,
      setBoardData,
      estCSVSize,
      setEstCSVSize,
      boardHead,
      setBoardHead,
      datasetHead,
      boardState,
      setBoardState,
      queriedDatasets,
      setQueriedDatasets,
    },
    changeHistoryRef,
    setFilesToDownload,
    loading,
    setLoading,
  );

  const loader = (
    <div className="absolute__center">
      <Loading />
    </div>
  );

  if (!user.userId || !user.email) {
    return loader;
  }

  // if (socketIsDisconnected) {
  //   return (
  //     <>
  //       <CustomerNav email={user.email} />
  //       <DatasetDisconnected />
  //     </>
  //   );
  // }

  const datasetNotFound = !isLoading && R.keys(data).length === 0;
  if (datasetNotFound) {
    return (
      <>
        <CustomerNav email={user.email} />
        <DatasetNotFound />
      </>
    );
  }

  if (!boardData) {
    return (
      <>
        <CustomerNav email={user.email} />
        {loader}
      </>
    );
  }

  const userType = getUserType(user.userId, boardData.visibilitySettings);

  const _setBoardData = (newBoardData: IBoardData) => {
    setBoardData(prevBoardData => {
      if (!prevBoardData) return newBoardData;
      const diff = makeBoardDiff(prevBoardData, newBoardData);
      if (diff.colDiff || diff.rowDiff) {
        socket?.emit('diff', diff);
      }

      socket?.emit('syncLayers', newBoardData.layers);

      return newBoardData;
    });
  };

  const alwaysEditableFields = R.omit(['sortings']);
  const readOnly =
    ![DatasetUserTypes.owner, DatasetUserTypes.editor].includes(userType) &&
    (!boardData ||
      !R.whereEq(alwaysEditableFields(boardData.layers))(
        alwaysEditableFields(initial_layers),
      ));

  return (
    <DatasetContext.Provider
      value={{
        readOnly,
        socket,
        datasetHead,
        boardData,
        boardState,
        changeHistoryRef,
        getRowSlice: (first: number, last: number) => {
          socket?.emit('getSlice', { first, last });
        },
        loading,
        setLoading,
        setBoardData: [DatasetUserTypes.owner, DatasetUserTypes.editor].includes(
          userType,
        )
          ? _setBoardData
          : null,
        setBoardState,
        clipboard,
        setClipboard: async val => {
          if (!val) return;
          await navigator.clipboard.writeText(val);
          setClipboard(val);
        },
        queriedDatasets,
        setQueriedDatasets,
      }}
    >
      {filesToDownload.map(file => (
        <iframe key={file} title="file" src={file} style={{ display: 'none' }} />
      ))}
      <CustomerNav wide email={user.email} />
      {userType === DatasetUserTypes.owner && <DatasetWrapperOwner />}
    </DatasetContext.Provider>
  );
};

export default DatasetWrapper;
