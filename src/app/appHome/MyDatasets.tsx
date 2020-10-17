import DatasetCard from 'components/DatasetCard';
import { ButtonPrimary } from 'components/ui/Buttons';
import React from 'react';
import styled from 'styled-components/macro';

const MyDatasetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .top__bar {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    #new_dataset {
      margin-left: auto;
      i {
        color: white;
        margin-left: .5rem;
      }
    }
  }
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 4fr);
  }
`;

const MyDatasets: React.FC = () => {
  return (
    <MyDatasetsContainer>
      <div className="top__bar">
        <h3 style={{margin: 0}}>My datasets</h3>
        <ButtonPrimary id="new_dataset">
          New dataset <i className="fad fa-plus-circle" />
        </ButtonPrimary>
      </div>
      <ListContainer>
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} description={"Test description"} title="User events" />
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} description={"A compilation of all US Census submissions for the past 3 million years"} title="US Census Data" />
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="Arizona Voter Registration" />  
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="A really long title that is intended to test the line break functionality" />  
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="Testing line break" />
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="User events" />
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="US Census Data" />
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="Arizona Voter Registration" />  
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="A really long title that is intended to test the line break functionality" />  
        <DatasetCard timestamp={'2020-10-17T19:39:47+00:00'} title="Testing line break" />
      </ListContainer>
    </MyDatasetsContainer>
  )
}

export default MyDatasets;