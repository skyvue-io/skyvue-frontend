import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import NewRows from './NewRows';
import NewColumns from './NewColumns';

const BoardActionsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  .left {
    margin-right: auto;
    display: flex;
  }
  .right {
    display: flex;
    margin-left: auto;
    button {
      margin-left: 1rem;
    }
  }
`;

const TimeTravel = styled.div<{ disabled?: boolean }>`
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition-duration: 0.2s;
  cursor: pointer;
  ${props =>
    props.disabled
      ? `
    cursor: not-allowed;
    opacity: 0.2;
  `
      : `
    &:hover {
      * {
        color: ${Styles.purple};
      }
    }
  `}
`;

const DatasetToolbar: React.FC = () => {
  const {
    boardData,
    setBoardData,
    changeHistoryRef,
    currentRevision,
    ...dataset
  } = useContext(DatasetContext)!;
  // const colLen = boardData.columns.length;

  const undoDisabled = currentRevision === 0;
  const redoDisabled = !changeHistoryRef.current[currentRevision + 1];

  return (
    <BoardActionsContainer>
      <div className="left">
        <TimeTravel
          onClick={undoDisabled ? undefined : dataset.undo}
          disabled={undoDisabled}
        >
          <i className="fad fa-undo" />
          <Label>Undo</Label>
        </TimeTravel>
        <TimeTravel
          onClick={redoDisabled ? undefined : dataset.redo}
          disabled={redoDisabled}
        >
          <i className="fad fa-redo" />
          <Label>Redo</Label>
        </TimeTravel>
      </div>
      <div className="right">
        <NewColumns />
        <NewRows />
        {/* <ButtonPrimary onClick={() => setBoardData!(boardActions.newRow())}>
          Add row
        </ButtonPrimary>
        <ButtonPrimary
          onClick={() => setBoardData!(boardActions.newColumn(`col ${colLen + 1}`))}
        >
          Add Column
        </ButtonPrimary> */}
      </div>
    </BoardActionsContainer>
  );
};

export default DatasetToolbar;