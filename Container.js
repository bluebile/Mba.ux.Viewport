Ext.define('Mba.ux.Viewport.Container', {
    extend: 'Ext.Container',
    xtype: 'mba_container',

    requires: 'Mba.ux.Viewport.NavBar',

    constructor: function() {
        this.callParent(arguments);

        var navBar = Ext.create('Mba.ux.Viewport.NavBar', {
            itemId: 'systemTab',
            title: this.getTitle(),
            items: this.getNavbar()
        });
        this.insert(0, navBar);
    },

    config: {
        title: 'Novo título',
        navbar: null
    }

});
