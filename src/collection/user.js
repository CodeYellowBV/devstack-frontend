import Collection from 'crux/collection';
import MUser from 'model/user';

export default class extends Collection {
    initialize() {
        super.initialize();

        this.model = MUser;
        this.url = 'api/user';
    }
}
