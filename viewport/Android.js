Ext.define('Mba.ux.viewport.Android', {
    override: 'Ext.viewport.Android',

    onElementFocus: function() {
        this.callParent(arguments);
        this.scrollFocusedFieldIntoView();
    },

    scrollFocusedFieldIntoView: function() {
        var me = this,
            focusedDom = me.focusedElement,
            fieldEl = focusedDom && Ext.fly(focusedDom).up('.x-field'),
            fieldId = fieldEl && fieldEl.id,
            fieldCmp = fieldId && Ext.getCmp(fieldId),
            offsetTop = 0,
            scrollingContainer, scroller, scrollerEl, domCursor, thresholdY, containerHeight;

        if (!fieldCmp) {
            return;
        }

        scrollingContainer = fieldCmp.up('{getScrollable()}');

        if (scrollingContainer) {
            scroller = scrollingContainer.getScrollable().getScroller();
            scrollerEl = scroller.getElement();
            domCursor = focusedDom;

            while (domCursor && domCursor !== scrollerEl.dom) {
                offsetTop += domCursor.offsetTop;
                domCursor = domCursor.offsetParent;
            }

            containerHeight = scroller.getContainerSize().y;
            thresholdY = offsetTop + fieldEl.getHeight() + (me.config.fieldFocusPadding || 40);
            // console.log('offsetTop=%o, containerHeight=%o, thresholdY=%o', offsetTop, containerHeight, thresholdY);

            if (scroller.position.y + containerHeight < thresholdY) {
                // console.log('scrolling to ', thresholdY - containerHeight);
                scroller.scrollTo(0, thresholdY - containerHeight, true);
            }
        }
    },

    hideKeyboardIfNeeded: function() {
        var eventController = arguments[arguments.length - 1],
            focusedElement = this.focusedElement;

        if (focusedElement) {
            delete this.focusedElement;
            eventController.pause();

//            if (Ext.os.version.lt('4')) {
//                focusedElement.style.display = 'none';
//            }
//            else {
//                focusedElement.blur();
//            }

            setTimeout(function() {
                focusedElement.style.display = '';
                eventController.resume();
            }, 1000);
        }
    }
}, function() {
    Ext.onSetup(function() {
        if (!Ext.os.is.Android) {
            return;
        }
        Ext.Viewport.on('resize', 'scrollFocusedFieldIntoView');
    });
});
