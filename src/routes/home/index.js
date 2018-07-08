import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';
import routes from '../../constants/routes';
import titles from '../../constants/titles';

async function action() {
  return {
    title: titles.HOME,
    chunks: ['home'],
    component: (
      <Layout currentRoute={routes.HOME}>
        <Home />
      </Layout>
    ),
  };
}

export default action;
