import TOverview from './overview.html';
import VItem from './user/item';

export default Marionette.CompositeView.extend({
    template: TOverview,
    childView: VItem,
    childViewContainer: 'tbody',
});
