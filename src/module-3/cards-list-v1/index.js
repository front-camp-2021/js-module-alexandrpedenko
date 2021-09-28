// import Card from "../../module-2/card/index.js";

export default class CardsList {
  element;

  constructor({ data = [], Component = {} }) {
    this.data = data;
    this.Component = Component;

    this.render();
  }

  render() {
    const listWrapper = document.createElement("div");
    listWrapper.classList.add("product-list");

    this.element = listWrapper;
    this.buildCardsList(this.element, this.data);
  }

  buildCardsList(wrapper, cardsData) {
    if (cardsData.length < 1) return;

    cardsData.forEach((item) => {
      let { element } = new this.Component(item);

      if (element) {
        wrapper.append(element);
      }
    });
  }

  update(updateData) {
    if (!this.element) return;
    this.element.innerHTML = "";
    this.data = updateData;

    this.buildCardsList(this.element, this.data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
