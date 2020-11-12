import Modal from 'components/ui/Modal';
import ButtonWithOptions from 'components/ui/ButtonWithOptions';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import Styles from 'styles/Styles';
import { makeBoardActions } from '../../lib/makeBoardActions';

const NewRows: React.FC = () => {
  enum NewRowViews {
    multipleEmpty,
    fromUpload,
  }

  const [view, setView] = useState(NewRowViews.multipleEmpty);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { boardData, setBoardData } = useContext(DatasetContext)!;
  const boardActions = makeBoardActions(boardData);
  return (
    <>
      <ButtonWithOptions
        pos={{ right: 2.25 }}
        options={[
          {
            label: 'Empty row',
            onClick: () => setBoardData!(boardActions.newRow()),
            icon: <i className="fas fa-horizontal-rule" />,
          },
          {
            label: 'Add multiple empty rows',
            onClick: () => {
              setView(NewRowViews.multipleEmpty);
              setModalIsOpen(true);
            },
            icon: (
              <i style={{ color: Styles.purple }} className="fad fa-line-columns" />
            ),
          },
          {
            label: 'New rows from file upload',
            onClick: () => {
              setView(NewRowViews.fromUpload);
              setModalIsOpen(true);
            },
            icon: <i style={{ color: Styles.blue }} className="far fa-file-plus" />,
          },
        ]}
      >
        Add rows
      </ButtonWithOptions>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>
          {view === NewRowViews.multipleEmpty && <p>Multiple empty</p>}
          {view === NewRowViews.fromUpload && <p>From upload</p>}
        </Modal>
      )}
    </>
  );
};

export default NewRows;