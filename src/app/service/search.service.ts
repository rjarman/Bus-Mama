import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  getFilteredResult() {
    const searchbar = document.querySelector('ion-searchbar');
    const items = Array.from(document.querySelector('ion-list').children);
    searchbar.addEventListener('ionInput', handleInput);
    function handleInput(event) {
      const query = event.target.value.toLowerCase();
      requestAnimationFrame(() => {
        items.forEach((item) => {
          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
          // @ts-ignore
          item.style.display = shouldShow ? 'block' : 'none';
        });
      });
    }
  }
}
