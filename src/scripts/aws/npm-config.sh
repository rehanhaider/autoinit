#!/bin/bash


npm init -y
npm pkg set name=aws version=0.1.0
npm pkg delete description main keywords author license type
npm pkg set scripts.build=tsc scripts.test=jest scripts.watch='tsc -w' scripts.cdk=cdk

npm install --save aws-cdk-lib constructs
npm install --save-dev typescript @types/node @types/jest jest ts-node ts-jest aws-cdk
