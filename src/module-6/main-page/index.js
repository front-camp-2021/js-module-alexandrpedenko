import Card from "../../module-2/card/index.js";
import CardsList from "../../module-3/cards-list-v1/index.js";
import Pagination from "../../module-5/pagination/index.js";
import SideBar from "../../module-4/side-bar/index.js";
import Search from "../search/index.js";
import { request } from "./request/index.js";
import { prepareFilters } from "./prepare-filters/index.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 10;
  totalPages = 100;
  filters = new URLSearchParams();

  constructor() {
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);
    this.onInitialize();
  }

  onInitialize() {
    this.render();
    this.getSubElements();
    this.initializeComponents();
    this.renderComponents();
    this.initializeRequestedData();
    this.initializeEvents();
  }

  /**
   * Template Rendering
   */
  get template() {
    return `
    <div class="wrapper">
      <header class="header">
        <div class="header__logo">
          <img src="./images/logo.svg" class="header__logo-img" alt="Store Logo"></img>
          <div class="header__logo-text">Online Store</div>
        </div>
      </header>

      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a href="/" class="breadcrumbs__home"></a>
        </li>
        <li class="breadcrumbs__item">
          <a href="/eCommerce" class="breadcrumbs__link">eCommerce</a>
        </li>
        <li class="breadcrumbs__item">
          <span class="breadcrumbs__current">Electronics</span>
        </li>
      </ul>

      <div class="category">
        <div class="category__row">
          <aside class="category__sidebar" data-element="sidebar">
            <!-- SideBar -->
          </aside>
          <main class="category__main">
            <div class="search">
              <div class="search__results">
                <span class="search__results-text">7,618 results found</span>
                <button class="button button_icon button_primary  favorites">
                  <img src="./images/icons/heart-white.svg" alt="Add favorites">
                </button>
              </div>
              <div data-element="search">
              </div>
              <!-- Search -->
            </div>
            <div data-element="cardslist">
            <!-- Products -->
            </div>
          </main>
        </div>
      </div>
      <div data-element="pagination">
      <!-- pagination -->
      </div>
    </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
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

  initializeComponents() {
    const search = new Search();
    const cardslist = new CardsList({ data: [], Component: Card });
    const sidebar = new SideBar();
    const pagination = new Pagination();

    this.components = {
      search,
      cardslist,
      sidebar,
      pagination,
    };
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      if (element) {
        root.append(element);
      }
    });
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
    this.filters = new URLSearchParams();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }

  /**
   *  Data Loading
   */
  async initializeRequestedData() {
    try {
      const productsData = await this.productsRequest();
      const brandsData = await this.filtersRequest("brands");
      const categoriesData = await this.filtersRequest("categories");

      const categoriesFilter = prepareFilters(categoriesData, "category");
      const brandsFilter = prepareFilters(brandsData, "brand");

      this.components.sidebar.update(categoriesFilter, brandsFilter);
      this.components.cardslist.update(productsData);
    } catch (error) {
      console.error(`An error occurred while initialize loaded data: ${error}`);
    }
  }

  async productsRequest() {
    try {
      const url = new URL("products", BACKEND_URL);
      url.search = this.filters;

      const response = await fetch(url);
      const totalPages = parseInt(response.headers.get("X-Total-Count"), 10);

      if (totalPages !== this.totalPages) {
        this.totalPages = totalPages;
      }

      this.components.pagination.update({
        totalPages: Math.ceil(totalPages / this.pageLimit),
        currentPage: parseInt(this.filters.get("_page")),
      });

      return await response.json();
    } catch (error) {
      console.error(`An error occurred while request products data: ${error}`);
    }
  }

  async filtersRequest(query = "") {
    try {
      const url = new URL(query, BACKEND_URL);
      const [data, error] = await request(url);

      if (error) {
        throw new Error(error);
      }

      return data;
    } catch (error) {
      console.error(`An error occurred while loading filters data: ${error}`);
    }
  }

  /**
   *  Events Initialize & Handling
   */
  initializeEvents() {
    this.components.sidebar.element.addEventListener(
      "add-filter",
      async (event) => {
        const [filterKey, filterProperty] = event.detail.split("=");
        this.filters.set("_page", "1");

        this.filters.append(filterKey, filterProperty);
        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener(
      "remove-filter",
      (event) => {
        const [filterKey, filterProperty] = event.detail.split("=");
        const filters = this.filters
          .getAll(filterKey)
          .filter((item) => item !== filterProperty);

        if (filters.length > 0) {
          this.filters.set(filterKey, filters);
        } else {
          this.filters.delete(filterKey);
        }

        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener("clear-filters", () => {
      this.resetFilters();
      this.components.search.clear();

      this.updateProductsList();
    });

    this.components.pagination.element.addEventListener(
      "page-changed",
      (event) => {
        this.filters.set("_page", event.detail);

        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener(
      "range-selected",
      (event) => {
        this.filters.set("_page", "1");
        const { filterName, value } = event.detail;
        const gte = `${filterName}_gte`;
        const lte = `${filterName}_lte`;

        this.filters.set(gte, value.from);
        this.filters.set(lte, value.to);

        this.updateProductsList();
      }
    );

    this.components.search.element.addEventListener(
      "search-filter",
      async (event) => {
        this.filters.set("_page", "1");
        this.filters.set("q", event.detail);

        this.updateProductsList();
      }
    );
  }

  async updateProductsList() {
    const products = await this.productsRequest();
    this.components.cardslist.update(products);
  }

  resetFilters() {
    this.filters = new URLSearchParams();
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);
  }
}
