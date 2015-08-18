Ext.define('Mba.ux.viewport.Android', {
    override: 'Ext.viewport.Android',
    requires: ['Mba.ux.Viewport.Focus'],

    onElementFocus: function() {
        this.callParent(arguments);
        Mba.ux.Viewport.Focus.scrollFocusedFieldIntoView();
    },

    hideKeyboardIfNeeded: function() {
        var eventController = arguments[arguments.length - 1],
            focusedElement = this.focusedElement;

        if (focusedElement) {
            delete this.focusedElement;
            eventController.pause();

            setTimeout(function() {
                focusedElement.style.display = '';
                eventController.resume();
            }, 1000);
        }
    }
}, function() {
    Ext.onSetup(function() {
        if (!Ext.os.is.Android) {
            return;
        }
        Ext.Viewport.on('resize', 'scrollFocusedFieldIntoView');
    });
});
