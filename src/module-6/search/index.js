import { debounce } from "../../module-1/debounce/index.js";

export default class Search {
  element;
  subElements = {};

  constructor() {
    this.onInitialize();
  }

  onInitialize() {
    this.render();
    this.getSubElements();
    this.initializeEvents();
  }

  get searchTemplate() {
    return `
      <form class="search__form" >
        <input type="text" name="search" placeholder="Search" class="search__form-input" data-element="search">
        <button class="search__form-button" data-element="submit">
          <img src="./images/icons/search.svg" alt="Search">
        </button>
      </form>
    `;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.searchTemplate;
    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    this.subElements = result;
  }

  initializeEvents() {
    this.subElements.search.addEventListener("input", this.keyUpHandler);
    this.element.addEventListener("submit", this.onClick);
  }

  dispatchEvent(searchQuery) {
    this.element.dispatchEvent(
      new CustomEvent("search-filter", {
        bubbles: true,
        detail: searchQuery,
      })
    );
  }

  keyUpHandler = debounce((event) => {
    const searchQuery = event.target.value.trim();

    this.dispatchEvent(searchQuery);
  }, 500);

  onClick = (event) => {
    event.preventDefault();
    const searchQuery = this.subElements.search.value.trim();

    this.dispatchEvent(searchQuery);
  };

  clear() {
    this.element.reset();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
