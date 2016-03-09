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

        home: null,
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

        if(!animation && view.getAnimation) {
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

        if (this.getHome() === null) {
            if (stack.length === 0) {
                this.setHome(viewXtype);
            }
        }

        if ((pos = stack.indexOf(viewXtype)) >= 0) {
            stack.splice(pos, 1);
        }

        if (viewXtype === this.home) {
            stack.unshift(viewXtype);
        }

        stack.push(viewXtype);
        this.setNavigationStack(stack);
    },

    /**
     * @method
     * Navegação entre views, remove a última view adicionada a coleção ativando a na viewport {@link #activateView()}
     * @returns {Boolean}
     */
    back: function() {
        var stack = this.getNavigationStack(),
            view, xtype, animation;

        if (stack.length <= 1) {
            return this.activeHome();
        }

        animation = this.getAnimation(stack.pop());

        if (animation) {
            animation.direction = 'right';
        }

        xtype  = stack.pop();
        view   = this.activateView(xtype, null, animation);

        this.clearAutoNavigation(view);

        return true;
    },

    /**
     * @method
     * Ativa a home se está for definida
     * @private
     * @return {Boolean}
     */
    activeHome: function() {
        var home = this.getHome(),
            stack = this.getNavigationStack(),
            animation, view;

        if (!home) {
            return false;
        }

        if (stack.length == 1 && stack[0] === home) {
            this.setHome(null);
            return false;
        }

        animation = this.getAnimation(home);
        view      = this.activateView(home, null, animation);

        this.clearAutoNavigation(view);
        this.setHome(null);
        return true;
    },

    /**
     * @private
     * @param {Object} view
     */
    clearAutoNavigation: function(view) {
        var xtypes = this.getXtypesResetable()
        if (xtypes.indexOf(view.xtype) || view.getResettable()) {
            this.clearNavigationStack();
        }
    },

    /**
     * @method
     * Retorna a animação atribuida para View caso está possua
     * @param {xtype} viewXtype
     * @returns {Object}
     */
    getAnimation: function(viewXtype) {
        var view = Ext.Viewport.child(viewXtype);

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
