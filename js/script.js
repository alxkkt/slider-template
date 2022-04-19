import { slides } from "./data.js";
// Функционал:
// кнопки далее и назад
// подпись текста к каждому слайду
// вывод номера и максимального количества(1 / 3, 2 / 3, /3/3)
// пагинация(при клике - переключается на нужный слайд)
// Дополнительные параметры:
// loop - возможность листать слайдер по кругу(например когда на 3 слайде нажимаем далее - переходим на 1).
// true или false navs - Вывод стрелочек или их отключение.
// true или false pags - вывод пагинации или отключение.
// true или false auto - слайдер сам переключается, если delay не указан, раз в 5 сек.
// А stopMouseHover - если навести мышкой на слайд, он не переключается, как только мышку убрали, снова пошло.Работает только когда auto равен true.
// true или false delay - время в секундах на показ слайда, если auto true

class Slider {
  constructor(
    array = [],
    selector,
    { loop = false, navs = false, pags = false, auto = false, delay = 5 }
  ) {
    this.parent = document.querySelector(selector);
    this.rightButton = this.parent.querySelector(".move.right");
    this.leftButton = this.parent.querySelector(".move.left");
    this.dotsList = this.parent.querySelector(".dots-list");
    this.indexRef = this.parent.querySelector(".index");
    this.totalRef = this.parent.querySelector(".total");
    this.array = array;
    this.loop = loop;
    this.navs = navs;
    this.pags = pags;
    this.auto = auto;
    this.indexSlider = 0;
  }
  init() {
    if (this.navs) {
      this.makeNavsArrow();
      this.onClick();
    }
    if (this.pags) {
      this.pagsMarkupCreate();
      this.makePags();
      this.onClickPagsNav();
    }

    this.slidesApply();
    this.doIndicator();
  }
  makeNavsArrow() {
    this.parent
      .querySelector(".button-list")
      .classList.remove("visually-hidden");
  }
  makePags() {
    this.dotsList.classList.remove("visually-hidden");
  }

  doIndicator() {
    this.indexRef.textContent = this.indexSlider + 1;
    if (!this.totalRef.textContent) {
      this.totalRef.textContent = this.array.length;
    }
  }

  slidesApply() {
    const img = this.parent.querySelector(".slider-img");
    img.setAttribute("src", this.array[this.indexSlider].img);
    img.setAttribute("alt", this.array[this.indexSlider].text);
  }

  changeImg = (event) => {
    if (event.target.classList.contains("right")) {
      if (this.loop) {
        if (this.indexSlider < this.array.length - 1) {
          this.indexSlider += 1;
        } else {
          this.indexSlider = 0;
        }
      } else {
        if (this.indexSlider < this.array.length - 1) {
          this.indexSlider += 1;
        }
      }
    } else {
      if (this.loop) {
        if (this.indexSlider > 0) {
          this.indexSlider -= 1;
        } else {
          this.indexSlider = this.array.length - 1;
        }
      } else {
        if (this.indexSlider > 0) {
          this.indexSlider -= 1;
        } else {
          this.indexSlider = 0;
        }
      }
    }
    this.slidesApply();
    this.activeClassChange();
    this.doIndicator();
  };
  onClick() {
    this.rightButton.addEventListener("click", this.changeImg);
    this.leftButton.addEventListener("click", this.changeImg);
  }
  pagsMarkupCreate() {
    const liMarkup = this.array
      .map(
        (element, index) => `
          <li class="dots ${
            index === 0 ? "active" : ""
          }" data-index="${index}"></li>
        `
      )
      .join("");
    this.dotsList.insertAdjacentHTML("beforeend", liMarkup);
  }
  onClickPagsNav() {
    this.dotsList.addEventListener("click", this.onClickChangeImg);
  }
  onClickChangeImg = (event) => {
    if (!event.target.classList.contains("dots")) return;
    // console.log(event.target.dataset.index);
    this.indexSlider = Number(event.target.dataset.index);
    this.slidesApply();
    this.activeClassChange();
    this.doIndicator();
  };

  activeClassChange() {
    const dots = this.dotsList.children;

    [...dots].forEach((element) => {
      element.classList.remove("active");
    });
    dots[this.indexSlider].classList.add("active");
  }
}
const slider = new Slider(
  slides, // слайды
  ".slider", // id для вставки в html
  {
    loop: true,
    navs: true,
    pags: true,
    auto: true,
    delay: 3,
  }
);

slider.init();
