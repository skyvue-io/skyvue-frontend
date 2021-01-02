import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import usePrevious from 'hooks/usePrevious';
import GridContext from 'contexts/GridContext';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import { Menu, Dropdown } from 'antd';
import typesAreCompatible from 'app/dataset/lib/typesAreCompatible';
import returnUpdatedCells from '../../lib/returnUpdatedCells';
import { makeBoardActions } from '../../lib/makeBoardActions';
import {
  DataTypes,
  IBoardState,
  IColumn,
  ISortingLayer,
  SortDirections,
} from '../../types';
import { defaults, COLUMN_DATA_TYPES } from '../constants';
import { ActiveInput } from '../styles';
import DraggableColEdge from './DraggableColEdge';
import ColumnTypeIcon from './ColumnTypeIcon';

interface IColumnHeaderProps extends IColumn {
  columnIndex: number;
  position: {
    firstColumn: boolean;
    lastColumn: boolean;
  };
}

const ColumnHeaderContainer = styled.div<{
  colWidth: number;
  position: IColumnHeaderProps['position'];
  active: boolean;
}>`
  background: #f1eff3;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  height: 2rem;
  width: ${props => props.colWidth}px;
  max-width: ${props => props.colWidth}px;
  overflow: hidden;
  padding: 0.5rem;
  padding-right: 0;
  box-shadow: ${Styles.xsBoxShadow};

  &:hover {
    font-weight: bold;
  }

  &:not(:first-of-type) {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  ${props =>
    props.position.firstColumn
      ? `
      border-radius: ${Styles.defaultBorderRadius} 0 0 0;
    `
      : ``}
  ${props =>
    props.position.lastColumn
      ? `
      border-radius: 0 ${Styles.defaultBorderRadius} 0 0;
    `
      : ``}
`;

const MenuTrigger = styled.div`
  cursor: pointer;
  transition-duration: 0.2s;
  display: flex;
  margin-left: 0.25rem;
  align-self: center;
  margin-right: 0.25rem;
  opacity: 0.4;
  &:hover {
    opacity: 1;
    i {
      color: ${Styles.blue};
    }
  }
`;

const MenuIcon = styled.i`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const ColumnHeader: React.FC<IColumnHeaderProps> = ({
  value,
  colWidth,
  position,
  columnIndex,
  _id,
  dataType,
}) => {
  const [showContextMenu, toggleShowContextMenu] = useState(false);
  const {
    readOnly,
    boardState,
    setBoardState,
    boardData,
    setBoardData,
    socket,
  } = useContext(DatasetContext)!;
  const { handleChange } = useContext(GridContext)!;

  const boardActions = makeBoardActions(boardData);
  const inputRef = useRef<HTMLInputElement>(null);
  const colHeaderRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<undefined | string>(value);

  const prevActive = usePrevious(
    boardState.columnsState.activeColumn === columnIndex,
  );
  const active = boardState.columnsState.activeColumn === columnIndex;

  useHandleClickOutside(colHeaderRef, () =>
    active
      ? setBoardState(R.assocPath(['columnsState', 'activeColumn'], -1, boardState))
      : undefined,
  );

  const columnSorting = boardData.layers?.sortings.find(
    sorting => sorting.key === _id,
  );

  const handleSortingChange = (direction?: SortDirections) => {
    let sortingLayer: ISortingLayer = boardData.layers?.sortings ?? [];
    if (columnSorting?.key === _id) {
      sortingLayer = direction
        ? sortingLayer.map(layer =>
            layer.key === _id ? { ...layer, direction } : layer,
          )
        : sortingLayer.filter(layer => layer.key !== _id);
    } else if (direction) {
      sortingLayer = [...sortingLayer, { key: _id, direction }];
    }

    socket?.emit('layer', {
      layerKey: 'sortings',
      layerData: sortingLayer,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (prevActive && !active) {
      handleChange?.({
        targetId: _id,
        changeTarget: 'column',
        prevValue: prevValue.current,
        newValue: value,
      });
    }
  });

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Dataset Settings">
        <Menu.Item onClick={() => setBoardData!(boardActions.removeColumn(_id))}>
          <MenuIcon
            style={{ color: Styles.red400 }}
            className="fal fa-times-circle"
          />
          Remove column
        </Menu.Item>
        <Menu.Item>
          <MenuIcon
            style={{ color: Styles.blue }}
            className="fad fa-remove-format"
          />
          Format
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.SubMenu title="Sort">
        <Menu.Item onClick={() => handleSortingChange()}>
          <MenuIcon
            style={{
              color: !columnSorting?.direction ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort"
          />
          Default
        </Menu.Item>
        <Menu.Item onClick={() => handleSortingChange('asc')}>
          <MenuIcon
            style={{
              color:
                columnSorting?.direction === 'asc' ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort-down"
          />
          A-Z
        </Menu.Item>
        <Menu.Item onClick={() => handleSortingChange('desc')}>
          <MenuIcon
            style={{
              color:
                columnSorting?.direction === 'desc' ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort-up"
          />
          Z-A
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu title="Data type">
        {COLUMN_DATA_TYPES.map((type: DataTypes) => (
          <Menu.Item
            disabled={!typesAreCompatible(dataType, type)}
            onClick={() => {
              setBoardData?.({
                ...boardData,
                columns: boardData.columns.map(col =>
                  col._id === _id
                    ? {
                        ...col,
                        dataType: type,
                      }
                    : col,
                ),
              });
            }}
            key={type}
          >
            <span style={{ fontWeight: type === dataType ? 'bold' : 'initial' }}>
              {type}
            </span>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Dropdown trigger={['contextMenu']} overlay={menu}>
      <ColumnHeaderContainer
        ref={colHeaderRef}
        onContextMenu={e => {
          e.preventDefault();
          toggleShowContextMenu(!showContextMenu);
        }}
        position={position}
        active={active}
        colWidth={colWidth ?? defaults.COL_WIDTH}
        onDoubleClick={() =>
          setBoardState(
            R.assocPath(['columnsState', 'activeColumn'], columnIndex, boardState),
          )
        }
        onClick={() =>
          setBoardState(
            R.pipe(
              R.assocPath(['columnsState', 'selectedColumn'], columnIndex),
              R.assocPath(['rowsState', 'selectedRow'], ''),
            )(boardState) as IBoardState,
          )
        }
      >
        <ColumnTypeIcon dataType={dataType} />
        {!readOnly && active ? (
          <ActiveInput
            ref={inputRef}
            value={value ?? ''}
            type="text"
            onKeyDown={e => {
              if (e.key !== 'Enter') return;
              const set = (key: string, value: any) =>
                R.over(R.lensProp('columnsState'), R.assoc(key, value));
              setBoardState(
                R.pipe(
                  set('selectedColumn', 'columnIndex'),
                  set('activeColumn', -1),
                )(boardState),
              );
            }}
            onChange={e => {
              prevValue.current = value;
              setBoardData!(
                R.assoc(
                  'columns',
                  returnUpdatedCells<IColumn>({
                    iterable: boardData.columns,
                    cellUpdates: [{ cellId: _id, updatedValue: e.target.value }],
                  }),
                  boardData,
                ),
              );
            }}
          />
        ) : (
          <Label>{value}</Label>
        )}
        <i
          style={{ marginLeft: 'auto' }}
          className={
            !columnSorting?.direction
              ? ''
              : columnSorting?.direction === 'asc'
              ? `fad fa-sort-down`
              : `fad fa-sort-up`
          }
        />
        <DraggableColEdge colWidth={colWidth ?? defaults.COL_WIDTH} colId={_id} />
        <Dropdown trigger={['click']} overlay={menu}>
          <MenuTrigger
            onDoubleClick={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              toggleShowContextMenu(true);
            }}
          >
            <i className="fas fa-chevron-square-down" />
          </MenuTrigger>
        </Dropdown>
      </ColumnHeaderContainer>
    </Dropdown>
  );
};

export default ColumnHeader;
