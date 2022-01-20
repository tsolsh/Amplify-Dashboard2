// eslint-disable-next-line no-unused-vars
import {AuthenticationDetails, IAuthenticationDetailsData, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';

let Pool = null;
/**
 * Authenticate user based on Username and Password.
 * @param {IAuthenticationDetailsData} authenticationData 
 * @param {function(CognitoUser,string)} onSuccess Function called if login was successfull, arguments: user and token.
 * @param {function} onFailure Function called if login was not successfull
 */
function login(authenticationData, onSuccess, onFailure, newPasswordRequired){
    if (!Pool) onFailure();
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = { Username: authenticationData.Username, Pool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => onSuccess(cognitoUser),
        onFailure,
        newPasswordRequired(userAttributes) {
            delete userAttributes.email_verified;
            userAttributes.given_name = authenticationData.Username;
            userAttributes.family_name = authenticationData.Username;
            newPasswordRequired(newPassword => cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this));
        }
    });
}

/**
 * If user authenticated lately, the browser might "remember" their tokens,
 * so a manual login won't be needed.
 * @param {function(CognitoUser,string)} onSuccess Function called if login was successfull, arguments: user and token.
 * @param {function} onFailure Function called if login was not successfull
 */
function recoverStoredUser(onSuccess, onFailure) {
    var user = Pool?.getCurrentUser();
    if (!user) return onFailure?.();

    const validate = () => {
        if (user.signInUserSession.isValid()) {
            onSuccess(user);
            return true;
        }
        return false;
    }
    user.getSession(() => validate() ||
        user.refreshSessionIfPossible().then(() => validate() || onFailure?.())
    );
}

export function initAuth({cognito}) { Pool = new CognitoUserPool(cognito); }
export default { recoverStoredUser, login }
