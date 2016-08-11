/**
 * Classe responável por criar objetos dependentes de view especifica, melhorando performance do app
 *
 * @example
 *     Ext.define('TestPreload', {
 *        extend: 'Ext.Container',
 *        xtype: 'test',
 *        config: {
 *            plugins: [{
 *               type: 'preload',
 *               views: [
 *                   'Detail',
 *                   'List',
 *                   'Search'
 *               ]
 *           }],
 *       }
 *    });
 */
Ext.define('Mba.ux.Viewport.viewport.plugin.Preload', {
    extend: 'Ext.Evented',
    alias: 'plugin.preload',

    config: {
        /**
         * Coleção de views a serem criadas
         * @cfg {Array}
         */
        views: [],
        /**
         * Liga ou desliga a limpeza do objeto apos back em uma view
         * @cfg {Boolean}
         */
        clean: true,
        /**
         * Liga ou desliga o preload toda vez que executar show
         * @cfg {Boolean}
         */
        single: true
    },

    objects: [],

    init: function(view) {
        this.runShow(view);
        this.clear(view);
    },

    /**
     * Limpa objetos da memória apos execução de algum back no app
     * @private
     * @param {Ext.Component} view
     */
    clear: function(view) {
        var me = this;
        if (this.getClean()) {
            view.onAfter('back', function() {
                me.objects = [];
                me.runShow(view);
            });
        }
    },

    /**
     * Cria objetos dependentes em paralelo apos apresentacao de view
     * @param view
     */
    runShow: function(view) {
        var views = this.getViews(),
            me    = this;

        view.onAfter('show', function() {
            var fnCreate = function(view) {
                return function() {
                    me.objects.push(Ext.create(view));
                }
            };
            for (var i = 0, length = views.length; i < length; i++) {
                setTimeout(fnCreate(views[i]), 1);
            }
        }, view, {single: this.getSingle()});
    }
});
