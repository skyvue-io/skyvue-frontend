import React, { useContext, useEffect, useRef, useState } from 'react';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';
// import GridContext from 'contexts/GridContext';
import GridContext from 'contexts/GridContext';
import getCellValueById from '../lib/getCellValueById';
import editCellsAndReturnBoard from '../lib/editCellsAndReturnBoard';
import findCellCoordinates from '../lib/findCellIndex';
import formatValue from '../lib/formatValue';

const HotkeysProvider: React.FC<{
  undo: () => void;
  redo: () => void;
}> = ({ children, undo, redo }) => {
  const {
    boardState,
    setBoardState,
    setBoardData,
    boardData,
    clipboard,
    setClipboard,
  } = useContext(DatasetContext)!;
  const { handleChange } = useContext(GridContext)!;

  const [cut, toggleCut] = useState<{ cellId?: string; cutting: boolean }>({
    cutting: false,
  });
  const keysPressed = useRef<string[]>([]);
  const setKeysPressed = (keys: string[]) => {
    keysPressed.current = [...new Set(keys)];
  };
  const { selectedCell } = boardState.cellsState;

  const checkKeyEvent = (e: KeyboardEvent) =>
    ['Meta', 'Shift', 'c', 'v', 'x', 'z'].includes(e.key);

  const has = (key: string) => keysPressed.current.includes(key);

  useEffect(() => {
    const setCopiedCell = (selectedCell: string) =>
      R.set(R.lensPath(['cellsState', 'copyingCell']), selectedCell, boardState);

    const handleCopy = () => {
      const value = getCellValueById(boardData.rows, selectedCell);
      const [, cellIndex] = findCellCoordinates(boardData.rows, selectedCell);
      const colAssociated = boardData.columns[cellIndex];
      setClipboard(
        formatValue({
          desiredFormat: colAssociated.format,
          dataType: colAssociated.dataType,
          value,
          formatSettings: colAssociated.formatSettings,
        }),
      );
      setBoardState(setCopiedCell(selectedCell));
    };

    const handlePaste = () => {
      const pasteClipboard = (targetCell: string) => {
        const baseCellUpdates = [
          {
            cellId: targetCell,
            updatedValue: clipboard ?? '',
          },
        ];

        const cellUpdates = cut.cutting
          ? [
              ...baseCellUpdates,
              {
                cellId: cut.cellId ?? '',
                updatedValue: '',
              },
            ]
          : baseCellUpdates;

        handleChange({
          changeTarget: 'cell',
          targetId: selectedCell,
          prevValue: getCellValueById(boardData.rows, selectedCell),
          newValue: clipboard ?? '',
        });

        setBoardData?.(editCellsAndReturnBoard(cellUpdates, boardData));
      };
      pasteClipboard(selectedCell);
      setBoardState(setCopiedCell(''));
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (!checkKeyEvent(e)) return;
      if (selectedCell === '') return;
      setKeysPressed([...keysPressed.current, e.key]);

      if (has('c') && has('Meta')) {
        handleCopy();
      }
      if (has('x') && has('Meta')) {
        toggleCut({
          cellId: selectedCell,
          cutting: true,
        });
        handleCopy();
      }
      if (has('v') && has('Meta')) {
        handlePaste();
        toggleCut({
          cutting: false,
        });
      }
      if (has('z') && has('Meta')) {
        undo();
      }
      if (has('z') && has('Meta') && has('Shift')) {
        redo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!checkKeyEvent(e)) return;
      setKeysPressed([]);
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    boardData,
    boardState,
    clipboard,
    cut,
    cut.cutting,
    handleChange,
    keysPressed,
    redo,
    selectedCell,
    setBoardData,
    setBoardState,
    setClipboard,
    undo,
  ]);

  return <>{children}</>;
};

export default HotkeysProvider;
