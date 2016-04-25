Ext.define('Mba.ux.Viewport.viewport.Android', {
    override: 'Ext.viewport.Android',

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
});
