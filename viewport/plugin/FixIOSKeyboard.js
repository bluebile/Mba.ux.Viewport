/**
 * Correcao scroll teclado para iOS dependencia do ionic.keyboard
 * 
 * @class Mba.ux.Viewport.viewport.plugin.FixIOSKeyboard
 * @extends Ext.Evented
 */
Ext.define('Mba.ux.Viewport.viewport.plugin.FixIOSKeyboard', {
    extend: 'Ext.Evented',
    alias: 'plugin.fixioskeyboard',

    init: function(viewport) {
        if (Ext.browser.is.Cordova && Ext.os.is.iOS) {
            cordova.plugins.Keyboard.disableScroll(true);
            window.addEventListener('native.keyboardshow', function(e) {
                viewport.getFixFocus().scrollFocusedFieldIntoView(viewport, e.keyboardHeight, false);
            }, false);
            window.addEventListener('native.keyboardhide', function() {
                var fixFocus = viewport.getFixFocus(),
                    lastScroller = fixFocus.lastScroller;
                if (lastScroller) {
                    lastScroller.scrollTo(0, fixFocus.lastPositionY, false);
                }
            }, false);
        }
    }
});
