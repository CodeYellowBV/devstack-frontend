import mUserCurrent from 'model/user/current';

import Home from 'controller/home';
import User from 'controller/user';
import Dashboard from 'controller/dashboard';

const routes = {
    '': Home.index,
    'login': User.login,
    'logout': User.logout,
    'user/overview': User.overview,
    'dashboard': Dashboard.index,
    'dashboard/:test': Dashboard.index,
};

// Start the router.
const AppRouter = Backbone.Router.extend({});
const router = new AppRouter();

// Validate logged in state for routes that require auth.
const excludeAuthRoutes = ['login', ''];

// Function that is executed before a controller gets called.
function beforeController(route) {
    if (excludeAuthRoutes.indexOf(route) === -1 && !mUserCurrent.isLoggedIn()) {
        Backbone.history.navigate('login', true);

        return false;
    }

    return true;
}

// Map given routes to a backbone route.
_.each(routes, function(controller, route) {
    function wrappedController() {
        if (beforeController(route)) {
            return controller.apply(this, arguments);
        }
    }

    router.route(route, wrappedController);
});

export default router;
