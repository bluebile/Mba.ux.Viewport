Ext.define('Mba.ux.Viewport.Focus', {
    singleton: true,

    scrollFocusedFieldIntoView: function(scope) {
        var me = scope,
            focusedDom = me.focusedElement,
            fieldEl = focusedDom && Ext.fly(focusedDom).up('.x-field'),
            fieldId = fieldEl && fieldEl.id,
            fieldCmp = fieldId && Ext.getCmp(fieldId),
            offsetTop = 0,
            scrollingContainer, scroller, scrollerEl, domCursor, thresholdY, containerHeight, animate = true;

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
            if (Ext.os.is.iOS) {
                thresholdY += Ext.Viewport.keyboardHeight;
                animate = false;
            }
            if (scroller.position.y + containerHeight < thresholdY) {
                scope.lastPositionY = scroller.position.y;
                scope.lastScrollReference = scroller;
                scope.lastScrollReference.scrollTo(0, thresholdY - containerHeight + 10, animate);
            }
        }
    }
});

