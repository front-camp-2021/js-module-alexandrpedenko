import Card from "../../module-2/card/index.js";

export default class CardsList {
  element;

  constructor(data = [], Card) {
    this.data = data;
    this.card = Card;

    this.render();
  }

  render() {
    const listWrapper = document.createElement("div");
    listWrapper.classList.add("product-list");

    this.element = listWrapper;
    this.buildCardsLits(this.element, this.data);
  }

  buildCardsLits(wrapper, cardsData) {
    if (cardsData.length < 1) return;

    Array.from(cardsData).forEach((item) => {
      let { element } = new Card(item);

      if (element) {
        wrapper.append(element);
      }
    });
  }

  update(updateData) {
    if (!this.element) return;
    this.element.innerHTML = "";
    this.data = updateData;

    this.buildCardsLits(this.element, this.data);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
