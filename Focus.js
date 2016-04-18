Ext.define('Mba.ux.Viewport.Focus', {
    singleton: true,

    scrollFocusedFieldIntoView: function(scope) {
        var me = scope,
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

            if (scroller.position.y + containerHeight < thresholdY) {
                scroller.scrollTo(0, thresholdY - containerHeight, true);
            }
        }
    }
});

