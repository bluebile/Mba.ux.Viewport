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
            docked: 'top'
        });
        this.callParent(arguments);
        titleBar.insert(0, this.getBackButton());
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
                Ext.Viewport.getNavigation().back();
            }
        };
    }

});