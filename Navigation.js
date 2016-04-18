/**
 * Classe responsável por gerenciar a navegação das telas adicionadas a Viewport
 *
 * @class Mba.ux.Viewport.Navigation
 * @singleton
 * @alternateClassName viewport.navigation
 */
Ext.define('Mba.ux.Viewport.Navigation', {
    alternateClassName: 'viewport.navigation',

    config: {
        /**
         * @cfg [Array} xtypesResetable
         * Xtypes mapeados que são resetados {@link #clearNavigationStack} automicatimente,
         * também pode ser feito no config da View com atribuito 'resettable'
         */
        xtypesResetable: [],
        /**
         * @cfg {Object} closeApp
         * @cfg {String} closeApp.message
         * @cfg {Function} closeApp.fn (required)
         */
        closeApp: {
            message: 'Deseja realmente sair do aplicativo?',
            fn: function() {
                navigator.app.exitApp();
            }
        },
        /**
         * @cfg {Function} [appEmptyHistoryBackFn=Mba.ux.Viewport.Navigation.closeAppFn()]
         * Callback utilizado na Viewport para tomar decisão o que fazer quando a navegação retorna para View inicial
         */
        appEmptyHistoryBackFn: function() {
            this.closeAppFn();
        },
        /**
         * @cfg {Array} navigationStack
         * Coleção de views adicionadas na Viewpor
         */
        navigationStack: []
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent([config]);
    },

    /**
     * @method
     * Antes de realizar atribuição para o objeto closeApp realiza validação se função de saida foi definida
     * @param {Object} currentClose
     */
    updateCloseApp: function(currentClose) {
        if (!currentClose) {
            return;
        }

        if (!Ext.isObject(currentClose)) {
            throw 'CloseApp not object.';
        }

        if (!Ext.isFunction(currentClose.fn)) {
            throw 'Callback Close is required.';
        }
    },

    /**
     * @method
     * Ativa uma view na Viewport de acordo com xtype, permite setar configs e animação como segundo e terceiro argumento
     * @param {xtype} viewXtype
     * @param {Object} [options]
     * @param {Object} [animation]
     * @returns {Object} retorna o objeto de acordo com xtype passado no primeiro argumento
     */
    activateView: function(viewXtype, options, animation) {
        var view;

        if (!(view = Ext.Viewport.child(viewXtype))) {
            view = Ext.Viewport.add({xtype: viewXtype});
        }

        if(!animation && Ext.isFunction(view.getAnimation)) {
            animation = view.getAnimation();
            animation.direction = 'left';
        }

        this.setOptionsView(view, options);

        if (view.isInnerItem()) {
            if (animation) {
                Ext.Viewport.animateActiveItem(view, animation);
            } else {
                Ext.Viewport.setActiveItem(view);
            }
        } else {
            view.show();
        }

        this.orderHistory(viewXtype);

        return view;
    },

    /**
     * @method
     * Atribui configs para View (cls, hidden)
     * @param {Object} view
     * @param {Object} options
     * @private
     */
    setOptionsView: function(view, options) {
        for(var o in options) {
            view['set' + Ext.String.capitalize(o)](options[o]);
        }
    },

    /**
     * @method
     * Adiciona xtype para array {@link #navigationStack} de navegação
     * @param {xtype} viewXtype
     */
    orderHistory: function(viewXtype) {
        var stack = this.getNavigationStack(),
            pos;

        if ((pos = stack.indexOf(viewXtype)) >= 0) {
            stack.splice(pos, 1);
        }

        stack.push(viewXtype);
        this.setNavigationStack(stack);
    },

    /**
     * @method
     * Remove item da stack pelo xtype
     * @return {Boolean}
     */
    removeStack: function(xtype) {
        var stack = this.getNavigationStack(),
            pos;

        pos = stack.indexOf(xtype);

        if (pos === -1) {
            return false;
        }

        stack.splice(pos, 1);
        return true;
    },

    /**
     * @method
     * Navegação entre views, remove a última view adicionada a coleção ativando a na viewport {@link #activateView()}
     * @return {Boolean}
     */
    back: function() {
        var stack = this.getNavigationStack(),
            view, xtype, animation;

        if (stack.length <= 1) {
            return false;
        }

        this.clearAutoNavigation(stack[stack.length-1]);

        xtype = stack.pop();
        view = Ext.Viewport.child(xtype);

        if (!view.isInnerItem()) {
            view.hide();
            return view;
        }

        animation = this.getAnimation(view);

        if (animation) {
            animation.direction = 'right';
        }

        xtype  = stack.pop();
        this.activateView(xtype, null, animation);
        view.fireEvent('back', view);
        return view;
    },

    /**
     * @private
     * @param {Object} view
     */
    clearAutoNavigation: function(xtype) {
        var xtypes = this.getXtypesResetable()
        if (xtypes.indexOf(xtype) != -1) {
            this.clearNavigationStack();
            return  true;
        }

        var view = Ext.Viewport.child(xtype);

        if (!view) {
            return false;
        }

        if (view.resettable) {
            this.clearNavigationStack();
            return  true;
        }

        return false;
    },

    /**
     * @method
     * Retorna a animação atribuida para View caso está possua
     * @param {xtype} viewXtype
     * @returns {Object}
     */
    getAnimation: function(view) {
        if (typeof view === 'string') {
            view = Ext.Viewport.child(viewXtype);
        }

        return view.getAnimation ? view.getAnimation() : null;
    },

    /**
     * @method
     * Retira todos xtype atribuidos durante a navegação
     */
    clearNavigationStack: function() {
        this.setNavigationStack([]);
    },

    // @private
    closeAppFn: function() {
        var closeApp = this.getCloseApp();

        if (closeApp.message) {
            Ext.Msg.confirm(null, closeApp.message, (function(answer) {
                if (answer == 'sim') {
                    closeApp.fn();
                }
            }).bind(this));
        } else {
            closeApp.fn();
        }
    }
});
