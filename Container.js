Ext.define('Mba.ux.Viewport.Container', {
    extend: 'Ext.Container',
    xtype: 'mba_container',

    requires: 'Mba.ux.Viewport.NavBar',

    constructor: function() {
        this.callParent(arguments);
        var navBar = Ext.create('Mba.ux.Viewport.NavBar', {
            itemId: 'systemTab',
            title: this.getTitle(),
            items: this.getNavbar(),
            modal: this.getModal() !== null
        });
        this.insert(0, navBar);

        if (this.getModal()) {
            var me = this;
            this.on('hide', function() {
                Ext.Viewport.getNavigation().removeStack(me.xtype);
                me.destroy();
            });
        }
    },

    config: {
        title: 'Novo título',
        navbar: null
    },

    updateTitle: function(newTitle) {
        var sysTab = this.down('#systemTab');
        if (sysTab) {
            sysTab.setTitle(newTitle);
        }
    }

});
