import React, { createContext, useContext, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import FilterRow from './FilterRow';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .top {
    width: 100%;
    display: flex;
    z-index: 1;
    align-items: center;
    button {
      margin-left: auto;
      padding: 0;
      margin-bottom: 1.375rem;
    }
  }
  .options__container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .actions__container {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
  }
`;

const sampleState: IFilterLayer = [
  'AND',
  {
    filterId: uuidv4(),
    key: '2d9dc775-d7f2-4acc-ba07-6f20493abac8',
    value: '1',
    predicateType: 'equals',
  },
  // [
  //   'OR',
  //   {
  //     filterId: uuidv4(),
  //     key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8c06',
  //     value: 'marvel/0001/002.jpg',
  //     predicateType: 'equals',
  //   },
  //   {
  //     filterId: uuidv4(),
  //     key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8casdf06',
  //     value: 'marvel/0001/003.jpg',
  //     predicateType: 'equals',
  //   },
  //   [
  //     'AND',
  //     {
  //       filterId: uuidv4(),
  //       key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8c06',
  //       value: 'marvel/0001/002.jpg',
  //       predicateType: 'equals',
  //     },
  //     {
  //       filterId: uuidv4(),
  //       key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8casdf06',
  //       value: 'marvel/0001/003.jpg',
  //       predicateType: 'equals',
  //     },
  //   ],
  // ],
];

export const FilterContext = createContext<{
  parentFilterState?: IFilterLayer;
}>({ parentFilterState: undefined });

const DatasetFilters: React.FC = () => {
  const initialFiltersState = useRef<IFilterLayer>(sampleState);
  const [filtersState, setFiltersState] = useState<IFilterLayer>(sampleState);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { datasetHead } = useContext(DatasetContext)!;

  const sort = R.sortBy(x => Array.isArray(x));
  const sortFilterLayer = (layer: any) => {
    if (!layer.find((x: any) => Array.isArray(x))) return layer;
    return sort(
      layer.map((x: any) => (Array.isArray(x) ? sortFilterLayer(sort(x)) : x)),
    );
  };

  const sortedFiltersState = sortFilterLayer(filtersState);

  return (
    <FiltersContainer>
      <div className="top">
        <h6>Filter {datasetHead.title}</h6>
        <ButtonTertiary onClick={() => setFiltersState([])}>
          Clear all filters
        </ButtonTertiary>
      </div>
      <div className="options__container">
        <FilterContext.Provider
          value={{
            parentFilterState: sortedFiltersState,
          }}
        >
          <FilterRow
            parent
            setFiltersState={filterState => {
              setUnsavedChanges(true);
              setFiltersState(filterState);
            }}
            filtersState={sortedFiltersState}
          />
        </FilterContext.Provider>
      </div>

      {unsavedChanges && (
        <div className="actions__container">
          <ButtonTertiary
            onClick={() => {
              setUnsavedChanges(false);
              setFiltersState(initialFiltersState.current);
            }}
          >
            Cancel
          </ButtonTertiary>
          <ButtonPrimary
            onClick={() => {
              setUnsavedChanges(false);
              initialFiltersState.current = sortedFiltersState;
            }}
          >
            Update
          </ButtonPrimary>
        </div>
      )}
    </FiltersContainer>
  );
};

export default DatasetFilters;
