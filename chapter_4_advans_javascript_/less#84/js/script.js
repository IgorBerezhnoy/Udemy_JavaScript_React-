window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabheader__item');
  const tabsContent = document.querySelectorAll('.tabcontent');

  const tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(el => {
      el.style.display = 'none';
    });
    tabs.forEach(el => {
      el.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');

  }

  hideTabContent();
  showTabContent();
  tabsParent.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((el, i) => {
        if (el === target) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
////////////////////////////////////////////////////////
  const deadLine = '2024-04-11';

  function getTimeRemaining(endTime) {
    const t = new Date(endTime) - new Date();
    let days = 0, hours = 0, minutes = 0, seconds = 0;
    if (t > 0) {
      days = Math.floor(t / (1000 * 60 * 60 * 24));
      hours = Math.floor((t / (1000 * 60 * 60) % 24));
      minutes = Math.floor((t / (1000 / 60) % 60));
      seconds = Math.floor((t / (1000) % 60));
    }
    return {total: t, days, hours, minutes, seconds};
  }

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector), days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'), minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'), timeInterval = setInterval(() => {
        updateClock();
      }, 1000);
    updateClock();


    function updateClock() {
      const getZero = (num) => {
        return num >= 10 ? num : '0' + num;
      };
      const t = getTimeRemaining(endTime);
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadLine);
  //////////////////////////////////////////////////

  const modalTrigger = document.querySelectorAll('.data-modal');
  const modal = document.querySelector('.modal');
  // const modalCloseBtn = document.querySelector('[data-close]');
  const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };
  const openModal = () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  };
  modal.classList.add('hide');
  modalTrigger.forEach(el => el.addEventListener('click', () => openModal()));
  // modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') === '') {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
  const modalTimerId = setTimeout(() => openModal(), 15000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  class MenuCard {
    constructor(title, text, price, srs, alt, parentSelector, ...classes) {
      this.title = title;
      this.descr = text;
      this.price = price;
      this.classes = classes || ['menu__item'];
      this.srs = srs;
      this.alt = alt;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');
      this.classes.forEach(el => element.classList.add(el));
      element.innerHTML = `
                    <img src=${this.srs} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                   <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                   </div>`;
      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status:${res.status}`);
    }
    return await res.json();
  };

  axios.get('http://localhost:3000/menu')
    .then(data => {
      data.data.forEach(({title, descr, price, img, altimg}) => {
        new MenuCard(title, descr, price, img, altimg, '.menu .container', 'menu__item')
          .render();
      });
    });


//84. Реализация скрипта отправки данных на сервер

  const forms = document.querySelectorAll('form');
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    return await res.json();
  };


  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        }).catch(() => {
        showThanksModal(message.failure);
      }).finally(() => {
        form.reset();
      });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.style.display = 'none';
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.style.display = 'block';

      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  // //92. Создаем слайдер на сайте, вариант 1
  // let slides = document.querySelectorAll('.offer__slide');
  // let current = document.querySelector('#current');
  // let total = document.querySelector('#total');
  // let sliderNext = document.querySelector('.offer__slider-next');
  // let sliderPrev = document.querySelector('.offer__slider-prev');
  // const startSlider = () => {
  //   total.textContent = slides.length.toString();
  //   current.textContent = '01';
  //   slides.forEach((el, i) => {
  //     if (i !== 0) el.style.display = 'none';
  //   });
  // };
  // startSlider();
  // const converterNum = (Num) => Num <= 9 ? '0' + Num : '' + Num;
  //
  // const setImg = (direction) => {
  //   let currentNum;
  //   if (direction === 'prev') {
  //     currentNum = (+current.textContent) !== 1 ? +current.textContent - 1 : slides.length.toString();
  //   } else if (direction === 'next') {
  //     currentNum = (+current.textContent) < +total.textContent ? +current.textContent + 1 : 1;
  //   }else {
  //     throw new Error('Error');
  //   }
  //   slides[+current.textContent - 1].style.display = 'none';
  //   slides[currentNum - 1].style.display = 'block';
  //   current.textContent = converterNum(currentNum);
  // };
  //
  //
  // sliderNext.addEventListener('click', () => {
  //   setImg('next');
  // });
  //
  // sliderPrev.addEventListener('click', () => {
  //   setImg('prev');
  // });

  // Slider

  const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    slider = document.querySelector('.offer__slider'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;


  let slideIndex = 1;
  let offset = 0;


  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length.toString();
    current.textContent = `0${slideIndex}`;
  }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrapper.style.overflow = 'hidden';
  slides.forEach(el => el.style.width = width);


  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
    dots = [];

  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `; // Если хотите - добавьте в стили, но иногда у нас нет доступа к стилям
  slider.append(indicators);
  const setDots = () => {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
  };
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
    if (i === 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }
  const setCurrentSlides = () => {
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  };
  next.addEventListener('click', () => {
    if (offset === +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    setCurrentSlides();
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
  });
  prev.addEventListener('click', () => {
    if (offset === 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;


    if (slideIndex === 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    setCurrentSlides();

    setDots();
  });

  dots.forEach(dot =>
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');
      slideIndex = slideTo;
      offset = +width.slice(0, width.length - 2) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;
      setCurrentSlides();

      setDots();
    }));

})
;