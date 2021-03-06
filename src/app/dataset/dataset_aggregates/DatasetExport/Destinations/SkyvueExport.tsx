import Separator from 'components/Separator';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Text } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { FC, useContext, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';

const ExportContainer = styled.div``;

const SkyvueExport: FC = () => {
  const [loading, setLoading] = useState(false);
  const { datasetHead, socket } = useContext(DatasetContext)!;
  const { accessToken } = useContext(UserContext);
  const [newTitle, setNewTitle] = useState(
    datasetHead.title ? `${datasetHead.title} (copy)` : '',
  );

  const handleRequest = async (datasetId?: string) => {
    setLoading(true);
    const newFile = await skyvueFetch(accessToken).post(
      `/datasets/duplicate/${datasetId}`,
      {
        newTitle,
      },
    );

    socket?.emit('saveAsNew', { newDatasetId: newFile._id });
    setLoading(false);
  };

  return (
    <ExportContainer>
      <h5>Export to a new Skyvue</h5>
      <Text size="sm" len="short">
        Duplicate {datasetHead.title ?? 'this dataset'} and create a new Skyvue
        without filters, groupings, or sorting applied. It's a snapshot in time of
        what your dataset currently looks like.
      </Text>

      <InputField
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        label="What would you like to name your new skyvue?"
        validationError={newTitle === '' ? 'Please enter a title' : ''}
      />
      <Separator />
      <ButtonPrimary
        loading={loading}
        onClick={() => handleRequest(datasetHead._id)}
      >
        Duplicate file
      </ButtonPrimary>
    </ExportContainer>
  );
};

export default SkyvueExport;
