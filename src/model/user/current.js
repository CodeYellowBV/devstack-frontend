import MUser from 'model/user';

class MUserCurrent extends MUser {
    isLoggedIn() {
        return this.get('id') !== null;
    }
    /**
     * Login user
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
            dataType: 'json',
            type: 'post',
            data,
        }, params || {});

        xhr = $.ajax(params);

        xhr.done((payload, textStatus, jqXHR) => {
            // Set user data.
            this.clear().set(this.parse(payload));

            // Trigger success event.
            vent.trigger('after:user:login:success', payload, textStatus, jqXHR);
        });

        xhr.always(() => {
            vent.trigger('after:user:login');
        });

        xhr.fail((jqXHR, textStatus, errorThrown) => {
            vent.trigger('after:user:login:fail', jqXHR, textStatus, errorThrown);
        });

        return xhr;
    }
    /**
     * Logout user (might switch back to another user if this was a masqueraded login)
     *
     * @return {jqXHR} jqXHR
     */
    logout() {
        const params = {
            url: this.urlRoot + '/logout',
            dataType: 'json',
            type: 'get',
        };
        let xhr = null;

        xhr = $.ajax(params);

        xhr.done((data, textStatus, jqXHR) => {
            // Set person data.
            this.clear().set(this.defaults());

            // Trigger success event.
            vent.trigger('after:user:logout:success', data, textStatus, jqXHR);
        });

        xhr.always(() => {
            vent.trigger('after:user:logout');
        });

        xhr.fail((jqXHR, textStatus, errorThrown) => {
            vent.trigger('after:user:logout:fail', jqXHR, textStatus, errorThrown);
        });

        return xhr;
    }
    /**
     * Masquerade as another user ("su" to that user).
     *
     * @return {jqXHR} jqXHR
     */
    masquerade(model) {
        const params = {
            url: this.urlRoot + '/' + model.get('id') + '/masquerade',
            dataType: 'json',
            type: 'get',
        };
        let xhr = null;

        xhr = $.ajax(params);

        xhr.done(() => {
            // TODO [Kees]: Fix properly.
            Backbone.history.navigate('');
            document.location.reload();
        });

        return xhr;
    }
}

export default new MUserCurrent();
