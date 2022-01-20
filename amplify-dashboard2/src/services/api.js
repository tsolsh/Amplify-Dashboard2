import axios from "axios";

export const baseUrl =  process.env.API;//'http://localhost:8000/';
let bearerToken = '';

axios.defaults.baseURL = baseUrl
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, DNT, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Range';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'PATCH, PUT, POST, GET, DELETE, OPTIONS';
export const withToken = axios.create(), withoutToken = axios.create();

const _serverEventQueue = [];

/**
 * Set or unset bearer JWT token.
 * @param {string?} token bearer JWT token or null
 */
export function setToken(token) {
    bearerToken = token;
    if (token)
        withToken.defaults.headers.common.Authorization = 'bearer ' + token;
    else
        delete withToken.defaults.headers.common.Authorization;
}

export function handleError(fn, noError) {
    return withToken.interceptors.response.use(noError, fn);
}

export function getUrlWithToken(request) {
    const params = request.indexOf('?') > 0 ? '&token=' : '?token=';
    // return baseUrl + request + params + bearerToken;
    return (baseUrl + '::' + request + params + bearerToken).replace(/\/?::\/?/, '/');
}

/**
 * Send a single HTTP request to continuosly receive events.  
 * @param {string} request API relative URI
 * @param {object} callbacks function to be called for each event type
 * @returns {EventSource} an EventSource object. Use .close() to close HTTP connection.
 */
 export async function serverEvents(request, callbacks) {
    _serverEventQueue.push(request);
    function isItMyGo(resolve) {
        if (_serverEventQueue[0] === request) resolve();
        else setTimeout(isItMyGo, 333, resolve);
    }
    await new Promise(isItMyGo);
    const sse = new EventSource(getUrlWithToken(request)), done = () => {
        if (_serverEventQueue[0] === request) _serverEventQueue.shift();
    }
    for (let key in callbacks) {
        sse.addEventListener(key, e => callbacks[key](JSON.parse(e.data)));
    }
    sse.addEventListener('open', done);
    sse.addEventListener('error', done);
    return sse;
} 

/**
 * Call an API request.
 * @param {string} url API relative URI
 * @param {string?} method HTTP Method: 'get' (default), 'post', 'delete', etc...
 * @param {object?} data data if method is 'post', 'put' or 'patch'.
 * @returns {Promise} A Promise for the response. 
 */
export default (url, method, data) => withToken.request({url, method, data});
