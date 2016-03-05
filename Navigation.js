/**
 * Classe responsável por gerenciar a navegação das telas adicionadas a Viewport
 *
 * @class Mba.ux.Viewport.Navigation
 * @singleton
 * @alternateClassName viewport.navigation
 */
Ext.define('Mba.ux.Viewport.Navigation', {
    singleton: true,
    alternateClassName: 'viewport.navigation',
    config: {
        /**
         * @cfg {Boolean} confirmCloseApp=true
         *
         */
        confirmCloseApp: true,
        closeAppConfirmMessage: 'Deseja realmente sair do aplicativo?',
        closeAppFn: function() {navigator.app.exitApp()},
        appEmptyHistoryBackFn: function() {
            viewport.navigation.closeApp();
        },
        backOverrideFn: null,
        navigationStack: []
    },
    constructor : function (config)
    {
        this.initConfig(config);
        this.callParent([config]);
    },
    activateView: function(viewXtype, options, animation)
    {
        var view;

        if(!(view = Ext.Viewport.child(viewXtype))) {
            view = Ext.Viewport.add({xtype: viewXtype});
        }

        if(!animation && view.getAnimation) {
            animation = view.getAnimation();
            animation.direction = 'left';
        }

        for(var o in options) {
            view['set' + Ext.String.capitalize(o)](options[o]);
        }

        if (view.isInnerItem()) {
            if(animation) {
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
    orderHistory: function(viewXtype)
    {
        var stack = this.getNavigationStack(),
            pos;

        if ((pos = stack.indexOf(viewXtype)) >= 0) {
            stack.splice(pos, 1);
        }

        stack.push(viewXtype);
        this.setNavigationStack(stack);
    },

    back: function() {
        var stack = this.getNavigationStack();

        if (stack.length <= 1) {return false;}

        var animation = this.getAnimation(stack.pop());

        if (animation) {
            animation.direction = 'right';
        }

        this.activateView(stack.pop(), null, animation);

        return true;
    },

    getAnimation: function(viewXtype) {
        var view = Ext.Viewport.child(viewXtype);

        return view.getAnimation ? view.getAnimation() : null;
    },

    clearNavigationStack: function() {
        this.setNavigationStack([]);
    },

    clearBackOverride: function() {
        this.setBackOverrideFn(null);
    },

    closeApp: function()
    {
        if (this.getConfirmCloseApp()) {
            Ext.Msg.confirm(null, this.getCloseAppConfirmMessage(), (function(answer) {
                    if (answer == 'sim') {
                        this.getCloseAppFn()();
                    }
                }).bind(this)
            );
        } else {
            this.getCloseAppFn()();
        }
    }
});
