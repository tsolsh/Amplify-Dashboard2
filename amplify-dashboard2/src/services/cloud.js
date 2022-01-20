import awsconfig from '../aws-exports';
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';

export const configCloud = () => {
  Amplify.configure(awsconfig);
  Auth.configure(awsconfig);
};