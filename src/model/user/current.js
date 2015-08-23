/**
* A singleton model which constantly represents the currently
* logged-in user.
*/
import MUser from 'model/user';

class MUserCurrent extends MUser {
    fetch(options) {
        options = $.extend({
            url: 'api/user_current',
        }, options || {});

        return MUser.prototype.fetch.call(this, options);
    }
    isLoggedIn() {
        return this.get('id') !== null;
    }
    /**
     * Set a new current user that is logged in.
     */
    setNewModel(payload) {
        return this.clear().set(this.parse(payload));
    }
    /**
     * Login user.
     *
     * @param {Object} data Login data
     * @param {Object} params Params for ajax call.
     * @return {jqXHR} jqXHR
     */
    login(data, params) {
        let xhr = null;

        // Merge with defaults.
        params = $.extend(true, {
            url: this.urlRoot + '/login',
            headers: {
                Accept: 'application/json',
            },
            dataType: 'json',
            data,
            type: 'post',
        }, params || {});

        xhr = $.ajax(params);

        xhr.done((payload) => {
            if (!payload) {
                console.error('Did not receive user object, check contact!');
                return;
            }

            this.setNewModel(payload);

            vent.trigger('after:user:login:success', payload);
        });

        xhr.fail(() => {
            vent.trigger('after:user:login:fail');
        });

        return xhr;
    }
    /**
     * Logout user (might switch back to another user if this was a masqueraded login).
     *
     * @return {jqXHR} jqXHR
     */
    logout() {
        let xhr = null;
        const params = {
            url: this.urlRoot + '/logout',
            dataType: 'json',
            type: 'post',
        };

        xhr = $.ajax(params);

        xhr.done((data) => {
            // Clear user data.
            this.clear().set(this.defaults());

            // Trigger success event.
            vent.trigger('after:user:logout:success', data);
        });

        xhr.fail(() => {
            vent.trigger('after:user:logout:fail');
        });

        return xhr;
    }
    /**
     * Masquerade as another user ("su" to that user).
     *
     * @return {jqXHR} jqXHR
     */
    masquerade(model) {
        let xhr = null;
        const params = {
            url: this.urlRoot + '/' + model.get('id') + '/masquerade',
            dataType: 'json',
            type: 'get',
        };

        xhr = $.ajax(params);

        xhr.done((data, textStatus, jqXHR) => {
            Backbone.history.navigate('');
            document.location.reload();

            // Trigger success event.
            vent.trigger('after:user:masquerade:success', data, textStatus, jqXHR);
        });

        xhr.always(() => vent.trigger('after:user:masquerade'));

        xhr.fail((jqXHR, textStatus, errorThrown) => {
            vent.trigger('after:user:masquerade:fail', jqXHR, textStatus, errorThrown);
        });

        return xhr;
    }
}

export default new MUserCurrent();
