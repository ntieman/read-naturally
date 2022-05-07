import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const requiredMessage = 'This field is required.';

import Page from '../components/Page';

import '../css/pages/AddStudent.scss';

const initialValues = {
  first_name: '',
  last_name: '',
  username: '',
  school_name: '',
  licensed: false
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required(requiredMessage),
  last_name: Yup.string()
    .required(requiredMessage),
  username: Yup.string()
    .required(requiredMessage),
  school_name: Yup.string()
    .required(requiredMessage)
});

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const name = props.name;

  if(props.type === 'checkbox') {
    props.className = 'form-check-input';
  }

  return (
    <div className="form-group">
      {props.type === 'checkbox' ? (
        <div className="form-check">
          <input
            id={name}
            className="form-check-input"
            {...field}
            {...props}
          />
          <label htmlFor={name} className="form-check-label">{label}</label>
        </div>
      ) : (
        <>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            {...field}
            {...props}
          />
        </>
      )}

      {meta.error && meta.touched ? (
        <span className="error d-block d-md-inline-block mt-1 mt-md-0 ml-md-1">{ meta.error }</span>
      ) : null}
    </div>
  )
}

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string
};

const AddStudent = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

  const submitForm = (values) => {
    setFormError('');

    values.licensed = values.licensed ? 1 : 0;

    return axios
      .post(`/api/students/add`, values)
      .then(() => {
        navigate('/students', { replace: true });
      })
      .catch(error => {
        console.error(error);
        setFormError('There was a problem saving the data. Please try again.');
      });
  };

  return (
    <Page title="Add Student">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submitForm}
            >
              {() => (
                <Form>
                  <FormInput label="First Name" name="first_name" placeholder="First name." />
                  <FormInput label="Last Name" name="last_name" placeholder="Last name." />
                  <FormInput label="Username" name="username" placeholder="Username" />
                  <FormInput label="School Name" name="school_name" placeholder="School name." />
                  <FormInput label="Licensed" name="licensed" type="checkbox" />
                  {formError ? (
                    <p className="error">{formError}</p>
                  ) : null}
                  <button
                    className="btn btn-primary"
                    type="submit"
                  >Submit</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Page>
  );
};

AddStudent.propTypes = {
  label: PropTypes.string.isRequired
}
export default AddStudent;