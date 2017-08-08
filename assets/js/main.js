(function () {
  var scenesFormEl = document.querySelector('#scenes-form');
  var filtersFormEl = document.querySelector('#filters-form');

  function spatialNavUpdate (evt) {
    var el = evt.target;
    var sceneEl = el && el.closest && el.closest('.scene');
    if (sceneEl) {
      var sceneLabelEl = el && el.closest && (el.closest('.scene-label') || el.querySelector('.scene-label'));
      var sceneRadioEl;
      if (sceneLabelEl) {
        sceneRadioEl = sceneLabelEl.querySelector('.scene-radio');
      }
      Array.prototype.forEach.call(scenesFormEl.querySelectorAll('.scene-label .scene-radio'), function (el) {
        if (el === sceneRadioEl) {
          return;
        }
        el.removeAttribute('checked');
        el.blur();
      });
      if (sceneRadioEl) {
        sceneRadioEl.setAttribute('checked', '');
        sceneRadioEl.focus();
        sceneEl.scrollIntoView();
      }
    }
  }

  function sceneChosen (evt) {
    if (evt.type === 'click' && !evt.altKey && !evt.shiftKey && !evt.ctrlKey) {
      evt.preventDefault();
    }
    var sceneEl = null;
    try {
      sceneEl = document.querySelector('input[name="scene"]:checked').closest('li[data-type="scene"]');
    } catch (err) {
      return false;
    }
    var startUrl = sceneEl.getAttribute('data-start_url');
    if (startUrl) {
      window.open(sceneEl.getAttribute('data-start_url'), '_blank');
      return true;
    }
    return false;
  }

  if (scenesFormEl) {
    // scenesFormEl.addEventListener('click', sceneChosen);
    // scenesFormEl.addEventListener('mouseover', spatialNavUpdate);
    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40) {
        spatialNavUpdate();
      }
    });
    // window.addEventListener('click', spatialNavUpdate);
    window.addEventListener('submit', sceneChosen);
  }

  window.addEventListener('load', function () {
    var supports = {
      touch: 'ontouchstart' in window,
      mobile: isMobile,
      tablet: isTablet(),
      webvr: !!navigator.getVRDisplays
    };
    supports.desktop = !supports.mobile && !supports.tablet;

    var displays = {
      available: [],
      connected: [],
      presenting: []
    };

    var headsets = {
      htc_vive: {
        name: 'HTC Vive',
        slug: 'htc_vive'
      },
      oculus_rift: {
        name: 'Oculus Rift',
        slug: 'oculus_rift'
      },
      google_daydream: {
        name: 'Google Daydream',
        slug: 'google_daydream'
      },
      samsung_gear_vr: {
        name: 'Samsung Gear VR',
        slug: 'samsung_gear_vr'
      },
      google_cardboard: {
        name: 'Google Cardboard',
        slug: 'google_cardboard'
      },
      osvr_hdk2: {
        name: 'OSVR HDK2',
        slug: 'osvr_hdk2'
      },
      none: {
        name: '(None)',
        slug: 'none'
      }
    };

    var filteredHeadsets = {};
    Object.keys(headsets).forEach(function (headsetKey) {
      filteredHeadsets[headsetKey] = '';
    });

    function getDisplaySlug (display) {
      var displayName = (display.displayName || display.name || '').toLowerCase();
      if (displayName.indexOf('oculus') > -1) {
        return headsets.oculus_rift.slug;
      } else if (displayName.indexOf('openvr') > -1 || displayName.indexOf('vive') > -1) {
        return headsets.htc_vive.slug;
      } else if (displayName.indexOf('gear') > -1) {
        return headsets.samsung_gear_vr.slug;
      } else if (displayName.indexOf('daydream') > -1) {
        return headsets.google_daydream.slug;
      } else if (displayName.indexOf('osvr') > -1) {
        return headsets.osvr_hdk2.slug;
      }
      return supports.webvrPositional ? headsets.google_cardboard.slug : headsets.none.slug;
    }

    /**
     * Check for positional tracking.
     */
    function hasPositionalTracking (isMobile) {
      var supportsPositional = isMobile;
      if (supportsPositional) {
        return true;
      }
      displays.connected.concat(displays.presenting).forEach(function (display) {
        if (display && display.capabilities && display.capabilities.hasPosition) {
          supportsPositional = true;
        }
      });
      if (supportsPositional) {
        return true;
      }
      if (!supports.desktop && ('ondevicemotion' in window)) {
        return true;
      }
    }

    /**
     * Detect tablet devices.
     * @param {String} `mockUserAgent` - Allow passing a mock user agent for testing.
     * @returns {Boolean} `true` if device is a tablet.
     */
    function isTablet (mockUserAgent) {
      var userAgent = mockUserAgent || window.navigator.userAgent;
      return /ipad|Nexus (7|9)|xoom|sch-i800|playbook|tablet|kindle/i.test(userAgent);
    }

    function isIOS () {
      return /iPad|iPhone|iPod/.test(window.navigator.platform);
    }

    function isSamsungGearVR () {
      return /Samsung\s*Browser.+Mobile\s*VR/i.test(window.navigator.userAgent);
    }

    /**
     * Checks if browser is mobile.
     * @returns {Boolean} `true` if mobile browser detected.
     */
    var isMobile = (function () {
      var _isMobile = false;
      (function (a) {
        // eslint-disable-next-line no-useless-escape
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
          _isMobile = true;
        }
        if (isIOS() || isTablet()) {
          _isMobile = true;
        }
      })(window.navigator.userAgent || window.navigator.vendor || window.opera);
      return function () {
        return _isMobile || isGearVR();
      };
    })();

    function addOrUpdateDisplay (display, displayGroupType) {
      var displaysList = displays[displayGroupType];
      if (!displaysList) {
        return;
      }
      var idx = displaysList.indexOf(display.displayId);
      if (idx > -1) {
        displaysList[idx] = display;
        headsets[getDisplaySlug(display)][displayGroupType] = true;
        return;
      }
      displaysList.push(display);
      headsets[getDisplaySlug(display)][displayGroupType] = true;
    }

    function removeDisplay (display, displayGroupType) {
      var displaysList = displays[displayGroupType];
      if (!displaysList) {
        return;
      }
      var idx = displaysList.indexOf(display.displayId);
      if (idx > -1) {
        displaysList.splice(idx, 1);
        headsets[getDisplaySlug(display)][displayGroupType] = true;
      }
    }

    if (supports.webvr) {
      navigator.getVRDisplays().then(function (displays) {
        displays.forEach(function (display) {
          if (display.isConnected) {
            addOrUpdateDisplay(display, 'available');
          } else {
            removeDisplay(display, 'available');
            addOrUpdateDisplay(display, 'connected');
          }
        });
        supports.webvrPositional = hasPositionalTracking(isMobile);
      });

      window.addEventListener('vrdisplayconnect', function (evt) {
        addOrUpdateDisplay(evt.display, 'available');
        addOrUpdateDisplay(evt.display, 'connected');
      });

      window.addEventListener('vrdisplaydisconnect', function (evt) {
        addOrUpdateDisplay(evt.display, 'available');
        addOrUpdateDisplay(evt.display, 'disconnected');
      });

      window.addEventListener('vrdisplaypresentchange', function (evt) {
        if (evt.isPresenting) {
          addOrUpdateDisplay(evt.display, 'presenting');
        } else {
          removeDisplay(evt.display, 'presenting');
        }
      });
    }

    document.documentElement.setAttribute('data-desktop', supports.desktop);
    document.documentElement.setAttribute('data-tablet', supports.tablet);
    document.documentElement.setAttribute('data-mobile', supports.mobile);
    document.documentElement.setAttribute('data-platform', supports.touch);
    document.documentElement.setAttribute('data-supports-touch', supports.touch);
    document.documentElement.setAttribute('data-supports-webvr-positional', supports.webvrPositional);
    document.documentElement.setAttribute('data-supports-webvr', supports.webvr);
    document.documentElement.setAttribute('data-supports-webvr-disconnected', supports.webvrPositional);

    var stylesEl = document.querySelector('style#css-dynamic-rules');
    if (!stylesEl) {
      return;
    }

    Array.prototype.forEach.call(scenesFormEl.querySelectorAll('[data-background-image-src]'), function (el) {
      var src = el.getAttribute('data-background-image-src');
      var srcHover = el.getAttribute('data-hover-background-image-src');
      stylesEl.textContent += '' +
        '[data-background-image-src="' + src + '"] {' +
        '  background-image: url(' + src + ');' +
        '}';
      if (srcHover) {
        stylesEl.textContent += '\n' +
        'input:checked ~ a:hover [data-hover-background-image-src], ' +
        'a:hover [data-hover-background-image-src] {' +
        '  background-image: url(' + srcHover + ');' +
        '}'
      }
    });

    if (filtersFormEl) {
      filtersFormEl.addEventListener('change', function (evt) {
        var checkboxEl = evt.target && evt.target.closest && evt.target.closest('input[name="platform"]');
        if (!checkboxEl) {
          return;
        }

        var headsetSlug = checkboxEl.value;
        var headsetSelected = checkboxEl.checked;

        filteredHeadsets[headsetSlug] = headsetSelected;

        document.documentElement.setAttribute('data-filtered', !!filtersFormEl.querySelector('input[name="platform"]:checked'));

        var labelEl = checkboxEl.closest('label');
        if (labelEl) {
          if (headsetSelected) {
            labelEl.classList.add('checked');
          } else {
            labelEl.classList.remove('checked');
          }
        }

        Object.keys(filteredHeadsets).forEach(function (headsetKey) {
          document.documentElement.setAttribute('data-filtered-' + headsetKey, filteredHeadsets[headsetKey]);
        });
      });
      filtersFormEl.addEventListener('submit', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        console.log('form submitted');
      });
    }
  });
})();
