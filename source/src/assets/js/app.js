'use strict';

var site = (function(window) {
  var body = $('body');

  function init() {
    freezenBody();
    return true;
  }

  function isMobile() {
    return window.Modernizr.mq('(max-width: 767px)');
  }

  function isTablet() {
    return window.Modernizr.mq('(min-width: 768px) and (max-width: 1024px)');
  }

  function isDesktop() {
    return window.Modernizr.mq('(min-width: 1025px)');
  }

  function freezeBody(val) {
    var html = $('html');
    var body = $('body');
    var scrollPosition = $(window).scrollTop();
    if (val) {
      html.addClass('freeze-lock');
      body.addClass('freeze');
      body.css('top', -(scrollPosition));
    } else {
      scrollPosition = parseInt(body.css('top'), 10);
      html.removeClass('freeze-lock');
      body.removeClass('freeze');
      body.css('top', 0);
      if (scrollPosition) {
        $('body,html,document').scrollTop(-scrollPosition);
      }
    }
  }

  function initOverlay(overlaySel) {
    var el = body.find('.' + overlaySel);

    if (!el.length) {
      el = $('<div class="' + overlaySel + '"><span class="h-text">Overlay</span></div>');
      body.find('#external').append(el);
    }

    return el;
  }

  function freezenBody() {
    var doc = document,
      body = doc.querySelector('body'),
      scrollAble = doc.querySelector('.scroll-able');

    if (doc.addEventListener) {
      body.addEventListener('touchmove', function(e) {
        if (body.hasClass('freeze') && !$(e.target).closest('.scroll-able').length) {
          e.preventDefault();
        }
      });

      scrollAble.each(function() {
        var el = $(this).get(0);

        el.addEventListener('touchstart', function(e) {
          var scrollEl = $(e.currentTarget),
            hHeight = scrollEl[0].scrollHeight - scrollEl.outerHeight();

          if (!scrollEl.scrollTop()) {
            scrollEl.scrollTop(1);
          }

          if (scrollEl.scrollTop() === hHeight) {
            scrollEl.scrollTop(hHeight - 1);
          }

        });

        el.addEventListener('touchmove', function(e) {
          var scrollEl = $(e.currentTarget),
            hHeight = scrollEl[0].scrollHeight - scrollEl.outerHeight();

          if (scrollEl.scrollTop() === 0 || scrollEl.scrollTop() === hHeight) {
            e.preventDefault();
          }

        });
      });
    }
  }

  return {
    init: init,
    isMobile: isMobile,
    isTablet: isTablet,
    isDesktop: isDesktop,
    freezeBody: freezeBody,
    initOverlay: initOverlay
  };

})(window);
