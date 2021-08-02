// ==UserScript==
// @name         KaKAO Tag Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script hiding images based on tags loaded asynchronously
// @author       decay42
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @match        https://www.kakao-karten.de/*
// @include      https://www.kakao-karten.de/*
// @icon         https://www.kakao-karten.de/mobile.png
// @grant        none
// ==/UserScript==
/*global waitForKeyElements */

// ADD BANNED TAGS HERE
const bannedTags = ['sta', 'aquarell', '...'];

(function () {
  'use strict';
  waitForKeyElements('#canvas', kakaoFunction);

  function kakaoFunction() {
    const karten = document.querySelectorAll('div.gallery a');
    karten.forEach(karte => {
      const image = karte.parentElement.querySelector('img');
      fetch(karte.href).then(res => res.text()).then(text => {
        const el = document.createElement('html');
        el.innerHTML = text;
        const tags = Array.from(el.querySelectorAll("div.tag a").values()).map(t => t.innerText);
        if (bannedTags.some(bannedTag => tags.includes(bannedTag))) {
          image.style.visibility = 'hidden';
          image.style.height = '0';
          karte.insertAdjacentHTML('afterbegin', '<div style="line-height: 1rem;">Hidden because of banned tag</div>');
        }
      });
    })
  }
})();