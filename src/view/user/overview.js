import TOverview from './overview.html';
import VOverview from './overview/overview';
import VPaginator from 'marionette-crux-paginator';

export default Marionette.LayoutView.extend({
    template: _.template(TOverview),
    regions: {
        paginator: '._paginator-region',
        overview: '._overview-region',
    },
    onBeforeShow() {
        this.overview.show(new VOverview({
            collection: this.collection,
        }));

        this.paginator.show(new VPaginator({
            collection: this.collection,
        }));
    },
});
