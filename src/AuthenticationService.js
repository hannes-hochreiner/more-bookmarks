import {default as uuid} from 'uuid/v4';
import {PubSub} from './PubSub';
import {Authentication} from './Authentication';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-central-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-central-1_2I8j7ljWQ',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 'thm9p77ic2atfmet5un6qrmba',
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

let ps = new PubSub('net.hochreiner.more-bookmarks', uuid);
let authentication = Authentication.bind(null, ps, Auth);

export default authentication;
