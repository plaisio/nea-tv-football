
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
