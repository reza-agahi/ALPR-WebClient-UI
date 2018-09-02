#!/bin/bash

pm2 delete all
rm database.sqlite
yarn build
pm2 start build/server.js --name alpr-ui
pm2 save