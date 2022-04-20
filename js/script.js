import slides from "./data.json" assert { type: "json" };
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
    this.imgRef = this.parent.querySelector(".slider-img");
    this.rightButton = this.parent.querySelector(".move.right");
    this.leftButton = this.parent.querySelector(".move.left");
    this.dotsList = this.parent.querySelector(".dots-list");
    this.indexRef = this.parent.querySelector(".index");
    this.totalRef = this.parent.querySelector(".total");
    this.array = array;
    this.length = this.array.length;
    this.loop = loop;
    this.navs = navs;
    this.pags = pags;
    this.auto = auto;
    this._indexSlider = 0;
  }

  get indexSlider() {
    return this._indexSlider;
  }
  set indexSlider(newIndex) {
    this._indexSlider = newIndex;

    this.slidesApply();
    this.activeClassChange();
    this.doIndicator();
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

    this.indexSlider = 0;
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
    const { text, img } = this.array[this.indexSlider];

    this.imgRef.src = img;
    this.imgRef.alt = text;
  }

  changeImg = (event) => {
    if (event.target.classList.contains("right")) {
      if (this.loop) {
        if (this.indexSlider < this.length - 1) {
          this.indexSlider += 1;
        } else {
          this.indexSlider = 0;
        }
      } else {
        if (this.indexSlider < this.length - 1) {
          this.indexSlider += 1;
        }
      }
    } else {
      if (this.loop) {
        if (this.indexSlider > 0) {
          this.indexSlider -= 1;
        } else {
          this.indexSlider = this.length - 1;
        }
      } else {
        if (this.indexSlider > 0) {
          this.indexSlider -= 1;
        } else {
          this.indexSlider = 0;
        }
      }
    }
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
    this.indexSlider = Number(event.target.dataset.index);
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
