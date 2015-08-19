import TItem from './item.html';
import mUserCurrent from 'model/user/current';

export default Marionette.ItemView.extend({
    template: TItem,
    tagName: 'tr',
    ui: {
        masquerade: '._masquerade',
    },
    events: {
        'click @ui.masquerade': 'onMasquerade',
    },
    onMasquerade(e) {
        e.preventDefault();

        mUserCurrent.masquerade(this.model);
    },
});
