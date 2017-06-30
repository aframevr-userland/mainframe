/* global Swiper */
(function () {
  window.addEventListener('load', function () {
    var supports = {
      touch: 'ontouchstart' in window
    };

    document.documentElement.setAttribute('data-supports-touch', supports.touch);

    var store = {};
    try {
      store.works = JSON.parse(localStorage.works);
    } catch (err) {
    }

    var xhr = new XMLHttpRequest();

    xhr.open('get', 'https://index-api.aframe.io/api/works', true);

    xhr.addEventListener('error', function (err) {
      try {
        localStorage.works = JSON.stringify([]);
      } catch (err) {
      }
      throw err;
    });

    xhr.addEventListener('load', function () {
      var items = null;
      try {
        items = JSON.parse(xhr.responseText);
      } catch (err) {
      }

      store.works = items || [];

      var swiperWrapper = document.querySelector('#swiper-wrapper');

      store.works.push({
        name: 'A Saturday Night',
        short_name: 'A-Saturday-Night',
        icons: [
          {
            type: 'image/jpg',
            src: 'https://webvr.rocks/a_saturday_night/poster.jpg'
          }
        ],
        description: 'Record and share your dance moves'
      });

      store.works.forEach(function (manifest) {
        var shortNameLower = (manifest.short_name || '').toLowerCase();

        if (shortNameLower === 'a-painter') {
          manifest.processed_best_icon = {
            src: 'https://dl.airtable.com/RPPe979wRAil2X0OfUND_full_apainter.png',
            type: 'image/png'
          };
        }

        if (!manifest.processed_best_icon) {
          manifest.processed_best_icon = manifest.icons[0];
        }

        if (!manifest.processed_best_icon) {
          return;
        }

        var swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';
        swiperSlide.setAttribute('data-short-name', manifest.short_name);

        var swiperSlideInner = document.createElement('div');
        swiperSlide.className = 'swiper-slide-inner';

        var name = document.createElement('h3');
        name.textContent = manifest.name || manifest.short_name || '';
        swiperSlideInner.appendChild(name);

        var image = document.createElement('div');
        image.className = 'scene-img';

        image.style.cssText = 'background-image: url(' + manifest.processed_best_icon.src + ')';

        swiperSlideInner.appendChild(image);
        swiperSlide.appendChild(swiperSlideInner);
        swiperWrapper.appendChild(swiperSlide);
      });

      if (supports.touch) {
        var swiper = new Swiper('#swiper-container', {
          pagination: '#swiper-pagination',
          paginationClickable: true,
          direction: 'vertical',
          slidesPerView: 1,
          centeredSlides: true,
          spaceBetween: 30,
          keyboardControl: true
        });
      }

      try {
        localStorage.works = xhr.responseText;
      } catch (err) {
      }
    });

    xhr.send();
  });
})();
