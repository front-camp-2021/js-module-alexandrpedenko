import FiltersList from "../filters-list/index.js";

export default class SideBar {
  element;
  sidebarItems = {};

  constructor(categoriesFilter = [], brandFilter = []) {
    this.categoriesFilter = categoriesFilter;
    this.brandFilter = brandFilter;

    this.createSidebarItems();
    this.render();
    this.insertSidebarItems();
    this.addEventListeners();
  }

  createSidebarItems() {
    const categoryFilterItem = new FiltersList({
      title: "Category",
      list: this.categoriesFilter,
    });

    const brandFilterItem = new FiltersList({
      title: "Brand",
      list: this.brandFilter,
    });

    this.sidebarItems = {
      brandFilterItem,
      categoryFilterItem,
    };
  }

  insertSidebarItems() {
    const sidebarItemsWrapper = this.element.querySelector(".filter__body");

    Object.keys(this.sidebarItems).forEach((item) => {
      const { element } = this.sidebarItems[item];

      if (element) {
        sidebarItemsWrapper.append(element);
      }
    });
  }

  update(categoriesFilter = [], brandFilter = []) {
    this.sidebarItems.brandFilterItem.update(brandFilter);
    this.sidebarItems.categoryFilterItem.update(categoriesFilter);
  }

  get sidebarTemplate() {
    return `
      <div class="filter">
        <div class="filter__header">
          <h3 class="filter__header-title">Filters</h3>
          <button class="button button_white button_icon">
            <img src="./images/icons/chevrons-right.svg" alt="Toggle Filter">
          </button>
        </div>
        <div class="filter__body">

        </div>
        <button id="clearFilters" class="button button_primary  filter__clearButton">Clear all filters</button>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.sidebarTemplate;

    this.element = wrapper.firstElementChild;
  }

  addEventListeners() {
    const clearFilters = this.element.querySelector("#clearFilters");

    const customDispatch = (event) => {
      this.element.dispatchEvent(
        new CustomEvent("filter-selected", {
          bubbles: true,
          detail: event.detail,
        })
      );
    };

    clearFilters.addEventListener("pointerdown", () => {
      for (const item of Object.values(this.sidebarItems)) {
        item.reset();
      }

      this.element.dispatchEvent(
        new CustomEvent("clear-filters", {
          bubbles: true,
        })
      );
    });

    this.element.addEventListener("add-filter", customDispatch);
    this.element.addEventListener("remove-filter", customDispatch);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.sidebarItems = {};
  }
}
