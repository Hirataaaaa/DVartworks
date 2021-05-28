const overlay = document.querySelector('.overlay')
const diamondList = document.querySelectorAll('.diamond')
Array.from(diamondList).forEach((el) => {
    el.addEventListener('click', function (e) {
        overlay.style.display = 'flex'
        const pos = Number(this.getAttribute('data-id'))
        initGallery(pos)
    })
})
overlay.addEventListener('click', function () {
    this.style.display = 'none'
    destroyGallery()
})

function destroyGallery() {
    const getItems = () => document.querySelectorAll('.slider__gallery__item');
    const items = getItems()
    const firstItem = items[0]
    const lastItem = items[items.length - 1]
    firstItem.remove()
    lastItem.remove()
}

function animate({timing, draw, duration}) {
    const start = performance.now()
    requestAnimationFrame(function animate(time) {
        let fraction = (time - start) / duration
        if (fraction > 1) fraction = 1
        const progress = timing(fraction)
        draw(progress)
        if (fraction < 1) {
            requestAnimationFrame(animate)
        }
    })
}

function initGallery(initPos = 1) {
    const controls = document.querySelectorAll('.slider__control')
    const getItems = () => document.querySelectorAll('.slider__gallery__item');
    const items = getItems()
    const firstItem = items[0]
    const lastItem = items[items.length - 1]
    const gallery = document.querySelector('.slider__gallery')
    const galleryWidth = gallery.getBoundingClientRect().width

    const newRightItem = firstItem.cloneNode(true)
    const newLeftNode = lastItem.cloneNode(true)

    gallery.append(newRightItem)
    gallery.prepend(newLeftNode)

    let pos = initPos;

    getItems()[0].style.marginLeft = `${-galleryWidth * pos}px`

    const move = (direction) => {
        const items = getItems()
        const duration = 400
        const timing = (timeFraction) => {
            return 1 - Math.sin(Math.acos(timeFraction));
        }

        const draw = (progress) => {
            const dir = (direction === 'left') ? 1 : -1
            if (progress > 0)
                items[0].style.marginLeft = `${-galleryWidth * pos + (progress * galleryWidth * dir)}px`
            if (progress === 1) {
                pos += -dir
                if (pos === 0) {
                    pos = items.length - 2
                    items[0].style.marginLeft = `${-galleryWidth * pos}px`
                }
                if (pos === items.length - 1) {
                    pos = 1
                    items[0].style.marginLeft = `${-galleryWidth * pos}px`
                }
            }
        }
        if (direction === 'left') {
            animate({timing, duration, draw})
        } else if (direction === 'right') {
            animate({timing, duration, draw})
        } else {
            console.error('No such direction!')
        }
    }

    Array.from(controls).forEach(el => {
        el.addEventListener('click', function (e) {
            e.stopPropagation()
            if (this.classList.contains('slider__control-left')) {
                move('left')
            } else if (this.classList.contains('slider__control-right')) {
                move('right')
            }
        })
    })
}
