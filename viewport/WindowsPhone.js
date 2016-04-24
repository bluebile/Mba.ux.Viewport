Ext.define('Mba.ux.Viewport.viewport.WindowsPhone', {
    override: 'Ext.viewport.WindowsPhone',

    onElementFocus: function() {
        this.callParent(arguments);
        window.scrollTo(0, 0);
    }

}, function() {
    Ext.onSetup(function() {
        if (!Ext.os.is.WindowsPhone) {
            return;
        }
        Ext.Viewport.setHeight(window.innerHeight);
    });
});
