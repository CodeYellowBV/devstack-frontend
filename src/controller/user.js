import app from '../app';
import mUserCurrent from 'model/user/current';
import VUserLoginForm from 'view/user/login/form';
import VUserOverview from 'view/user/overview';
import CUser from 'collection/user';

export default {
    login() {
        // Check if user is logged in. If so, redirect.
        if (!mUserCurrent.isLoggedIn()) {
            app.content.show(new VUserLoginForm({
                model: mUserCurrent,
            }));
        } else {
            Backbone.history.navigate('dashboard', true);
        }
    },
    logout() {
        mUserCurrent.logout();
    },
    overview() {
        const cUser = new CUser();

        cUser.fetch();

        app.content.show(new VUserOverview({
            collection: cUser,
        }));
    },
};
