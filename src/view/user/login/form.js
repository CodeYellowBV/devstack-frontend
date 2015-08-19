import TLogin from './form.html';

export default Marionette.ItemView.extend({
    template: TLogin,
    ui: {
        usernameInput: '[name="username"]',
        errorText: '._error',
        form: 'form',
    },
    events: {
        'submit': 'onSubmit',
    },
    onShow() {
        this.ui.usernameInput.focus();
        this.ui.errorText.addClass('hide');
    },
    onSubmit(e) {
        e.preventDefault();

        const data = this.ui.form.serializeObject();
        const xhr = this.model.login(data);

        this.ui.errorText.addClass('hide');

        if (xhr) {
            xhr.done(() => Backbone.history.navigate('dashboard', true));

            xhr.fail(() => {
                let text;
                const directErrors = ['SUSPICIOUS', 'NOT_ACTIVATED'];

                if (directErrors.indexOf(xhr.responseJSON.error.code) > -1) {
                    text = xhr.responseJSON.error.message;
                } else {
                    text = 'Username or password is incorrect.';
                }

                this.ui.errorText.text(text).removeClass('hide');
            });
        }
    },
});
