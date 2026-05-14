
const isMobile = window.innerWidth < 1024

let swiper = null
let swiper2 = null 
let swiper3 = null  

  swiper = new Swiper('.product-grid-swiper', {
    slidesPerView: 1,
    spaceBetween: 14,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
      }, 
      1536: {
        slidesPerView: 5.5,
        initialSlide: 2,
      }
    },
  })

if (isMobile) {


    swiper3 = new Swiper('.product-grid-swiper-3', {
    slidesPerView: 1.5,
    slidesPerGroup: 1,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination2',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.5,
        centeredSlides: false,
      }
    },
  })

    swiper2 = new Swiper('.product-grid-swiper-2', {
    slidesPerView: 1.5,
    slidesPerGroup: 1,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination3',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.5,
        centeredSlides: false,
      }
    },
  })

}



    function playVideo(id) {
      document.getElementById(id).play();
    }
    function pauseVideo(id) {
      const v = document.getElementById(id);
      v.pause();
      v.currentTime = 0;
    }


const reveals = document.querySelectorAll('.reveal');
const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (isDesktop) {
        entry.target.classList.add('visible');
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

reveals.forEach(el => {
  const delay = isDesktop ? (el.dataset.delay ?? '0') : '0';
  el.style.setProperty('--delay', `${delay}ms`);
  observer.observe(el);
});



(function () {
  const containers = Array.from(document.querySelectorAll('#brands .scroll-container'));
  if (!containers.length) return;
  const pxPerSecond = 50;

  containers.forEach((container) => {
    const list = container.querySelector('.carousel-primary');
    if (!list) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'marquee-wrapper';
    wrapper.style.width = 'max-content';
    list.parentNode.replaceChild(wrapper, list);
    wrapper.appendChild(list);
    const clone = list.cloneNode(true);
    wrapper.appendChild(clone);
    wrapper.classList.add('marquee');

    function updateMarquee() {
      const listWidth = list.getBoundingClientRect().width || 100;
      const duration = Math.max(8, listWidth / pxPerSecond);
      wrapper.style.setProperty('--marquee-duration', duration + 's');
    }

    updateMarquee();
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMarquee, 150);
    });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function handleReduceMotion() {
      if (mq.matches) {
        wrapper.classList.remove('marquee');
      } else {
        wrapper.classList.add('marquee');
        updateMarquee();
      }
    }
    if (mq.addEventListener) mq.addEventListener('change', handleReduceMotion);
    else mq.addListener(handleReduceMotion);
    handleReduceMotion();
  });
})();


const desktopPanelWrap = document.getElementById('desktop-panel')
let activeCard = null

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {

  const plus = card.querySelector('.card-plus');
    if (plus) {
      plus.classList.remove('spinning');
      void plus.offsetWidth; // reflow to restart animation
      plus.classList.add('spinning');
      plus.addEventListener('animationend', () => plus.classList.remove('spinning'), { once: true });
    }


    const targetId = card.dataset.target

    if (activeCard === card) { closePanel(); return; }

    if (activeCard) {
      activeCard.classList.remove('active')
      document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'))
    }

    card.classList.add('active')
    activeCard = card

    const panel = document.getElementById(targetId)
    panel.classList.remove('hidden', 'panel-animate')
    void panel.offsetWidth
    panel.classList.add('panel-animate')

    desktopPanelWrap.classList.remove('opacity-0', 'pointer-events-none')
    desktopPanelWrap.classList.add('opacity-100')
  })
})

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); closePanel(); })
})

function closePanel() {
  if (activeCard) activeCard.classList.remove('active')
  activeCard = null
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'))
  desktopPanelWrap.classList.add('opacity-0', 'pointer-events-none')
  desktopPanelWrap.classList.remove('opacity-100')
}

function toggleItems() {
  if (window.innerWidth >= 768) return;

  const extras = document.querySelectorAll('.extra');
  const isHidden = extras[0].classList.contains('hidden');

  extras.forEach(el => el.classList.toggle('hidden', !isHidden));

  document.getElementById('btnLabel').textContent = isHidden ? 'ΛΙΓΟΤΕΡΕΣ ΚΑΤΗΓΟΡΙΕΣ' : 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΚΑΤΗΓΟΡΙΕΣ';
  document.getElementById('chevron').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    document.querySelectorAll('.extra').forEach(el => el.classList.remove('hidden'));
  }
});


const FLOAT_DURATION = 6; // seconds — change this

const tileEmojis = [
  ['1f60b', '1f603'],  
  ['1f60b', '1f60d'],   
  ['1f60d', '1f603'],   
  ['1f60b', '1f60d'],   
  ['1f60d', '1f603'],   
  ['1f60b', '1f603'],   
  ['1f60b', '1f603'],  
  ['1f60b', '1f60d'],   
  ['1f60d', '1f603'],   
  ['1f60b', '1f603'],   
  ['1f60b', '1f60d'],   
  ['1f60d', '1f603'] 
  // tile 12 Toys
];

document.querySelectorAll('.group-category').forEach((tile, i) => {
  const emojis = tileEmojis[i] ?? ['1f603', '1f60d'];
  let interval = null;

  tile.addEventListener('mouseenter', () => {
    spawnEmoji(tile, emojis);
    interval = setInterval(() => spawnEmoji(tile, emojis), 1800);
  });

  tile.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = null;
  });
});

function spawnEmoji(tile, emojis) {
  const rect = tile.getBoundingClientRect();
  const codepoint = emojis[Math.floor(Math.random() * emojis.length)];

  const el = document.createElement('img');
  el.className = 'emoji-float';
  el.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.gif`;
  el.style.setProperty('--float-duration', `${FLOAT_DURATION}s`);
  el.style.width = '2rem';
  el.style.height = '2rem';

  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + rect.height * 0.3;

  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;

  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}