import app from '../app';
import VHome from 'view/home';

export default {
    index() {
        app.content.show(new VHome());
    },
};
