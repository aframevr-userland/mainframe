/* global AFRAME, THREE, WEBVRPLUS, ga, performance */
(function () {
  // Toggle this variable to output to the console debug GA messages.
  var debug = false;

  function initGoogleAnalytics (id, opts) {
    (function (c, v, a, n) {
      c.GoogleAnalyticsObject = n;

      c[n] = c[n] || function () {
        (c[n].q = c[n].q || []).push(arguments);
      };
      c[n].l = 1 * new Date();

      var s = v.createElement('script');
      s.async = true;
      s.src = a;
      s.addEventListener('load', enableDebug);

      var m = v.getElementsByTagName('script')[0];
      m.parentNode.insertBefore(s, m);
    })(window, document, 'https://www.google-analytics.com/analytics.js', 'ga');

    function enableDebug () {
      if (!debug) {
        return;
      }
      window.ga = console.info.bind(console);
    }

    enableDebug();

    ga('create', id, opts);
    ga('set', 'forceSSL', true);
    ga('send', 'pageview');
  }

  function initGoogleAnalyticsEvents () {
    var html = document.documentElement;

    window.addEventListener('load', function () {
      setTimeout(function () {
        var t = performance.timing;
        // Credit to https://github.com/addyosmani/timing.js/blob/c58c164/timing.js#L67-L88:
        // Total time from start to load.
        gaSendPageTiming('loadTime', t.loadEventEnd - t.fetchStart);
        // Time spent constructing the DOM tree.
        gaSendPageTiming('domReadyTime', t.domComplete - t.domInteractive);
        // Time consumed preparing the new page.
        gaSendPageTiming('readyStart', t.fetchStart - t.navigationStart);
        // Time spent during redirection.
        gaSendPageTiming('redirectTime', t.redirectEnd - t.redirectStart);
        // AppCache.
        gaSendPageTiming('appcacheTime', t.domainLookupStart - t.fetchStart);
        // Time spent unloading documents.
        gaSendPageTiming('unloadEventTime', t.unloadEventEnd - t.unloadEventStart);
        // DNS query time.
        gaSendPageTiming('lookupDomainTime', t.domainLookupEnd - t.domainLookupStart);
        // TCP connection time.
        gaSendPageTiming('connectTime', t.connectEnd - t.connectStart);
        // Time spent during the request.
        gaSendPageTiming('requestTime', t.responseEnd - t.requestStart);
        // Request to completion of the DOM loading.
        gaSendPageTiming('initDomTreeTime', t.domInteractive - t.responseEnd);
        // Load event time.
        gaSendPageTiming('loadEventTime', t.loadEventEnd - t.loadEventStart);
      });
    });

    var gaSendTiming = function (timingCategory, timingLabel) {
      return function (timingVar, timeEnd) {
        if (typeof timeEnd === 'undefined') {
          timeEnd = performance.now();
        }
        ga('send', {
          hitType: 'timing',
          timingCategory: timingCategory,
          timingVar: timingVar,
          timingValue: timeEnd,
          timingLabel: timingLabel
        });
      };
    };

    var gaSendPageTiming = gaSendTiming('page');

    ga('send', 'event', 'pageload.title', document.title);
    ga('send', 'event', 'pageload.location', window.location.href);
    ga('send', 'event', 'pageload.pathname', window.location.pathname);
    ga('send', 'event', 'pageload.querystring', window.location.search);
    ga('send', 'event', 'pageload.hash', window.location.hash);

    ga('send', 'event', 'supports.getVRDisplays', 'getVRDisplays' in navigator);
    ga('send', 'event', 'supports.getVRDevices', 'getVRDevices' in navigator);

    ga('send', 'event', 'libs.aframe', 'AFRAME' in window ? (AFRAME.version || '<unknown>') : 'null');
    ga('send', 'event', 'libs.three', 'THREE' in window ? (THREE.REVISION || '<unknown>') : 'null');
    ga('send', 'event', 'libs.webvrpolyfill', 'WebVRConfig' in window || 'WebVRPolyfill' in window ? (window.WebVRPolyfill && window.WebVRPolyfill.version || '<unknown>') : 'null');
    ga('send', 'event', 'libs.webvrplus', 'WEBVRPLUS' in window ? (WEBVRPLUS.version || '<unknown>') : 'null');

    var getDeviceNames = function (devices) {
      var names = (devices || []).map(function (device) {
        return device ? (device.displayName || device.deviceName || '<unknown>') : '<unknown>';
      });
      return JSON.stringify(names);
    };

    var getPresentationStates = function (devices) {
      var states = (devices || []).map(function (device) {
        return device.isPresenting;
      });
      return JSON.stringify(states);
    };

    var fsElement;
    var fsEvent;

    if (document.body.requestFullscreen) {
      fsElement = 'fullscreenElement';
      fsEvent = 'fullscreenchange';
    } else if (document.body.mozRequestFullScreen) {
      fsElement = 'mozFullScreenElement';
      fsEvent = 'mozfullscreenchange';
    } else if (document.body.webkitRequestFullscreen) {
      fsElement = 'webkitFullscreenElement';
      fsEvent = 'webkitfullscreenchange';
    } else if (document.body.msRequestFullscreen) {
      fsElement = 'msFullscreenElement';
      fsEvent = 'MSFullscreenChange';
    }

    document.addEventListener(fsEvent, function () {
      var isFs = document[fsElement] instanceof HTMLElement;
      ga('send', 'event', 'modechange.fullscreen', isFs);
      if (navigator.getVRDevices) {
        // NOTE: With the old API, we unfortunately cannot discern between
        // entering/exiting fullscreen or VR mode - that is, whether
        // `requestFullscreen({vrDisplay: display})` or
        // `requestFullscreen(canvas)` was called.
        var devices = [{isPresenting: isFs}];
        ga('send', 'event', 'modechange.vr', getPresentationStates(devices));
      }
    });

    if (navigator.getVRDisplays) {
      navigator.getVRDisplays().then(function (devices) {
        ga('send', 'event', 'pageload.getVRDisplays', getDeviceNames(devices));
        window.addEventListener('vrdisplaypresentchange', function () {
          ga('send', 'event', 'modechange.vr', getPresentationStates(devices));
        });
      });
    } else if (navigator.getVRDevices) {
      navigator.getVRDevices().then(function (devices) {
        ga('send', 'event', 'pageload.getVRDevices', getDeviceNames(devices));
      });
    }

    html.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a') || e.target;
      if (!a) { return; }
      ga('send', 'event', 'click', a.textContent || a.href);
    });
  }

  initGoogleAnalytics('UA-24056643-4', {alwaysSendReferrer: true});
  initGoogleAnalyticsEvents();
})();
