Ext.define('Mba.ux.Viewport.NavBar', {
    extend: 'Ext.Evented',
    xtype: 'navbar',

    requires: [
        'Mba.ux.Viewport.titlebar.TitleBar',
        'Ext.TitleBar'
    ],

    config: {
        items: []
    },

    constructor: function() {
        var titleBar = Ext.create('Ext.TitleBar', {
            items: arguments[0].items || [],
            title: arguments[0].title,
            itemId: arguments[0].itemId,
            cls: arguments[0].modal ? '': 'navigation-bar',
            docked: 'top'
        }), button = null;
        this.callParent(arguments);

        if (arguments[0].modal) {
            button = this.getCloseModalButton();
        } else {
            button = this.getBackButton();
        }

        titleBar.insert(0, button);
        titleBar.onBefore('painted', function() {
            titleBar.down('#systemBackButton').setHidden(
                Ext.isEmpty(Ext.Viewport.getNavigation().getNavigationStack())
            );
        });

        return titleBar;
    },

    getBackButton: function() {
        return {
            xtype: 'button',
            align: 'left',
            hidden: Ext.isEmpty(Ext.Viewport.getNavigation().getNavigationStack()),
            itemId: 'systemBackButton',
            iconCls: Ext.os.is.Android ? 'ion-md-arrow-back' : 'ion-ios-arrow-back',
            handler: function() {
                Ext.Viewport.onBack();
            }
        };
    },

    getCloseModalButton: function() {
        return {
            xtype: 'button',
            cls: 'back-modal',
            align: Ext.os.is.iOS ? 'left' : 'right',
            itemId: 'systemBackButton',
            text: Ext.os.is.iOS ? MbaLocale.get('geral.botao.voltar') : '<i class="ion-md-close"></i>',
            ui: 'plain',
            handler: function() {
                Ext.Viewport.onBack();
            }
        };
    }

});
