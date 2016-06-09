/**
 * Classe responável por eliminar a splascreeen após primeiro carregamento
 *
 * @class Mba.ux.Viewport.viewport.plugin.Splashscreen
 * @extends Ext.Evented
 *
 * @example
 *
 * Ext.application({
 *   name: 'Test',
 *   viewport: {
 *       xclass: 'Ext.viewport.Viewport',
 *       plugins: [{
 *           type: 'splashscreen'
 *       }]
 *   }
 * });
 */
Ext.define('Mba.ux.Viewport.viewport.plugin.Splashscreen', {

    alias: 'plugin.splashscreen',

    init: function(viewport) {
        if (navigator.splashscreen) {
            viewport.onAfter('activeitemchange', function(vp, item) {
                item.element.on('painted', function() {
                    navigator.splashscreen.hide();
                }, item, { single: true });
            }, viewport, { single: true } );
        }
    }
});
