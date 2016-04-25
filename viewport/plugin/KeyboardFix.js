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

            var callScroller = function(scroll, container, anime) {
                return function(e) {
                    scroll.scrollFocusedFieldIntoView(container, e.keyboardHeight, anime);
                }
            }

            window.addEventListener(
                'native.keyboardshow',
                callScroller(scroller, viewport, animate),
                false
            );

            window.addEventListener('native.keyboardhide', function() {
                var lastScroller = scroller.lastScroller;
                if (lastScroller) {
                    lastScroller.scrollTo(0, scroller.lastPositionY, false);
                }
            }, false);
        }

        /*var original = viewport.onElementFocus;
         viewport.onElementFocus = function() {
         original.call(viewport, arguments);
         setTimeout(function() {
         scroller.scrollFocusedFieldIntoView(viewport);
         }, 50);
         }*/
    },

    getScroller: function() {
        return Ext.create('Mba.ux.Viewport.ScrollerForce');
    }
});
