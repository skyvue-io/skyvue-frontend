import Modal from 'components/Modal';
import ButtonWithOptions from 'components/ui/ButtonWithOptions';
// import DatasetContext from 'contexts/DatasetContext';
import React, { useState } from 'react';
import Styles from 'styles/Styles';
// import { makeBoardActions } from '../lib/makeBoardActions';

const NewColumns: React.FC = () => {
  enum NewColumnViews {
    singleEmpty,
    multipleEmpty,
    aggregateColumn,
    fromUpload,
  }

  const [view, setView] = useState(NewColumnViews.singleEmpty);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const { boardData, setBoardData } = useContext(DatasetContext)!;
  // const boardActions = makeBoardActions(boardData);
  return (
    <>
      <ButtonWithOptions
        pos={{ right: 13 }}
        options={[
          {
            label: 'Empty column',
            onClick: () => {
              setModalIsOpen(true);
              setView(NewColumnViews.singleEmpty);
            },
            icon: <i className="fas fa-horizontal-rule" />,
          },
          {
            label: 'Add multiple empty columns',
            onClick: () => {
              setModalIsOpen(true);
              setView(NewColumnViews.multipleEmpty);
            },
            icon: (
              <i style={{ color: Styles.purple }} className="fad fa-line-columns" />
            ),
          },
          {
            label: 'New aggregate column',
            onClick: () => {
              setModalIsOpen(true);
              setView(NewColumnViews.aggregateColumn);
            },
            icon: (
              <i style={{ color: Styles.red }} className="fad fa-flux-capacitor" />
            ),
          },
          {
            label: 'Add a column from file upload',
            onClick: () => {
              setModalIsOpen(true);
              setView(NewColumnViews.fromUpload);
            },
            icon: <i style={{ color: Styles.blue }} className="far fa-file-plus" />,
          },
        ]}
      >
        Add columns
      </ButtonWithOptions>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>
          {view === NewColumnViews.singleEmpty && <p>single empty</p>}
          {view === NewColumnViews.multipleEmpty && <p>Multiple empty</p>}
          {view === NewColumnViews.aggregateColumn && <p>aggregateColumn</p>}
          {view === NewColumnViews.fromUpload && <p>From upload</p>}
        </Modal>
      )}
    </>
  );
};

export default NewColumns;
