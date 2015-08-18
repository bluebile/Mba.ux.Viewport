Ext.define('Mba.ux.viewport.Default', {
    override: 'Ext.viewport.Default',
    requires: ['Mba.ux.Viewport.Focus'],

    onElementFocus: function() {
        this.callParent(arguments);
        if (Ext.os.is.Android) {
            Mba.ux.Viewport.Focus.scrollFocusedFieldIntoView();
        }
    }

}, function() {
    Ext.onSetup(function() {
        if (Ext.os.is.Android) {
            Ext.Viewport.on('resize', 'scrollFocusedFieldIntoView');
        }
    });
});

