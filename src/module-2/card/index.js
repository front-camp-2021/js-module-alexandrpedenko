export default class Card {
  element;

  constructor({
    id = "",
    images = [],
    title = "",
    rating = 0,
    price = 0,
    category = "",
    brand = "",
  } = {}) {
    this.id = id;
    this.images = images;
    this.title = title;
    this.rating = rating;
    this.price = price;
    this.category = category;
    this.brand = brand;

    this.render();
  }

  render() {
    const cardWrapper = document.createElement("div");
    cardWrapper.setAttribute("data-element", "body");
    cardWrapper.classList.add("product-wrapper");
    cardWrapper.innerHTML = this.buildCard();

    this.element = cardWrapper;
  }

  buildCard() {
    return `
      <div class="product">
        <div class="product__image-wrapper">
          <img class="product__image"
            src="${this.images[0]}"
            alt="${this.title}"
          />
        </div>
        <div class="product__rating-price">
          <div class="product__rating">
            <span class="product__rating-text">${this.rating}</span>
          </div>
          <span class="product__price">${this.price}₴</span>
        </div>
        <div class="product__info">
          <h3 class="product__name">${this.title}r</h3>
          <span class="product__description">
          ${this.category} | ${this.brand}
          </span>
        </div>
        <div class="product__buttons">
          <button class="product__button button button_secondary button_medium">
            <span class="product__wishlist">Wishlist</span>
          </button>
          <button class="product__button button button_primary button_medium">
            <span class="product__addToCart">Add to cart</span>
          </button>
        </div>
      </div>
    `;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
