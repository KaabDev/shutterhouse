// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.swap-slider-wrapper').forEach(wrapper => {
//     const track = wrapper.querySelector('.swap-slider-track');
//     if (!track) return;

//     const isInfinite = wrapper.getAttribute('data-infinite') === 'true';
//     const hasProgress = wrapper.hasAttribute('data-progress');

//     let cardsPerSlide = 1;
//     let currentIndex = 0;
//     let isTransitioning = false;
//     let originalItems = [];
//     let isDragging = false;
//     let hasMoved = false;

//     const updateProgressAttr = () => {
//       if (!hasProgress) return;

//       const total = originalItems.length;
//       const maxSlide = total - cardsPerSlide + 1;

//       let logicalIndex = isInfinite
//         ? (currentIndex - cardsPerSlide + total) % total
//         : Math.max(0, Math.min(currentIndex, total - cardsPerSlide));

//       // ✅ Convert zero-based to 1-based
//       const progressValue = Math.min(maxSlide, logicalIndex + 1);

//       wrapper.setAttribute('data-progress', progressValue);
//     };

//     const getCardsPerSlide = () => {
//       const firstCard = track.querySelector(':scope > *:not(.clone)');
//       if (!firstCard) return 1;

//       const style = window.getComputedStyle(firstCard);
//       const cardWidth = firstCard.offsetWidth +
//         parseFloat(style.marginLeft) +
//         parseFloat(style.marginRight);

//       return Math.floor(wrapper.offsetWidth / cardWidth) || 1;
//     };

//     const getCardWidth = () => {
//       const firstCard = track.querySelector(':scope > *:not(.clone)');
//       return firstCard ? firstCard.offsetWidth : 0;
//     };

//     const updateTransform = (withTransition = true) => {
//       const cardWidth = getCardWidth();
//       const translateX = -(cardWidth * currentIndex);
//       track.style.transition = withTransition ? 'transform 0.3s ease' : 'none';
//       track.style.transform = `translateX(${translateX}px)`;
//     };

//     const cloneBufferItems = () => {
//       Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
//       originalItems = Array.from(track.children).filter(child => !child.classList.contains('clone'));

//       const prependClones = originalItems.slice(-cardsPerSlide).map(el => {
//         const clone = el.cloneNode(true);
//         clone.classList.add('clone');
//         return clone;
//       });

//       const appendClones = originalItems.slice(0, cardsPerSlide).map(el => {
//         const clone = el.cloneNode(true);
//         clone.classList.add('clone');
//         return clone;
//       });

//       prependClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
//       appendClones.forEach(clone => track.appendChild(clone));
//     };

//     const moveTo = (direction) => {
//       if (isTransitioning) return;

//       const total = originalItems.length;
//       const maxIndex = total - cardsPerSlide;

//       if (!isInfinite) {
//         const next = currentIndex + direction;
//         if (next < 0 || next > maxIndex) {
//           updateTransform(true);
//           return;
//         }
//         currentIndex = next;
//         updateTransform(true);
//         updateProgressAttr();
//         return;
//       }

//       isTransitioning = true;
//       currentIndex += direction;
//       updateTransform(true);

//       setTimeout(() => {
//         if (currentIndex >= total + cardsPerSlide) {
//           currentIndex = cardsPerSlide;
//           updateTransform(false);
//         } else if (currentIndex < cardsPerSlide) {
//           currentIndex = total + cardsPerSlide - 1;
//           updateTransform(false);
//         }
//         isTransitioning = false;
//         updateProgressAttr();
//       }, 310);
//     };

//     // Drag logic
//     let startX = 0, currentX = 0;

//     const getX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

//     const startDrag = e => {
//       isDragging = true;
//       hasMoved = false;
//       startX = getX(e);
//       currentX = startX;
//       track.style.transition = 'none';
//     };

//     const onDrag = e => {
//       if (!isDragging) return;
//       currentX = getX(e);
//       const delta = currentX - startX;
//       if (Math.abs(delta) > 5) hasMoved = true;

//       const shift = -currentIndex * getCardWidth() + delta;
//       track.style.transform = `translateX(${shift}px)`;
//     };

//     const endDrag = () => {
//       if (!isDragging) return;
//       isDragging = false;

//       const delta = currentX - startX;
//       const threshold = getCardWidth() * 0.1;

//       if (hasMoved) {
//         if (delta < -threshold) {
//           moveTo(1);
//         } else if (delta > threshold) {
//           moveTo(-1);
//         } else {
//           updateTransform(true);
//           updateProgressAttr();
//         }
//       } else {
//         updateTransform(true);
//         updateProgressAttr();
//       }
//     };

//     // Prevent accidental navigation when dragging
//     track.querySelectorAll('a').forEach(link => {
//       link.addEventListener('click', e => {
//         if (hasMoved) {
//           e.preventDefault(); // Stop navigation if slider was moved
//         }
//       });
//     });

//     ['mousedown', 'touchstart'].forEach(evt =>
//       track.addEventListener(evt, startDrag, { passive: true })
//     );
//     ['mousemove', 'touchmove'].forEach(evt =>
//       track.addEventListener(evt, onDrag, { passive: false })
//     );
//     ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt =>
//       track.addEventListener(evt, endDrag)
//     );

//     const setup = (preserveLeftVisible = false) => {
//       let visibleCardIndex = currentIndex;

//       cardsPerSlide = getCardsPerSlide();

//       if (isInfinite) {
//         cloneBufferItems();
//       } else {
//         Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
//         originalItems = Array.from(track.children);
//       }

//       const total = originalItems.length;
//       const maxIndex = total - cardsPerSlide;

//       // ✅ Update only if data-total-slides already exists
//       if (wrapper.hasAttribute('data-total-slides')) {
//         wrapper.setAttribute('data-total-slides', maxIndex + 1);
//       }

//       if (preserveLeftVisible) {
//         const trackRect = track.getBoundingClientRect();
//         const children = Array.from(track.children).filter(c => !c.classList.contains('clone'));
//         const firstVisible = children.findIndex(card => {
//           const cardRect = card.getBoundingClientRect();
//           return cardRect.left >= trackRect.left - 1;
//         });

//         if (firstVisible !== -1) {
//           visibleCardIndex = isInfinite
//             ? firstVisible + cardsPerSlide
//             : Math.min(firstVisible, maxIndex);
//         }
//       }

//       currentIndex = preserveLeftVisible
//         ? visibleCardIndex
//         : (isInfinite ? cardsPerSlide : 0);

//       updateTransform(false);
//       updateProgressAttr();
//     };


//     let resizeTimer;
//     window.addEventListener('resize', () => {
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(() => setup(true), 100);
//     });

//     setup();
//   });
// });


// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.swap-slider-wrapper').forEach(wrapper => {
//     const track = wrapper.querySelector('.swap-slider-track');
//     if (!track) return;

//     const isInfinite = wrapper.getAttribute('data-infinite') === 'true';
//     const hasProgress = wrapper.hasAttribute('data-progress');

//     let cardsPerSlide = 1;
//     let currentIndex = 0;
//     let isTransitioning = false;
//     let originalItems = [];
//     let isDragging = false;
//     let hasMoved = false;

//     // autoplay config
//     const autoplayDelay = 4000; // ms
//     let autoplayTimer;

//     const updateProgressAttr = () => {
//       if (!hasProgress) return;

//       const total = originalItems.length;
//       const maxSlide = total - cardsPerSlide + 1;

//       let logicalIndex = isInfinite
//         ? (currentIndex - cardsPerSlide + total) % total
//         : Math.max(0, Math.min(currentIndex, total - cardsPerSlide));

//       const progressValue = Math.min(maxSlide, logicalIndex + 1);
//       wrapper.setAttribute('data-progress', progressValue);
//     };

//     const getCardsPerSlide = () => {
//       const firstCard = track.querySelector(':scope > *:not(.clone)');
//       if (!firstCard) return 1;
//       const style = window.getComputedStyle(firstCard);
//       const cardWidth = firstCard.offsetWidth +
//         parseFloat(style.marginLeft) +
//         parseFloat(style.marginRight);
//       return Math.floor(wrapper.offsetWidth / cardWidth) || 1;
//     };

//     const getCardWidth = () => {
//       const firstCard = track.querySelector(':scope > *:not(.clone)');
//       return firstCard ? firstCard.offsetWidth : 0;
//     };

//     const updateTransform = (withTransition = true) => {
//       const cardWidth = getCardWidth();
//       const translateX = -(cardWidth * currentIndex);
//       track.style.transition = withTransition ? 'transform 0.6s ease' : 'none';
//       track.style.transform = `translateX(${translateX}px)`;
//     };

//     const cloneBufferItems = () => {
//       Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
//       originalItems = Array.from(track.children).filter(child => !child.classList.contains('clone'));

//       const prependClones = originalItems.slice(-cardsPerSlide).map(el => {
//         const clone = el.cloneNode(true);
//         clone.classList.add('clone');
//         return clone;
//       });

//       const appendClones = originalItems.slice(0, cardsPerSlide).map(el => {
//         const clone = el.cloneNode(true);
//         clone.classList.add('clone');
//         return clone;
//       });

//       prependClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
//       appendClones.forEach(clone => track.appendChild(clone));
//     };

//     const moveTo = (direction) => {
//       if (isTransitioning) return;
//       stopAutoplay();

//       const total = originalItems.length;
//       const maxIndex = total - cardsPerSlide;

//       if (!isInfinite) {
//         const next = currentIndex + direction;
//         if (next < 0 || next > maxIndex) {
//           updateTransform(true);
//           return;
//         }
//         currentIndex = next;
//         updateTransform(true);
//         updateProgressAttr();
//         startAutoplay();
//         return;
//       }

//       isTransitioning = true;
//       currentIndex += direction;
//       updateTransform(true);

//       setTimeout(() => {
//         if (currentIndex >= total + cardsPerSlide) {
//           currentIndex = cardsPerSlide;
//           updateTransform(false);
//         } else if (currentIndex < cardsPerSlide) {
//           currentIndex = total + cardsPerSlide - 1;
//           updateTransform(false);
//         }
//         isTransitioning = false;
//         updateProgressAttr();
//         startAutoplay();
//       }, 310);
//     };

//     // Drag logic
//     let startX = 0, currentX = 0;
//     const getX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

//     const startDrag = e => {
//       isDragging = true;
//       hasMoved = false;
//       startX = getX(e);
//       currentX = startX;
//       track.style.transition = 'none';
//       stopAutoplay();
//     };

//     const onDrag = e => {
//       if (!isDragging) return;
//       currentX = getX(e);
//       const delta = currentX - startX;
//       if (Math.abs(delta) > 5) hasMoved = true;
//       const shift = -currentIndex * getCardWidth() + delta;
//       track.style.transform = `translateX(${shift}px)`;
//     };

//     const endDrag = () => {
//       if (!isDragging) return;
//       isDragging = false;
//       const delta = currentX - startX;
//       const threshold = getCardWidth() * 0.1;

//       if (hasMoved) {
//         if (delta < -threshold) {
//           moveTo(1);
//         } else if (delta > threshold) {
//           moveTo(-1);
//         } else {
//           updateTransform(true);
//           updateProgressAttr();
//           startAutoplay();
//         }
//       } else {
//         updateTransform(true);
//         updateProgressAttr();
//         startAutoplay();
//       }
//     };

//     // Prevent accidental navigation when dragging
//     track.querySelectorAll('a').forEach(link => {
//       link.addEventListener('click', e => {
//         if (hasMoved) e.preventDefault();
//       });
//     });

//     ['mousedown', 'touchstart'].forEach(evt =>
//       track.addEventListener(evt, startDrag, { passive: true })
//     );
//     ['mousemove', 'touchmove'].forEach(evt =>
//       track.addEventListener(evt, onDrag, { passive: false })
//     );
//     ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt =>
//       track.addEventListener(evt, endDrag)
//     );

//     // Buttons navigation
//     const prevBtn = wrapper.closest('section').querySelector('.prev-btn');
//     const nextBtn = wrapper.closest('section').querySelector('.next-btn');
//     if (prevBtn) prevBtn.addEventListener('click', () => moveTo(-1));
//     if (nextBtn) nextBtn.addEventListener('click', () => moveTo(1));

//     // Autoplay
//     const startAutoplay = () => {
//       stopAutoplay();
//       autoplayTimer = setInterval(() => moveTo(1), autoplayDelay);
//     };
//     const stopAutoplay = () => clearInterval(autoplayTimer);

//     const setup = (preserveLeftVisible = false) => {
//       let visibleCardIndex = currentIndex;
//       cardsPerSlide = getCardsPerSlide();

//       if (isInfinite) {
//         cloneBufferItems();
//       } else {
//         Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
//         originalItems = Array.from(track.children);
//       }

//       const total = originalItems.length;
//       const maxIndex = total - cardsPerSlide;

//       if (wrapper.hasAttribute('data-total-slides')) {
//         wrapper.setAttribute('data-total-slides', maxIndex + 1);
//       }

//       if (preserveLeftVisible) {
//         const trackRect = track.getBoundingClientRect();
//         const children = Array.from(track.children).filter(c => !c.classList.contains('clone'));
//         const firstVisible = children.findIndex(card => {
//           const cardRect = card.getBoundingClientRect();
//           return cardRect.left >= trackRect.left - 1;
//         });

//         if (firstVisible !== -1) {
//           visibleCardIndex = isInfinite
//             ? firstVisible + cardsPerSlide
//             : Math.min(firstVisible, maxIndex);
//         }
//       }

//       currentIndex = preserveLeftVisible
//         ? visibleCardIndex
//         : (isInfinite ? cardsPerSlide : 0);

//       updateTransform(false);
//       updateProgressAttr();
//     };

//     let resizeTimer;
//     window.addEventListener('resize', () => {
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(() => setup(true), 100);
//     });

//     setup();
//     startAutoplay();
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.swap-slider-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.swap-slider-track');
    if (!track) return;

    const isInfinite = wrapper.getAttribute('data-infinite') === 'true';
    const hasProgress = wrapper.hasAttribute('data-progress');

    let cardsPerSlide = 1;
    let currentIndex = 0;
    let isTransitioning = false;
    let originalItems = [];
    let isDragging = false;
    let hasMoved = false;

    // autoplay config
    const autoplayDelay = 4000; // ms
    let autoplayTimer;

    const updateProgressAttr = () => {
      if (!hasProgress) return;

      const total = originalItems.length;
      const maxSlide = total - cardsPerSlide + 1;

      let logicalIndex = isInfinite
        ? (currentIndex - cardsPerSlide + total) % total
        : Math.max(0, Math.min(currentIndex, total - cardsPerSlide));

      const progressValue = Math.min(maxSlide, logicalIndex + 1);
      wrapper.setAttribute('data-progress', progressValue);
    };

    const getCardsPerSlide = () => {
      const firstCard = track.querySelector(':scope > *:not(.clone)');
      if (!firstCard) return 1;
      const style = window.getComputedStyle(firstCard);
      const cardWidth = firstCard.offsetWidth +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight);
      return Math.floor(wrapper.offsetWidth / cardWidth) || 1;
    };

    const getCardWidth = () => {
      const firstCard = track.querySelector(':scope > *:not(.clone)');
      return firstCard ? firstCard.offsetWidth : 0;
    };

    const updateTransform = (withTransition = true) => {
      const cardWidth = getCardWidth();
      const translateX = -(cardWidth * currentIndex);
      track.style.transition = withTransition ? 'transform 0.6s ease' : 'none';
      track.style.transform = `translateX(${translateX}px)`;
    };

    const cloneBufferItems = () => {
      Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
      originalItems = Array.from(track.children).filter(child => !child.classList.contains('clone'));

      const prependClones = originalItems.slice(-cardsPerSlide).map(el => {
        const clone = el.cloneNode(true);
        clone.classList.add('clone');
        return clone;
      });

      const appendClones = originalItems.slice(0, cardsPerSlide).map(el => {
        const clone = el.cloneNode(true);
        clone.classList.add('clone');
        return clone;
      });

      prependClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
      appendClones.forEach(clone => track.appendChild(clone));
    };

    const moveTo = (direction) => {
      if (isTransitioning) return;
      stopAutoplay();

      const total = originalItems.length;
      const maxIndex = total - cardsPerSlide;

      if (!isInfinite) {
        const next = currentIndex + direction;
        if (next < 0 || next > maxIndex) {
          updateTransform(true);
          return;
        }
        currentIndex = next;
        updateTransform(true);
        updateProgressAttr();
        startAutoplay();
        return;
      }

      isTransitioning = true;
      currentIndex += direction;
      updateTransform(true);

      setTimeout(() => {
        if (currentIndex >= total + cardsPerSlide) {
          currentIndex = cardsPerSlide;
          updateTransform(false);
        } else if (currentIndex < cardsPerSlide) {
          currentIndex = total + cardsPerSlide - 1;
          updateTransform(false);
        }
        isTransitioning = false;
        updateProgressAttr();
        startAutoplay();
      }, 310);
    };

    // Drag logic
    let startX = 0, currentX = 0;
    const getX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const startDrag = e => {
      isDragging = true;
      hasMoved = false;
      startX = getX(e);
      currentX = startX;
      track.style.transition = 'none';
      stopAutoplay();
    };

    const onDrag = e => {
      if (!isDragging) return;
      currentX = getX(e);
      const delta = currentX - startX;
      if (Math.abs(delta) > 5) hasMoved = true;
      const shift = -currentIndex * getCardWidth() + delta;
      track.style.transform = `translateX(${shift}px)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      const delta = currentX - startX;
      const threshold = getCardWidth() * 0.1;

      if (hasMoved) {
        if (delta < -threshold) {
          moveTo(1);
        } else if (delta > threshold) {
          moveTo(-1);
        } else {
          updateTransform(true);
          updateProgressAttr();
          startAutoplay();
        }
      } else {
        updateTransform(true);
        updateProgressAttr();
        startAutoplay();
      }
    };

    // Prevent accidental navigation when dragging
    track.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => {
        if (hasMoved) e.preventDefault();
      });
    });

    ['mousedown', 'touchstart'].forEach(evt =>
      track.addEventListener(evt, startDrag, { passive: true })
    );
    ['mousemove', 'touchmove'].forEach(evt =>
      track.addEventListener(evt, onDrag, { passive: false })
    );
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt =>
      track.addEventListener(evt, endDrag)
    );

    // Buttons navigation
    const prevBtn = wrapper.closest('section').querySelector('.prev-btn');
    const nextBtn = wrapper.closest('section').querySelector('.next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => moveTo(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveTo(1));

    // Autoplay
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(() => moveTo(1), autoplayDelay);
    };
    const stopAutoplay = () => clearInterval(autoplayTimer);

    // Pause autoplay on hover over track
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    const setup = (preserveLeftVisible = false) => {
      let visibleCardIndex = currentIndex;
      cardsPerSlide = getCardsPerSlide();

      if (isInfinite) {
        cloneBufferItems();
      } else {
        Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
        originalItems = Array.from(track.children);
      }

      const total = originalItems.length;
      const maxIndex = total - cardsPerSlide;

      if (wrapper.hasAttribute('data-total-slides')) {
        wrapper.setAttribute('data-total-slides', maxIndex + 1);
      }

      if (preserveLeftVisible) {
        const trackRect = track.getBoundingClientRect();
        const children = Array.from(track.children).filter(c => !c.classList.contains('clone'));
        const firstVisible = children.findIndex(card => {
          const cardRect = card.getBoundingClientRect();
          return cardRect.left >= trackRect.left - 1;
        });

        if (firstVisible !== -1) {
          visibleCardIndex = isInfinite
            ? firstVisible + cardsPerSlide
            : Math.min(firstVisible, maxIndex);
        }
      }

      currentIndex = preserveLeftVisible
        ? visibleCardIndex
        : (isInfinite ? cardsPerSlide : 0);

      updateTransform(false);
      updateProgressAttr();
    };

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => setup(true), 100);
    });

    setup();
    startAutoplay();
  });
});
