import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import editCellsAndReturnBoard from 'app/dataset/lib/editCellsAndReturnBoard';
import DropdownMenu from 'components/DropdownMenu';
import useClippy from 'use-clippy';
import getCellValueById from 'app/dataset/lib/getCellValueById';
import { ICell, IBoardState } from '../../types';
import { defaults } from '../constants';
import { ActiveInput } from '../styles';

interface ICellProps extends ICell {
  rowId: string;
  highlighted: boolean;
  active: boolean;
  selected: boolean;
  position: {
    lastRow: boolean;
    lastColumn: boolean;
    firstColumn: boolean;
  };
  isCopying: boolean;
  colWidth?: number;
}

const CELL_BORDER_COLOR = Styles.faintBorderColor;
const CellContainer = styled.div<{
  highlighted?: boolean;
  active?: boolean;
  selected?: boolean;
  position: ICellProps['position'];
  isCopying: boolean;
  width: number;
}>`
  display: flex;
  align-items: center;
  height: 100%;
  width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  background: white;
  overflow: hidden;
  padding: .5rem;
  cursor: pointer;
  flex: 1 0 auto;
  border-top: 1px solid ${CELL_BORDER_COLOR};
  border-left: 1px solid ${CELL_BORDER_COLOR};
  ${props =>
    props.position.lastRow
      ? `
      border-bottom: 1px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastColumn
      ? `
      border-left: 1px solid ${CELL_BORDER_COLOR};
      border-right: 2px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastRow && props.position.lastColumn
      ? `
      border-radius: 0 0 ${Styles.defaultBorderRadius} 0;
    `
      : ''}

  ${props =>
    props.position.firstColumn
      ? `
      border-left: 2px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastRow && props.position.firstColumn
      ? `
      border-radius: 0 0 0 ${Styles.defaultBorderRadius};
    `
      : ''}

  ${props =>
    props.selected
      ? `
    border: 2px solid ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius}; 
    box-shadow: ${Styles.smBoxShadow};
  `
      : ''}

  ${props =>
    props.active
      ? `
      box-shadow: ${Styles.smBoxShadow};
      `
      : ''}

  ${props =>
    props.highlighted
      ? `
    background: ${Styles.purpleAccent};
  `
      : ''}

  ${props =>
    props.isCopying
      ? `
    border: 2px dashed ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius};
  `
      : ''}
`;

const Cell: React.FC<ICellProps> = ({
  _id,
  value,
  highlighted,
  active,
  selected,
  position,
  isCopying,
  colWidth,
}) => {
  const [, setClipboard] = useClippy();
  const { boardState, setBoardState, boardData, setBoardData } = useContext(
    DatasetContext,
  )!;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const typingTimeout = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  const handleCopy = () => {
    setClipboard(getCellValueById(boardData.rows, _id));
    setBoardState(R.set(R.lensPath(['cellsState', 'copyingCell']), _id, boardState));
  };

  const MENU_OPTIONS = [
    {
      label: 'copy',
      onClick: handleCopy,
      icon: <i className="fad fa-copy" />,
    },
    {
      label: 'paste',
      onClick: () => null,
      icon: <i className="far fa-paste" />,
    },
    {
      label: 'cut',
      onClick: () => null,
      icon: <i className="fad fa-cut" />,
    },
  ];

  return (
    <CellContainer
      width={colWidth ?? defaults.COL_WIDTH}
      isCopying={isCopying}
      active={active}
      highlighted={highlighted}
      position={position}
      selected={selected}
      onContextMenu={e => {
        e.preventDefault();
        setShowContextMenu(!showContextMenu);
      }}
      onClick={() =>
        setBoardState(
          R.pipe(
            R.assocPath(['columnsState', 'selectedColumn'], -1),
            R.assocPath(['cellsState', 'selectedCell'], _id),
          )(boardState) as IBoardState,
        )
      }
      onDoubleClick={() =>
        setBoardState(R.assocPath(['cellsState', 'activeCell'], _id, boardState))
      }
    >
      {active ? (
        <ActiveInput
          ref={inputRef}
          value={localValue ?? ''}
          type="text"
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            const setCells = (key: string, value: any) =>
              R.over(R.lensProp('cellsState'), R.assoc(key, value));

            setBoardState(
              R.pipe(
                setCells('activeCell', ''),
                setCells('selectedCell', _id),
              )(boardState) as IBoardState,
            );
          }}
          onChange={e => {
            const { value } = e.target;
            setLocalValue(e.target.value);
            clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(() => {
              setBoardData!(
                editCellsAndReturnBoard(
                  [
                    {
                      cellId: _id,
                      updatedValue: (value as string) ?? '',
                    },
                  ],
                  boardData,
                ),
              );
            }, 200);
          }}
        />
      ) : (
        value
      )}
      {showContextMenu && (
        <DropdownMenu
          closeMenu={() => setShowContextMenu(false)}
          options={MENU_OPTIONS}
        />
      )}
    </CellContainer>
  );
};

export default Cell;
