export function disable_arrows(
  slides: any,
  index: number,
  prev: any,
  next: any,
  $class: any
) {
  switch (index) {
    case 0:
      $(prev).addClass($class)
      $(next).removeClass($class)
      break
    case slides:
      $(prev).removeClass($class)
      $(next).addClass($class)
      break
    default:
      $(prev).removeClass($class)
      $(next).removeClass($class)
      break
  }
}

export function remove_arrows(splide: any) {
  if (splide._o.perPage === splide.Components.Elements.slides.length) {
    splide.Components.Arrows.arrows.prev.classList.add('hide')
    splide.Components.Arrows.arrows.next.classList.add('hide')
  }
}
