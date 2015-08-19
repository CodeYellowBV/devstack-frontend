import Model from 'crux/model';

export default class extends Model {
    initialize() {
        super.initialize();

        this.urlRoot = 'api/user';
    }
    defaults() {
        return {
            id: null,
            username: '',
            email: '',
            roles: [],
            permissions: {},
            last_login: null,
        };
    }
    parse(response) {
        response.last_login = response.last_login ? moment.unix(response.last_login) : null;

        return response;
    }
    toHuman() {
        const data = Model.prototype.toHuman.call(this);

        // Keep last_login a moment object when serializing.
        data.last_login = this.get('last_login');

        return data;
    }
}
