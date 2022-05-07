import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Page = ({ children, title }) => {
  useEffect(() => {
    document.title = `Read Naturally Assessment Exercise - ${title}`;
  });

  return (
    <>
      <Header title={title}/>
      <main>
        {children}
      </main>
      <Footer/>
    </>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default Page;