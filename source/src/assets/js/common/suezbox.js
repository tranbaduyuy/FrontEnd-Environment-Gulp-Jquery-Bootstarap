/**
 *  @name suezbox
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  var site = window.suez;
  function Suezbox($content, config) {
    if (this instanceof Suezbox) {
      this.id = Suezbox.id++;
      this.setup($content, config);
      this.chainCallbacks(Suezbox._callbackChain);
    } else {
      var fl = new Suezbox($content, config);
      fl.open();
      return fl;
    }
  }

  var opened = [],
    pruneOpened = function(remove) {
      opened = $.grep(opened, function(fl) {
        return fl !== remove && fl.$instance.closest('body').length > 0;
      });
      return opened;
    };

  var structure = function(obj, prefix) {
    var result = {},
      regex = new RegExp('^' + prefix + '([A-Z])(.*)');
    for (var key in obj) {
      var match = key.match(regex);
      if (match) {
        var dasherized = (match[1] + match[2].replace(/([A-Z])/g, '-$1')).toLowerCase();
        result[dasherized] = obj[key];
      }
    }
    return result;
  };

  var eventMap = {resize: 'onResize' };

  var globalEventHandler = function(event) {
    $.each(Suezbox.opened().reverse(), function() {
      if (!event.isDefaultPrevented()) {
        if (false === this[eventMap[event.type]](event)) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
    });
  };

  var toggleGlobalEvents = function(set) {
    if (set !== Suezbox._globalHandlerInstalled) {
      Suezbox._globalHandlerInstalled = set;
      var events = $.map(eventMap, function(_, name) {
        return name + '.' + Suezbox.prototype.namespace;
      }).join(' ');
      $(window)[set ? 'on' : 'off'](events, globalEventHandler);
    }
  };

  Suezbox.prototype = {
    constructor: Suezbox,
    namespace: 'suezbox',
    targetAttr: 'data-suezbox',
    variant: null,
    resetCss: false,
    background: null,
    openTrigger: 'click',
    closeTrigger: 'click',
    filter: null,
    root: '#external',
    openSpeed: 250,
    closeSpeed: 250,
    closeOnClick: 'background',
    closeOnEsc: true,
    closeIcon: '',
    loading: '',
    persist: false,
    otherClose: null,
    beforeOpen: $.noop,
    beforeContent: $.noop,
    beforeClose: $.noop,
    afterOpen: $.noop,
    afterContent: $.noop,
    afterClose: $.noop,
    onResize: $.noop,
    type: null,
    contentFilters: ['image', 'html'],
    setup: function(target, config) {
      if (typeof target === 'object' && target instanceof $ === false && !config) {
        config = target;
        target = undefined;
      }

      var self = $.extend(this, config, { target: target }),
        css = !self.resetCss ? self.namespace : self.namespace + '-reset',
        $background = $(self.background || [
          '<div role="dialog" class="' + css + '-loading ' + css + '">',
          '<div class="' + css + '-content">',
          '<button title="Close lightbox" class="' + css + '-close-icon ' + self.namespace + '-close">',
          self.closeIcon,
          '</button>',
          '<div class="' + self.namespace + '-inner">' + self.loading + '</div>',
          '</div>',
          '</div>'
        ].join('')),
        closeButtonSelector = '.' + self.namespace + '-close' + (self.otherClose ? ',' + self.otherClose : '');

      self.$instance = $background.clone().addClass(self.variant);
      self.$instance.on(self.closeTrigger + '.' + self.namespace, function(event) {
        var $target = $(event.target);
        if (('background' === self.closeOnClick && $target.is('.' + self.namespace)) || 'anywhere' === self.closeOnClick || $target.closest(closeButtonSelector).length) {
          self.close(event);
          event.preventDefault();
        }
      });
      $(document).off('keydown.' + self.namespace).on('keydown.' + self.namespace, function(ev) {
        var code = (ev.keyCode ? ev.keyCode : ev.which);
        if (code === 27) {
          self.close(event);
        }
      });
      return this;
    },

    getContent: function() {
      if (this.persist !== false && this.$content) {
        return this.$content;
      }
      var self = this,
        filters = this.constructor.contentFilters,
        readTargetAttr = function(name) {
          return self.$currentTarget && self.$currentTarget.attr(name);
        },
        targetValue = readTargetAttr(self.targetAttr),
        data = self.target || targetValue || '';

      var filter = filters[self.type];
      if (!filter && data in filters) {
        filter = filters[data];
        data = self.target && targetValue;
      }
      data = data || readTargetAttr('href') || '';

      if (!filter) {
        for (var filterName in filters) {
          if (self[filterName]) {
            filter = filters[filterName];
            data = self[filterName];
          }
        }
      }

      if (!filter) {
        var target = data;
        data = null;
        $.each(self.contentFilters, function() {
          filter = filters[this];
          if (filter.test) {
            data = filter.test(target);
          }
          if (!data && filter.regex && target.match && target.match(filter.regex)) {
            data = target;
          }
          return !data;
        });
        if (!data) {
          if ('console' in window) { window.console.error('Suezbox: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
          return false;
        }
      }
      return filter.process.call(self, data);
    },

    setContent: function($content) {
      var self = this;
      if ($content.is('iframe') || $('iframe', $content).length > 0) {
        self.$instance.addClass(self.namespace + '-iframe');
      }

      self.$instance.removeClass(self.namespace + '-loading');

      self.$instance.find('.' + self.namespace + '-inner')
        .not($content)
        .slice(1).remove().end()
        .replaceWith($.contains(self.$instance[0], $content[0]) ? '' : $content);

      self.$content = $content.addClass(self.namespace + '-inner');

      return self;
    },

    open: function(event) {
      var self = this;
      self.$instance.hide().prependTo(self.root);
      if ((!event || !event.isDefaultPrevented()) && self.beforeOpen(event) !== false) {

        if (event) {
          event.preventDefault();
        }
        var $content = self.getContent();

        if ($content) {
          opened.push(self);

          toggleGlobalEvents(true);
          site.freezeBody(true);
          self.$instance.fadeIn(self.openSpeed);
          self.beforeContent(event);
          return $.when($content)
            .always(function($content) {
              self.setContent($content);
              self.afterContent(event);
              if (self.$currentTarget.data('suezbox') === 'image') {
                var closeButton = self.$instance.find('.suezbox-close').first();
                closeButton.focus();
                var timer;
                closeButton.on('keydown', function(e) {
                  e.preventDefault();
                  var code = (e.keyCode ? e.keyCode : e.which);
                  if (code === 13) {
                    self.close();
                  }
                });
              }
            })
            .then(self.$instance.promise())
            /* Call afterOpen after fadeIn is done */
            .done(function() { self.afterOpen(event); });
        }
      }
      self.$instance.detach();
      return $.Deferred().reject().promise();
    },

    close: function(event) {
      var self = this,
        deferred = $.Deferred();

      if (self.beforeClose(event) === false) {
        deferred.reject();
      } else {

        if (0 === pruneOpened(self).length) {
          toggleGlobalEvents(false);
        }

        self.$instance.fadeOut(self.closeSpeed, function() {
          self.$instance.detach();
          self.$currentTarget.focus();
          self.afterClose(event);
          site.freezeBody(false);
          deferred.resolve();
        });
      }
      return deferred.promise();
    },

    resize: function(w, h) {
      if (w && h) {
        this.$content.css('width', '').css('height', '');
        var ratio = Math.max(
          w / (parseInt(this.$content.parent().css('width'), 10) - 1),
          h / (parseInt(this.$content.parent().css('height'), 10) - 1));
        if (ratio > 1) {
          ratio = h / Math.floor(h / ratio);
          this.$content.css('width', '' + w / ratio + 'px').css('height', '' + h / ratio + 'px');
        }
      }
    },

    chainCallbacks: function(chain) {
      for (var name in chain) {
        this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
      }
    }
  };

  $.extend(Suezbox, {
    id: 0,
    autoBind: '[data-suezbox]',
    defaults: Suezbox.prototype,
    contentFilters: {
      image: {
        regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
        process: function(url) {
          var self = this,
            deferred = $.Deferred(),
            img = new Image(),
            $img = $('<img src="' + url + '" alt="Lightbox image" class="' + self.namespace + '-image" />');
          img.onload = function() {
            $img.naturalWidth = img.width;
            $img.naturalHeight = img.height;
            deferred.resolve($img);
          };
          img.onerror = function() { deferred.reject($img); };
          img.src = url;
          return deferred.promise();
        }
      },
      html: {
        regex: /^\s*<[\w!][^<]*>/,
        process: function(html) {
          return $(html);
        }
      }
    },

    functionAttributes: ['beforeOpen', 'afterOpen', 'beforeContent', 'afterContent', 'beforeClose', 'afterClose'],

    readElementConfig: function(element, namespace) {
      var Klass = this,
        regexp = new RegExp('^data-' + namespace + '-(.*)'),
        config = {};
      if (element && element.attributes) {
        $.each(element.attributes, function() {
          var match = this.name.match(regexp);
          if (match) {
            var val = this.value,
              name = $.camelCase(match[1]);
            try { val = $.parseJSON(val); } catch (e) {}
            config[name] = val;
          }
        });
      }
      return config;
    },

    extend: function(child, defaults) {
      var Ctor = function() { this.constructor = child; };
      Ctor.prototype = this.prototype;
      child.prototype = new Ctor();
      child.__super__ = this.prototype;
      $.extend(child, this, defaults);
      child.defaults = child.prototype;
      return child;
    },

    attach: function($source, $content, config) {
      var Klass = this;
      if (typeof $content === 'object' && $content instanceof $ === false && !config) {
        config = $content;
        $content = undefined;
      }
      config = $.extend({}, config);

      var namespace = config.namespace || Klass.defaults.namespace,
        tempConfig = $.extend({}, Klass.defaults, Klass.readElementConfig($source[0], namespace), config),
        sharedPersist;

      $source.on(tempConfig.openTrigger + '.' + tempConfig.namespace, tempConfig.filter, function(event) {
        var elemConfig = $.extend({ $source: $source, $currentTarget: $(this) },
          Klass.readElementConfig($source[0], tempConfig.namespace),
          Klass.readElementConfig(this, tempConfig.namespace),
          config);
        var fl = sharedPersist || $(this).data('suezbox-persisted') || new Klass($content, elemConfig);
        if (fl.persist === 'shared') {
          sharedPersist = fl;
        } else if (fl.persist !== false) {
          $(this).data('suezbox-persisted', fl);
        }
        elemConfig.$currentTarget.blur();
        fl.open(event);
      });
      return $source;
    },

    current: function() {
      var all = this.opened();
      return all[all.length - 1] || null;
    },

    opened: function() {
      var klass = this;
      pruneOpened();
      return $.grep(opened, function(fl) {
        return fl instanceof klass;
      });
    },

    close: function(event) {
      var cur = this.current();
      if (cur) {
        return cur.close(event);
      }
    },

    _onReady: function() {
      var Klass = this;
      if (Klass.autoBind) {
        $(Klass.autoBind).each(function() {
          Klass.attach($(this));
        });
        $(document).on('click', Klass.autoBind, function(evt) {
          if (evt.isDefaultPrevented() || evt.namespace === 'suezbox') {
            return;
          }
          evt.preventDefault();
          Klass.attach($(evt.currentTarget));
          $(evt.target).trigger('click.suezbox');
        });
      }
    },

    _callbackChain: {
      onResize: function(_super, event) {
        this.resize(this.$content.naturalWidth, this.$content.naturalHeight);
        return _super(event);
      },
      afterContent: function(_super, event) {
        var r = _super(event);
        this.onResize(event);
        return r;
      }
    }
  });

  $.suezbox = Suezbox;

  $.fn.suezbox = function($content, config) {
    return Suezbox.attach(this, $content, config);
  };

  $(document).ready(function() { Suezbox._onReady(); });
}(jQuery, window));

(function($) {

  var callbackChain = {
    afterClose: function(_super, event) {
      var self = this;
      self.$instance.off('next.' + self.namespace + ' previous.' + self.namespace);
      return _super(event);
    },
    beforeOpen: function(_super, event) {
      var self = this;

      self.$instance.on('next.' + self.namespace + ' previous.' + self.namespace, function(event) {
        var offset = event.type === 'next' ? +1 : -1;
        self.navigateTo(self.currentNavigation() + offset);
      });
      self.$instance.find('.' + self.namespace + '-content')
        .append(self.createNavigation('previous'))
        .append(self.createNavigation('next'));
      return _super(event);
    },
    beforeContent: function(_super, event) {
      var index = this.currentNavigation();
      var len = this.slides().length;
      this.$instance
        .toggleClass(this.namespace + '-first-slide', index === 0)
        .toggleClass(this.namespace + '-last-slide', index === len - 1);
      return _super(event);
    }
  };

  function SuezboxGallery($source, config) {
    var self = this;
    if (this instanceof SuezboxGallery) {
      $.suezbox.apply(this, arguments);
      this.chainCallbacks(callbackChain);
    } else {
      var flg = new SuezboxGallery($.extend({ $source: $source, $currentTarget: $source.first() }, config));
      flg.open();
      return flg;
    }
    $(document).off('keydown.suezboxgallery').on('keydown.suezboxgallery', function(ev) {
      var code = (ev.keyCode ? ev.keyCode : ev.which);
      if (code === 37) { //Left Arrow
        $('.suezbox-previous').trigger('previous.suezbox');
      } else if (code === 39) { //Right Arrow
        $('.suezbox-next').trigger('next.suezbox');
      }
    });
  }

  $.suezbox.extend(SuezboxGallery, {
    autoBind: '[data-suezbox-gallery]'
  });

  $.extend(SuezboxGallery.prototype, {
    previousIcon: '',
    nextIcon: '',
    galleryFadeIn: 100,
    galleryFadeOut: 300,

    slides: function() {
      if (this.filter) {
        return this.$source.find(this.filter);
      }
      return this.$source;
    },

    images: function() {
      return this.slides();
    },

    currentNavigation: function() {
      return this.slides().index(this.$currentTarget);
    },

    navigateTo: function(index) {
      var self = this,
        source = self.slides(),
        len = source.length,
        $inner = self.$instance.find('.' + self.namespace + '-inner');
      index = ((index % len) + len) % len;
      self.$currentTarget = source.eq(index);
      self.beforeContent();
      return $.when(
        self.getContent(),
        $inner.fadeTo(self.galleryFadeOut, 0.2)
      ).always(function($newContent) {
        self.setContent($newContent);
        self.afterContent();
        $newContent.fadeTo(self.galleryFadeIn, 1);
      });
    },

    createNavigation: function(target) {
      var self = this;
      return $('<button title="Slideshow ' + target + ' Button" class="' + this.namespace + '-' + target + '"><span>' + this[target + 'Icon'] + '</span></button>').click(function() {
        $(this).trigger(target + '.' + self.namespace);
      });
    }
  });

  $.suezboxGallery = SuezboxGallery;

  $.fn.suezboxGallery = function(config) {
    return SuezboxGallery.attach(this, config);
  };
  $(document).ready(function() { SuezboxGallery._onReady(); });
}(jQuery, window));
