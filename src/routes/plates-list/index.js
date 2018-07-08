import React from 'react';
import PlatesList from './PlatesList';
import Layout from '../../components/Layout';
import routes from '../../constants/routes';
import titles from '../../constants/titles';

async function action() {
  return {
    title: titles.PLATES_LIST,
    component: (
      <Layout currentRoute={routes.PLATES_LIST}>
        <PlatesList />
      </Layout>
    ),
  };
}

export default action;
