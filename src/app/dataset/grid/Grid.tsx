import { Text } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import GridContext from 'contexts/GridContext';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';

import Styles from 'styles/Styles';
import { VariableSizeList as VirtualizedList } from 'react-window';
import useWindowSize from 'hooks/useWindowSize';
import { ChangeHistoryItem } from '../types';
import ColumnHeader from './ColumnHeader';
import HiddenColumnIndicator from './ColumnHeader/HiddenColumnIndicator';
import EventsProvider from './EventsProvider';
import HotkeysProvider from './HotkeysProvider';
import Row from './Row';
import updateColumnById from '../lib/updateColumnById';
import updateSmartColumnById from '../lib/updateSmartColumnById';
import { defaults } from './constants';

const GridContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  margin-top: 1rem;
  padding: 0 0.25rem 0 0;
  overflow-x: auto;
  overflow-y: hidden;
`;
const ColumnsContainer = styled.div`
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  background: ${Styles.defaultBgColor};
  position: sticky;
  top: 0;
  margin-left: 32px;
`;

const Grid: React.FC<{
  gridRef: React.RefObject<HTMLDivElement>;
  undo: () => void;
  redo: () => void;
  handleChange: (changeHistoryItem: ChangeHistoryItem) => void;
}> = ({ gridRef, undo, redo, handleChange }) => {
  const {
    boardData,
    setBoardData,
    readOnly,
    getRowSlice,
    visibleRows,
    setVisibleRows,
  } = useContext(DatasetContext)!;
  const listRef = useRef<VirtualizedList>(null);
  const { rows, columns } = boardData;
  const [firstVisibleRow, lastVisibleRow] = visibleRows;
  const columnLookup = R.indexBy(R.prop('_id'), boardData.columns);

  const scrollTimeout = useRef(-1);

  const { height } = useWindowSize();

  const makeRow = React.memo(({ index, style }: any) => {
    const row = rows[index];
    return (
      <div
        style={{
          ...style,
          overflowX: 'hidden',
        }}
      >
        <Row
          key={row._id}
          {...row}
          columnLookup={columnLookup}
          rowIndex={row.index}
          position={{
            firstRow: index === 0,
            lastRow: index === rows.length - 1,
          }}
        />
      </div>
    );
  });

  const onScroll = () => {
    const grid = gridRef.current;
    if (!grid) return;

    const firstVisibleIndex = R.pipe(
      R.find(
        (node: any) =>
          node.getBoundingClientRect().top > grid.getBoundingClientRect().top,
      ),
      R.pathOr('0', ['dataset', 'rowIndex']),
      parseInt,
    )([...grid.querySelectorAll('div.row__index')]);

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const ROW_SLICE_INTERVAL = 200;
      if (lastVisibleRow !== firstVisibleIndex + ROW_SLICE_INTERVAL) {
        getRowSlice(firstVisibleIndex, firstVisibleIndex + ROW_SLICE_INTERVAL);
        setVisibleRows([firstVisibleIndex, firstVisibleIndex + ROW_SLICE_INTERVAL]);
      }
    }, 200);
  };

  return (
    <GridContext.Provider
      value={{
        gridRef,
        visibleRows: [firstVisibleRow, lastVisibleRow],
        handleChange,
      }}
    >
      <GridContainer ref={gridRef}>
        <EventsProvider>
          <HotkeysProvider
            undo={!readOnly ? undo : () => undefined}
            redo={!readOnly ? redo : () => undefined}
          >
            <ColumnsContainer>
              {columns.map((col, index) =>
                col.hidden ? (
                  <HiddenColumnIndicator
                    key={col._id}
                    value={col.value}
                    onShow={() => {
                      setBoardData?.(
                        R.pipe(
                          updateColumnById(col._id, { hidden: false }),
                          R.ifElse(
                            () => col.isSmartColumn === true,
                            updateSmartColumnById(col._id, { hidden: false }),
                            R.identity,
                          ),
                          R.ifElse(
                            () => col.isJoined === true,
                            R.assocPath(['layers', 'joins', 'hidden'], false),
                            R.identity,
                          ),
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                        )(boardData),
                      );
                    }}
                  />
                ) : (
                  <ColumnHeader
                    key={col._id}
                    {...col}
                    columnIndex={index}
                    position={{
                      firstColumn: index === 0,
                      lastColumn: index === columns.length - 1,
                    }}
                  />
                ),
              )}
            </ColumnsContainer>
            {rows.length > 0 ? (
              <VirtualizedList
                ref={listRef}
                height={height ? height * 0.7 : 1000}
                itemCount={boardData.rows?.length ?? 0}
                itemSize={() => defaults.ROW_HEIGHT * 16}
                width={gridRef.current?.scrollWidth ?? 1000}
                onScroll={onScroll}
              >
                {makeRow}
              </VirtualizedList>
            ) : (
              <Text
                style={{ marginLeft: '32px', marginTop: '1rem' }}
                len="short"
                size="lg"
              >
                Your query returned no results
              </Text>
            )}
          </HotkeysProvider>
        </EventsProvider>
      </GridContainer>
    </GridContext.Provider>
  );
};

export default Grid;
