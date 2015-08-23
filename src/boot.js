import 'init';
import app from 'app';
import mUserCurrent from 'model/user/current';
import useCsrfToken from 'jquery-csrf-token';
import tXhrError from 'view/xhr-error.html';
import bootstrapper from 'bootstrapper';
import 'routes';

const xhr = $.get('api/bootstrap');

function start(data) {
    if (data.user) {
        mUserCurrent.setNewModel(data.user);
    }

    bootstrapper.setData(data);

    useCsrfToken(data.csrf_token);

    app.start(bootstrapper);
    Backbone.history.start();
}

function error() {
    const errorTemplate = tXhrError({
        status: xhr.status,
    });

    // A real error occurred;
    $('body').addClass('big-error').html(errorTemplate);
}

xhr.done(start);
xhr.fail(error);
