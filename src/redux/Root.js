// Import react
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, useRouterHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {ApolloProvider} from 'react-apollo';
// Import custom
import configureStore from './store/configureStore';
import Routes from '../routes';
import {getAuthToken} from '../utils/auth';
var browserHistory = useRouterHistory(createBrowserHistory)();
browserHistory.listen(location => {
    setTimeout(() => {
        if (location.action === 'POP') {
            return;
        }
        window.scrollTo(0, 0);
    }, 10);
});
const networkInterface = createNetworkInterface({uri: 'http://localhost:3333/graphql'});
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {};  // Create the header object if needed.
        }
        req.options.headers['authorization'] = getAuthToken(true);
        next();
    }
}]);
const store = configureStore({}, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);
const client = new ApolloClient({networkInterface: networkInterface});
export default class Root extends Component {
    render() {
        return (
            <ApolloProvider store={store} client={client}>
                <Router history={history}>
                    {Routes()}
                </Router>
            </ApolloProvider>
        )
    }
}