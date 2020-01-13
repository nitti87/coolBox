window.Box = class {

  constructor( onEl, setting = {} ) {
    this.onElement = onEl
    this.which_index = 0
    this.settings = {
      top: setting.top || '50%', left: setting.left || '50%',
      height: setting.height || '50px', width: setting.width || '180px',
      if_electron: navigator.userAgent.indexOf("Electron") >= 0 ? setting.electron || false : false,
      fadeInTime: typeof setting.fade === 'object' ? setting.fade.fadeInTime || false : false,
      waitForFadeOut: typeof setting.fade === 'object' && setting.fade.fadeInTime ? setting.fade.waitForFadeOut || 3000 : undefined, 
      fadeOutTime: typeof setting.fade === 'object' && setting.fade.fadeInTime ? setting.fade.fadeOutTime || setting.fade.fadeInTime : undefined, 
      show: setting.fade ? false : setting.show || true,
      hideAfter: setting.fade ? false : setting.hideAfter || 3000
    };
  }

  type( as_what, styleAs = {} ) {
    const styling = {
      actLikePopup: styleAs.actLikePopup || false,
      moveFrom: styleAs.moveFrom || 'bottom left'
    }

    const [container, main] = [document.createElement('div'), document.createElement('div')]
    container.setAttribute('data-popup-holder', 'container'); main.setAttribute('data-popup-holder', 'main')

    if (as_what !== 'dialog') {      
      main.innerHTML = `<div data-popup-holder="titlebar"> <div data-popup-holder="title"></div> <div data-popup-holder="icon"></div> </div>`

      main.classList.add(`popup_${as_what}`)
      main.style.cssText = `height: ${this.settings.height}; width: ${this.settings.width}; ${styling.actLikePopup ? `top: ${this.settings.top}; left: ${this.settings.left};
      transform: translate(-${this.settings.top}, -${this.settings.left}` : ``})`
      
      main.setAttribute('data-index', document.querySelectorAll("[data-popup-holder='main']").length)
      main.setAttribute('data-location', styling.moveFrom)
      this.which_index = document.querySelectorAll("[data-popup-holder='main']").length

      if (!styling.actLikePopup) {
        const [winHeight, prev_el_height] = [
          window.innerHeight,
          document.querySelector(`[data-index='${this.which_index - 1}']`)          
        ]

        const new_position = (prev_el_height === null ? 0 : prev_el_height.clientHeight + 15)

        switch (styling.moveFrom) {
          case 'bottom left':
            main.style.cssText += `top: ${winHeight - 100 - (document.querySelectorAll("[data-location='bottom left'").length * new_position)}px; left: 30px`
            break;
          case 'bottom right':
            main.style.cssText += `top: ${winHeight - 100 - (document.querySelectorAll("[data-location='bottom right'").length * new_position)}px; right: 30px`
            break;
          case 'top left':
            main.style.cssText += `top: ${40 + (document.querySelectorAll("[data-location='top left'").length * new_position)}px; left: 30px`
            break;
          case 'top right':
            main.style.cssText += `top: ${40 + (document.querySelectorAll("[data-location='top left'").length * new_position)}px; right: 30px`
            break;
        }
      }

    } else { }

    !styling.actLikePopup ? document.querySelector(this.onElement).appendChild(main) : (container.appendChild(main), document.querySelector(this.onElement).appendChild(container))
    
    // Set the 'z-index' to a value that's greater than itself
    if (this.settings.if_electron) {
      const which_el = styling.actLikePopup ? "[data-popup-holder='container']" : "[data-popup-holder='main']";
      const this_zIndex = window.document.defaultView.getComputedStyle(document.querySelector(which_el))
        .getPropertyValue('z-index');
      document.querySelectorAll(this.settings.if_electron).forEach((el) => { el.style.zIndex = (this_zIndex + 1) })
    }

    this.settings.fadeInTime ? this.fade() : this.show()

    return this
  }

  text(txt) {
    const [title, inside_txt, inside_txt_paddingLeft, main, insideTxt_div] = [
      typeof txt === 'object' ? txt.titleText || '' : '',
      typeof txt === 'object' ? txt.insideText || '' : txt,
      typeof txt === 'object' ? txt.inside_txt_paddingLeft || '10px' : '10px',
      document.querySelector(`[data-index='${this.which_index}']`),
      document.createElement('div')
    ]
    
    const title_div = main.children[0].firstElementChild
    title ? (title_div.innerText = title, title_div.classList.add('styleTitle'), title_div.parentElement.classList.add('styleTitleHead')) : null

    insideTxt_div.setAttribute('data-popup-holder', 'insideTxt')
    insideTxt_div.innerHTML = inside_txt
    main.appendChild(insideTxt_div)
    
    const title_height = title ? `padding-top: ${window.document.defaultView.getComputedStyle(title_div).getPropertyValue('padding')}` : ''

    main.children[1].style.cssText = `height: ${this.settings.height}; padding-left: ${inside_txt_paddingLeft}; ${title_height}`

    return this
  }

  show(isTrue = false) {
    const showThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.which_index}']`)]
    
    showThese.forEach((el) => {
      !isTrue ? (el.style.display = 'block', setTimeout(() => { this.show(true) }, this.settings.hideAfter)) : el.style.display = 'none'
    })
  }

  fade(isTrue = false) {
    const fadeThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.which_index}']`)]

    fadeThese.forEach((el) => {
      el.style.opacity = !isTrue ? 0 : 1;
      el.style.display = 'block'
      
      let timer = setInterval(() => {
        el.style.opacity < 0 || el.style.opacity > 1 && !isTrue ? (clearInterval(timer), (!isTrue ? setTimeout(() => { this.fade(true) }, this.settings.waitForFadeOut) : el.remove())) : timer;

        !isTrue ? el.style.opacity -= -(50 / this.settings.fadeInTime) : el.style.opacity -= (50 / this.settings.fadeOutTime)
      }, 50);
      
    })
  }
} 
