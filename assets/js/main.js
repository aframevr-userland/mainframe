(function () {
  var scenesFormEl = document.querySelector('#scenes-form');

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
        console.log(sceneRadioEl.closest('li'), el.closest('li'));
        if (el === sceneRadioEl) {
          return;
        }
        el.removeAttribute('checked');
        el.blur();
      });
      if (sceneRadioEl) {
        sceneRadioEl.setAttribute('checked', '');
        sceneRadioEl.focus();
      }
    }
  }

  if (scenesFormEl) {
    window.addEventListener('mouseover', spatialNavUpdate);
    window.addEventListener('keydown', spatialNavUpdate);
    window.addEventListener('click', spatialNavUpdate);
  }

  // window.addEventListener('load', function () {
  //   var network = {
  //     cache: true,
  //     fetch: false
  //   };
  //   var supports = {
  //     touch: 'ontouchstart' in window
  //   };
  //
  //   document.documentElement.setAttribute('data-supports-touch', supports.touch);
  //
  //   var store = {
  //     scenes: []
  //   };
  //   if (network.cache) {
  //     try {
  //       store.scenes = JSON.parse(localStorage.scenes);
  //     } catch (err) {
  //     }
  //   }
  //
  //   var render = {};
  //   render.scenes = function (scenes) {
  //     var scenesEl = document.querySelector('#scenes');
  //
  //     store.scenes = scenes;
  //
  //     store.scenes.forEach(function (scene) {
  //       var name = scene.name || scene.short_name || '';
  //       var slug = (scene.slug || scene.short_name || '').toLowerCase();
  //
  //       var sceneEl = document.createElement('li');
  //       sceneEl.className = 'scene-inner';
  //       sceneEl.setAttribute('data-short-name', scene.short_name);
  //
  //       var nameEl = document.createElement('h3');
  //       nameEl.textContent = name;
  //       sceneEl.appendChild(nameEl);
  //
  //       var imageEl = document.createElement('div');
  //       imageEl.className = 'scene-img';
  //
  //       // image.style.cssText = 'background-image: url(' + manifest.processed_best_icon.src + ')';
  //       imageEl.style.cssText = 'background-image: url(' + scene.screenshots[0].src + ')';
  //
  //       sceneEl.appendChild(imageEl);
  //       scenesEl.appendChild(sceneEl);
  //     });
  //
  //     if (supports.touch) {
  //
  //     }
  //
  //     if (network.cache) {
  //       try {
  //         localStorage.scenes = JSON.stringify(store.scenes);
  //       } catch (err) {
  //       }
  //     }
  //   };
  //
  //   if (network.fetch) {
  //     var base = new Airtable({apiKey: 'keyMJq1gSRuwMTZ8r'}).base('app08C2f6KbFHvaAA');
  //
  //     console.log('fetching');
  //
  //     var newScenes = [];
  //
  //     base('webvr_scenes').select({
  //       maxRecords: 100,
  //       view: 'Scenes Feed',
  //     }).eachPage(function (records, fetchNextPage) {
  //       records.forEach(function (record) {
  //         // console.log('Retrieved record:', record.get('Name'));
  //         // console.log(record, JSON.stringify(record));
  //
  //         newScenes.push({
  //           name: record.get('Name'),
  //           short_name: record.get('Short Name') || record.get('Name'),
  //           start_url: record.get('URL'),
  //           tags: record.get('Tags'),
  //           description: record.get('Description'),
  //           // author: record.get('Author'),
  //           screenshots: record.get('Screenshots').map(function (screenshot) {
  //             return {
  //               src: screenshot.url,
  //               type: screenshot.type
  //             };
  //           }),
  //           webvr_supports: record.get('Supports')
  //         });
  //       });
  //
  //       fetchNextPage();
  //     }, function done (err) {
  //       if (err) {
  //         console.log('Error occurred:', err);
  //         return;
  //       }
  //
  //       render.scenes(newScenes);
  //     });
  //   } else {
  //     render.scenes(store.scenes);
  //   }
  // });
})();
