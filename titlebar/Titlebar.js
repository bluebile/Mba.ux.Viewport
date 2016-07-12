Ext.define('Mba.ux.Viewport.titlebar.TitleBar', {
    override: 'Ext.TitleBar',

    requires: 'Ext.TitleBar',

    config: {
        titleAlign: Ext.os.is.iOS ? 'center' : 'left'
    },

    doBoxAdd: function(item) {
        if (item.config.align === 'right') {
            this.rightBox.add(item);
        } else {
            if (Ext.os.is.iOS) {
                this.leftBox.add(item);
            }
            this.leftBox.insert(0, item);
        }
    },

    applyInitialItems: function(items) {
        var me = this,
            titleAlign = me.getTitleAlign(),
            defaults = me.getDefaults() || {};

        me.initialItems = items;

        me.addLeftBox(me);
        me.addSpacer(me);
        me.addRightBox(me);

        switch (titleAlign) {
            case 'left':
                me.titleComponent = me.leftBox.add({
                    xtype: 'title',
                    cls: Ext.baseCSSPrefix + 'title-align-left',
                    hidden: defaults.hidden
                });
                me.refreshTitlePosition = Ext.emptyFn;
                break;
            case 'right':
                me.titleComponent = me.rightBox.add({
                    xtype: 'title',
                    cls: Ext.baseCSSPrefix + 'title-align-right',
                    hidden: defaults.hidden
                });
                me.refreshTitlePosition = Ext.emptyFn;
                break;
            default:
                me.titleComponent = me.add({
                    xtype: 'title',
                    hidden: defaults.hidden,
                    centered: true
                });
                break;
        }

        me.doAdd = me.doBoxAdd;
        me.remove = me.doBoxRemove;
        me.doInsert = me.doBoxInsert;
    },

    addLeftBox: function(me) {
        me.leftBox = me.add({
            xtype: 'container',
            cls: Ext.os.is.iOS ? '' : 'title-left',
            style: 'position: relative',
            layout: {
                type: 'hbox',
                align: 'center'
            },
            listeners: {
                resize: 'refreshTitlePosition',
                scope: me
            }
        });
    },

    addSpacer: function(me) {
        me.spacer = me.add({
            xtype: 'component',
            style: 'position: relative' + Ext.os.is.WindowsPhone ? ' -webkit-box-flex:1' : '',
            flex: 1,
            listeners: {
                resize: 'refreshTitlePosition',
                scope: me
            }
        });
    },

    addRightBox: function(me) {
        me.rightBox = me.add({
            xtype: 'container',
            style: 'position: relative',
            layout: {
                type: 'hbox',
                align: 'center'
            },
            listeners: {
                resize: 'refreshTitlePosition',
                scope: me
            }
        });
    }
});
