// helper functions to avoid jitter when
// "edit" components replace "public" components
export function disableScroll() {
  // Get the current page scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  // if any scroll is attempted, set this to the previous value
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop)
  }

  document.body.classList.add('no-sroll')
}

export function enableScroll() {
  window.onscroll = function () {}
}
