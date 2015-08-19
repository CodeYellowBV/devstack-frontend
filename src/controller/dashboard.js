import app from '../app';
import VDashboard from 'view/dashboard';
import mUserCurrent from 'model/user/current';

export default {
    index() {
        app.content.show(new VDashboard({
            model: mUserCurrent,
        }));
    },
};
