import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';

import Page from '../components/Page';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import '../css/pages/Students.scss';

const serverFields = [
  'first_name',
  'last_name',
  'username',
  'school_name',
  'licensed'
];

const checkboxRenderer = params => {
  const input = document.createElement('div');

  input.classList.add('form-check');

  input.innerHTML = `
    <input
      class="form-check-input"
      type="checkbox"
      title="${params.colDef.headerName}"
      ${params.value ? 'checked="checked"' : ''}
    />
  `;

  input.addEventListener('change', e => {
    params.node.setDataValue(params.colDef.field, e.target.checked)
  });

  return input;
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [saveUpdatesToServer, setSaveUpdatesToServer] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Student Picture');
  const [selectedRows, setSelectedRows] = useState([]);
  const [gridAPI, setGridAPI] = useState(null);
  const [filter, setFilter] = useState('');
  const [filters, setFilters] = useState([]);
  const [lastFilter, setLastFilter] = useState('');

  const PictureModal = () => (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          className="img-fluid"
          src="/img/student-pic.png"
          alt="Student picture."
        />
      </Modal.Body>
    </Modal>
  );

  const pictureModalRenderer = (params) => {
    const link = document.createElement('a');

    link.innerHTML = params.value;
    link.setAttribute('href', '#');

    link.addEventListener('click', e => {
      e.preventDefault();
      setModalTitle(params.data.first_name + ' ' + params.data.last_name);
      setShowModal(true);
    });

    return link;
  };
  
  const columnDefs = [{
    headerName: '',
    checkboxSelection: true,
    minWidth: 24,
    maxWidth: 50
  },{
    field: 'id',
    headerName: 'ID',
    hide: true
  },{
    field: 'first_name',
    headerName: 'First Name',
    editable: true,
    sortable: true
  },{
    field: 'last_name',
    headerName: 'Last Name',
    editable: true,
    sortable: true
  },{
    field: 'username',
    headerName: 'Username',
    editable: false,
    sortable: true,
    cellRenderer: pictureModalRenderer
  },{
    field: 'school_name',
    headerName: 'School Name',
    editable: true,
    sortable: true
  },{
    field: 'licensed',
    headerName: 'Licensed',
    sortable: true,
    cellRenderer: checkboxRenderer,
    maxWidth: 100
  }];

  const loadStudents = () => {
    axios
      .get(process.env.API_URL + '/students').then(response => {
        for(let i = 0; i < response.data.length; i++) {
          response.data[i].selected = false;
        }

        setStudents(response.data);
        console.log(response);
      })
      .catch(error => {
        console.error('Error loading students:', error);
        setTimeout(loadStudents, 1000);
      });
  };

  const saveUpdate = e => {
    if(!saveUpdatesToServer || !serverFields.includes(e.colDef.field, serverFields)) {
      setSaveUpdatesToServer(true);
      return;
    }

    const field = e.colDef.field;
    const oldValue = e.oldValue;
    const newValue = field === 'licensed' ? (e.newValue ? 1 : 0) : e.newValue;
    const id = e.data.id;
    const row = e.node;

    axios
      .post(`${process.env.API_URL}/students/${id}/update`, {
        [field]: newValue
      })
      .then(response => {
        if(response.status !== 200) {
          throw 'Error updating data.';
        }
      })
      .catch(() => {
        setSaveUpdatesToServer(false);
        row.setDataValue(field, oldValue);
      });
  };

  const deleteSelected = () => {
    if(!selectedRows.length) {
      return;
    }

    selectedRows.forEach(function(row) {
      axios
        .delete(process.env.API_URL + '/students/' + row.data.id + '/delete')
        .then(() => {
          gridAPI.applyTransaction({
            remove: [row.data]
          })
        })
    });
  };

  const executeFilter = (newFilter) => {
    setFilter(newFilter);
    setLastFilter(newFilter);
    gridAPI.setQuickFilter(newFilter)

    if(newFilter && !filters.includes(newFilter)) {
      setFilters([newFilter, ...filters]);
    }
  };

  useEffect(loadStudents, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      gridAPI.sizeColumnsToFit();
    });
  });

  return (
    <Page title="Students">
      <PictureModal />
      <div className="container-fluid">
        <div className="row align-items-end mb-1">
          <div className="col col-12 col-md-8 form-inline justify-content-md-end order-md-2 mb-1 mb-md-0">
            {filters.length ? (
              <div className="w-100 text-md-right">
                <ul className="d-md-inline-block filter-list">
                  {filters.map(itemFilter => (
                    <li key={itemFilter}>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => executeFilter(itemFilter)}
                      >{itemFilter}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="form-group filter-form-group">
              <input
                id="filter"
                name="filter"
                className="form-control ml-0 ml-md-1 mb-1 mb-md-0"
                value={filter}
                placeholder="Enter filter here."
                onChange={e => setFilter(e.target.value)}
                onKeyDown={e => {
                  if(e.key === 'Enter') {
                    executeFilter(filter);
                  }
                }}
              />
              <button
                className="btn btn-primary ml-0 ml-md-1"
                type="button"
                onClick={() => executeFilter(filter)}
                disabled={filter === lastFilter}
              >Filter</button>
              <button
                className="btn btn-primary ml-1"
                type="button"
                onClick={() => executeFilter('')}
                disabled={!filter}
              >Clear Filter</button>
            </div>
          </div>
          <div className="col col-12 col-md-4">
            <button
              className="btn btn-primary mr-3"
              onClick={deleteSelected}
              disabled={selectedRows.length ? null : 'disabled'}
            >Delete Selected</button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="ag-theme-alpine">
              <AgGridReact
                rowData={students}
                columnDefs={columnDefs}
                onCellValueChanged={saveUpdate}
                domLayout="autoHeight"
                rowSelection="multiple"
                onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedNodes())}
                onGridReady={e => {
                  setGridAPI(e.api);
                  e.api.sizeColumnsToFit();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
};

export default Students;