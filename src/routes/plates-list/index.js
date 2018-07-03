import React from 'react';
import PlatesList from './PlatesList';
import Layout from '../../components/Layout';
import routes from '../../constants/routes';

async function action() {
  return {
    title: 'React Starter Kit',
    component: (
      <Layout currentRoute={routes.PLATES_LIST}>
        <PlatesList />
      </Layout>
    ),
  };
}

export default action;
