import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { IBoardData } from 'app/dataset/types';

const getDatasetsWSUrl = () => {
  if (process.env.NODE_ENV === 'production')
    return 'https://xs.datasets.skyvueservices.com';
  return 'ws://localhost:3030';
};

const useDatasetsSockets = (
  query: { userId: string | null; datasetId?: string },
  board: {
    boardData?: IBoardData;
    setBoardData: (boardData: IBoardData) => void;
  },
  changeHistoryRef: React.MutableRefObject<Array<IBoardData>>,
) => {
  const { userId, datasetId } = query;
  const { boardData, setBoardData } = board;
  const [socketObj, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!userId || !datasetId) return;
    const socket = io(getDatasetsWSUrl(), {
      query: {
        datasetId,
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setSocket(socket);
      socket.emit('join', datasetId);
      if (!boardData) {
        socket.emit('loadDataset');
      }
    });

    socket.on('initialDatasetReceived', (res: IBoardData) => {
      if (!boardData) {
        setBoardData(res);
        changeHistoryRef.current = [res];
      }
    });

    socket.on('returnDiff', (data: any) => {
      console.log(data);
    });
  }, [userId, datasetId, boardData, setBoardData, changeHistoryRef]);

  return socketObj;
};

export default useDatasetsSockets;
