import view from '../view.js';

export default class {
  constructor(id, title, content) {
    this.$element = document.createElement('li');
    this.state = {
      id,
      title,
      content,
    };

    this.$element.classList.add('card');
    this.$element.setAttribute('data-id', id);
    this.render();
    /* attach event listener */
    this.initEvents();
  }

  initEvents() {
    const $deleteBtn = this.$element.querySelector('.card-header-delete');

    $deleteBtn.addEventListener('click', this.deleteCard.bind(this));
    $deleteBtn.addEventListener('mouseover', this.turnOnDanger.bind(this));
    $deleteBtn.addEventListener('mouseout', this.turnOffDanger.bind(this));
    this.$element.addEventListener('dblclick', this.updateCard.bind(this));
    this.$element.addEventListener('mousedown', this.dragStart.bind(this));
  }

  deleteCard() {
    view.removeElement(this.$element);
  }

  updateCard() {
    view.updateCard(this.$element, this.getTitle(), this.getContent());
  }

  turnOnDanger() {
    const $card = this.$element;
    view.turnOnCardDanger($card);
  }

  turnOffDanger() {
    const $card = this.$element;
    view.turnOffCardDanger($card);
  }

  setCardInitialPosition() {
    const rect = this.$element.getBoundingClientRect();
    this.$element.style.top = `${rect.top}px`;
    this.$element.style.left = `${rect.left}px`;
  }

  replaceCardWithSkeleton() {
    const $skeleton = this.$element.cloneNode(true);
    $skeleton.classList.add('skeleton');
    this.$element.parentNode.insertBefore($skeleton, this.$element);
  }

  dragStart(event) {
    if (event.target.closest('.card-header-delete')) return;

    this.setCardInitialPosition();
    this.replaceCardWithSkeleton();
    this.$element.classList.add('moving');

    const dragStartPosition = { x: event.clientX, y: event.clientY };
    const dragEvent = (event) => {
      this.drag(event, dragStartPosition);
    };
    window.addEventListener('mousemove', dragEvent);
    window.onmouseup = (event) => {
      this.dragEnd(event);
      window.removeEventListener('mousemove', dragEvent);
      window.onmouseup = null;
    };
  }

  drag(event, dragStartPosition) {
    const xDiff = event.clientX - dragStartPosition.x;
    const yDiff = event.clientY - dragStartPosition.y;
    this.$element.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
  }

  dragEnd() {
    this.$element.removeAttribute('style');
    document.querySelector('.skeleton').remove();
    this.$element.classList.remove('moving');
  }

  getTitle() {
    return this.state.title;
  }

  getContent() {
    return this.state.content;
  }

  getElement() {
    return this.$element;
  }

  render() {
    this.$element.innerHTML = `
        <article>
            <header class="card-header">
                <h3 class="card-header-title">${this.state.title}</h3>
                <button class="card-header-delete">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z" fill="black"/>
                    </svg>
                </button>
            </header>
            <p class="card-content">
                ${this.state.content}
            </p>
            <footer class="card-author">author by web</footer>
        </article>
    `;
  }
}
