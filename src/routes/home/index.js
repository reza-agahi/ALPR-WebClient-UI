import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';
import routes from '../../constants/routes';

async function action() {
  return {
    title: 'React Starter Kit',
    chunks: ['home'],
    component: (
      <Layout currentRoute={routes.HOME}>
        <Home />
      </Layout>
    ),
  };
}

export default action;
