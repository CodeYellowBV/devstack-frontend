import 'init';
import app from 'app';
import mUserCurrent from 'model/user/current';
import useCsrfToken from 'jquery-csrf-token';
import tXhrError from 'view/xhr-error.html';
import 'routes';

const xhrUser = mUserCurrent.fetch();

function start() {
    app.start();
    Backbone.history.start();
}

function error() {
    // The user is just not logged in.
    if (xhrUser.status === 401) {
        return start();
    }

    const errorTemplate = tXhrError({
        status: xhrUser.status,
    });

    // A real error occurred;
    $('body').addClass('big-error').html(errorTemplate);
}

xhrUser.done(start);
xhrUser.fail(error);

const xhrCsrf = $.get('api/csrf');

xhrCsrf.done((data) => useCsrfToken(data.token));
