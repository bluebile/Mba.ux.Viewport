Ext.define('Mba.ux.Viewport.viewport.plugin.TransitionNative', {
    extend: 'Ext.Evented',
    alias: 'plugin.transitionnative',
    config: {
        animation: 'slide',
        platforms: null,
        options: null,
        eventIn: null,
        eventOut: null
    },

    view: null,

    init: function(object) {
        this.view = object;
        var browserEnv = Ext.browser.is,
            isEventShow,
            eventIn = 'animate',
            eventOut = 'back';

        if (!browserEnv.WebView || browserEnv.Ripple || !browserEnv.Cordova || Ext.os.is.WindowsPhone) {
            return;
        }

        if (!window.plugins && !window.plugins.nativepagetransitions) {
            throw 'Need plugin nativeoagetransitions';
        }

        isEventShow = this.isShowAnimation(object);

        if (isEventShow) {
            eventIn = 'show';
            eventOut = 'hide';
        }

        eventIn = this.getEventIn() || eventIn;
        eventOut = this.getEventOut() || eventOut;

        object.onBefore(eventIn,
            function(view, animation) {
                if (Ext.isObject(animation) && animation.type) {
                    this.setAnimation(animation.type);
                    this.setOptions(animation);
                }
                var scroll = object.getScrollable();

                if (scroll && Ext.os.is.WindowsPhone) {
                    scroll.destroy();
                }

                this.runTransitionOpen();
            },
            this
        );

        this.fixIos(object);
        this.fixWp8(object);

        object.onBefore(eventOut,
            function() {
                this.runTransactionBack();
            },
            this
        );
    },

    /**
     * @method
     * Detecta se a view utiliza show Animation
     */
    isShowAnimation: function(object) {
        var config;

        if (config = object.getInitialConfig('showAnimation')) {
            this.setAnimation(config.type.replace(/in/gi, ''));
            delete config.type;
            this.setOptions(config);
            object.setShowAnimation({});
            object.setHideAnimation({});
            return true;
        }

        return false;
    },

    /**
     * @private
     */
    fixIos: function(object) {
        if (Ext.os.is.iOS) {
            var cancel;
            object.on('beforeactivate', function(viewXtype) {
                if (viewXtype) {
                    clearTimeout(cancel);
                    cancel = setTimeout(function() {
                        Ext.Viewport.getNavigation().activateView(viewXtype);
                    }, 100);
                }
                return false;
            }, this);
        }
    },

    /**
     * @private
     */
    fixWp8: function(object) {
        if (Ext.os.is.WindowsPhone) {
            object.on('animationend', function() {
                object.setScrollable(object.getInitialConfig('scrollable'));
            });
        }
    },

    runTransitionOpen: function() {
        this.runTransition(this.getOptionsMerge());
    },

    applyAnimation: function(animation) {
        var animationPlatforms = this.getPlatforms(),
            osName = Ext.os.name.toLowerCase();

        if (animationPlatforms && osName in animationPlatforms) {
            if (animationPlatforms[osName].animation) {
                animation = animationPlatforms[osName].animation;
            }
        }

        return animation;
    },

    mergeOptions: function(options) {
        var animationPlatforms = this.getPlatforms(),
            osName = Ext.os.name.toLowerCase();

        if (animationPlatforms && osName in animationPlatforms) {
            if (animationPlatforms[osName].options) {
                options = Ext.apply({}, options, animationPlatforms[osName].options);
            }
        }

        return options;
    },

    getOptionsMerge: function() {
        var options = this.getOptions();
        if (!options) {
            options = this.mergeOptions();
        }

        return options || {};
    },

    applyOptions: function(options) {
        return this.mergeOptions(options);
    },

    runTransactionBack: function() {
        var options = this.getOptionsMerge(), direction;
        if (options.direction) {
            switch (true) {
                case options.direction === 'left':
                    direction = 'right';
                    break;
                case options.direction === 'right':
                    direction = 'left';
                    break;
                case options.direction === 'up':
                    direction = 'down';
                    break;
                case options.direction === 'down':
                    direction = 'up';
                    break;
            }
        }

        this.runTransition(Ext.merge({}, options, {direction: direction}));
    },

    runTransition: function(options) {
        var me = this,
            type = me.getAnimation();
        window.plugins.nativepagetransitions[type](
            Ext.apply({}, options),
            function() {
                me.view.fireEvent('animationend', me.view);
            },
            function() {} // called in case you pass in weird values
        );
    }
}, function() {

    Ext.onSetup(function() {

        var oldAnimate, overrideAnimateActiveItem, hasPlugin;
        // set configs do plugin default
        if (window.plugins && window.plugins.nativepagetransitions) {
            window.plugins.nativepagetransitions.globalOptions = {
                duration: 400,
                iosdelay: 60, // a number of milliseconds, or -1 (call executePendingTransition() when ready)
                androiddelay: 50, // a number of milliseconds, or -1 (call executePendingTransition() when ready)
                winphonedelay: 200,
                slowdownfactor: -1,
                slidePixels: 50,
                fixedPixelsTop: 0,    // currently for slide left/right only
                fixedPixelsBottom: 0  // currently for slide left/right only
            };
        }

        hasPlugin = function(item) {
            var plugins = item.getPlugins() || [];
            for (var i = 0, length = plugins.length; i < length; i++) {
                if (plugins[i].$className.indexOf('TransitionNative') !== -1) {
                    return plugins[i];
                }
            }

            return -1;
        };

        overrideAnimateActiveItem = function(item, animation) {
            if (Ext.isString(item)) {
                item = Ext.ComponentQuery.query(item)[0];
            }

            if (!Ext.isObject(item)) {
                this.callOverridden(arguments);
                return;
            }

            var type, direction, cancel,
                plugin = hasPlugin(item);

            if (plugin === -1) {
                this.callOverridden(arguments);
                return;
            }

            if (Ext.browser.is.Cordova && !Ext.os.is.WindowsPhone) {
                if (Ext.os.is.iOS) {
                    item.fireEvent('animate', item, animation);
                    var me = this;
                    clearTimeout(cancel);
                    cancel = setTimeout(function() {
                        me.setActiveItem(item);
                    }, 100);
                    return;
                } else if (Ext.os.is.WindowsPhone && type === 'fade') {
                    this.setActiveItem(item);
                    return;
                }

                this.setActiveItem(item);
                item.fireEvent('animate', item, animation);
                return;
            }
            if (!animation) {
                animation = {};
                animation.type = plugin.getAnimation();
                if (plugin.getOptions()) {
                    animation.direction = plugin.getOptions().direction;
                }
            }

            oldAnimate.apply(this, [item, animation]);
            item.fireEvent('animationend', item);
        };

        oldAnimate = Ext.Container.prototype.animateActiveItem;
        Ext.override(Ext.Container, {
            animateActiveItem: overrideAnimateActiveItem
        });
    });
});
