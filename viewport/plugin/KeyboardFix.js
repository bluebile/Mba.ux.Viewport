/**
 * Correcao scroll teclado para iOS dependencia do ionic.keyboard
 * 
 * @class Mba.ux.Viewport.viewport.plugin.KeyboardFix
 * @extends Ext.Evented
 */
Ext.define('Mba.ux.Viewport.viewport.plugin.KeyboardFix', {
    extend: 'Ext.Evented',
    alias: 'plugin.keyboardfix',

    requires: [ 'Mba.ux.Viewport.ScrollerForce' ],

    init: function(viewport) {

        var scroller = this.getScroller();
        if (Ext.browser.is.Cordova) {

            var animate = true;
            if (Ext.os.is.iOS) {
                animate = false;
                cordova.plugins.Keyboard.disableScroll(true);
            }

            window.addEventListener('native.keyboardshow', function(e) {
                scroller.scrollFocusedFieldIntoView(viewport, e.keyboardHeight, animate);
            }, false);
            window.addEventListener('native.keyboardhide', function() {
                var lastScroller = scroller.lastScroller;
                if (lastScroller) {
                    lastScroller.scrollTo(0, scroller.lastPositionY, false);
                }
            }, false);
        }

        Ext.override(viewport, {
            onElementFocus: function() {
                this.callOverridden(arguments);
                scroller.scrollFocusedFieldIntoView(viewport);
            }
        });
    },

    getScroller: function() {
        return Ext.create('Mba.ux.Viewport.ScrollerForce');
    }
});
