// Create new app.
const app = new Marionette.Application();

app.addRegions({
    header: '#_header',
    content: '#_content',
    footer: '#_footer',
});

app.listenTo(vent, 'after:user:logout:success', function(data) {
    if (data && data.masqueraded) {
        document.location.reload();
    } else {
        Backbone.history.navigate('', true);
    }
});

export default app;
