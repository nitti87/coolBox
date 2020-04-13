window.Box = class {

  constructor( onEl, setting = {} ) {
    this.onElement = onEl
    this.which_index = 0
    this.settings = {
      top: setting.top || '50%', left: setting.left || '50%',
      height: setting.height || '50px', 
      width: setting.width || '180px',
      if_electron: navigator.userAgent.indexOf("Electron") >= 0 ? setting.electron || false : false,
      fadeInTime: typeof setting.fade === 'object' ? setting.fade.fadeInTime || false : false,
      waitForFadeOut: typeof setting.fade === 'object' && setting.fade.fadeInTime ? setting.fade.waitForFadeOut || 3000 : undefined,
      fadeOutTime: typeof setting.fade === 'object' && setting.fade.fadeInTime ? setting.fade.fadeOutTime || setting.fade.fadeInTime : undefined,
      show: setting.fade ? false : setting.show || true,
      hideAfter: setting.fade ? false : setting.hideAfter || 3000,
      autocloser: typeof setting.autocloser === 'boolean' ? setting.autocloser : true,
      x_button: setting.x_button || false
    };
  }

  type( as_what, styleAs = {} ) {
    const styling = {
      actLikePopup: styleAs.actLikePopup || false,
      container_bgColor: styleAs.container_bgColor || 'rgba(255, 255, 255, .6)',
      dialog_bgColor: typeof styleAs.dialog !== 'object' ? styleAs.dialog_bgColor || '#ffffff' : styleAs.dialog.backgroundColor || '#ffffff',
      dialog_boxShadow: typeof styleAs.dialog !== 'object' ? styleAs.dialog_boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)' : styleAs.dialog.boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)',
      startFrom: styleAs.startFrom || 'bottom left'
    }
    this.as_what = as_what

    const [containers, main] = [document.createElement('div'), document.createElement('div')]
    containers.setAttribute('data-popup-holder', 'container') 
    containers.style.backgroundColor = styling.container_bgColor

    const styleMain = as_what !== 'dialog' ? 
    (styling.actLikePopup ? `top: ${this.settings.top}; left: ${this.settings.left}; transform: translate(-${this.settings.top}, -${this.settings.left}` : '') : 
    `background-color: ${styling.dialog_bgColor}; box-shadow: ${styling.dialog_boxShadow}`

    main.style.cssText = `height: ${this.settings.height}; width: ${this.settings.width}; ${styleMain}`
    main.setAttribute('data-popup-holder', as_what !== 'dialog' ? 'main' : 'dialogMain')
    main.innerHTML = `<div data-popup-holder="titlebar"> <div data-popup-holder="title"></div> <div data-popup-holder="icon"></div> </div>`

    if (!styling.actLikePopup && as_what !== 'dialog') {
      main.classList.add(`popup_${as_what}`)
      main.setAttribute('data-index', document.querySelectorAll("[data-popup-holder='main']").length)
      main.setAttribute('data-location', styling.startFrom)
      this.which_index = document.querySelectorAll("[data-popup-holder='main']").length

      const [winHeight, prev_el_height] = [ window.innerHeight, document.querySelector(`[data-index='${this.which_index - 1}']`) ]
      const new_position = (prev_el_height === null ? 0 : prev_el_height.clientHeight + 15)

      switch (styling.startFrom) {
        case 'bottom left':
          main.style.cssText += `top: ${winHeight - parseInt(this.settings.height) - 25 - (document.querySelectorAll("[data-location='bottom left'").length * new_position)}px; left: 30px`
          break;
        case 'bottom right':
          main.style.cssText += `top: ${winHeight - parseInt(this.settings.height) - 25 - (document.querySelectorAll("[data-location='bottom right'").length * new_position)}px; right: 30px`
          break;
        case 'top left':
          main.style.cssText += `top: ${40 + (document.querySelectorAll("[data-location='top left'").length * new_position)}px; left: 30px`
          break;
        case 'top right':
          main.style.cssText += `top: ${40 + (document.querySelectorAll("[data-location='top left'").length * new_position)}px; right: 30px`
          break;
      }
    }

    !styling.actLikePopup && as_what !== 'dialog' ? document.querySelector(this.onElement).appendChild(main) : (containers.appendChild(main), document.querySelector(this.onElement).appendChild(containers))

    // Set the 'z-index' to a value that's greater than itself
    if (this.settings.if_electron) {
      const which_el = styling.actLikePopup ? "[data-popup-holder='container']" : "[data-popup-holder='main']";
      const this_zIndex = window.document.defaultView.getComputedStyle(document.querySelector(which_el))
        .getPropertyValue('z-index');
      document.querySelectorAll(this.settings.if_electron).forEach((el) => { el.style.zIndex = (this_zIndex + 1) })
    }

    this.settings.autocloser ? (this.settings.fadeInTime ? this.fade() : this.show(false, true)) : this.show(false, false)

    return this
  }

  text(txt) {
    const [title, titleText_fontSize, x_button,  inside_txt, inside_txt_fontSize, inside_txt_paddingLeft, main, insideTxt_div] = [
      typeof txt === 'object' ? (typeof txt.title === 'object' ? txt.title.text : txt.titleText) || '' : '',
      typeof txt === 'object' && typeof txt.title === 'object' ? txt.title.fontSize || '12px' : '12px', 
      this.settings.x_button,
      typeof txt === 'object' ? (typeof txt.inside === 'object' ? txt.inside.text : txt.inside_text) || '' : txt,
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.fontSize || '14px' : '14px', 
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.paddingLeft || '10px' : '10px',
      this.as_what !== 'dialog' ? document.querySelector(`[data-index='${this.which_index}']`) : document.querySelector(`[data-popup-holder='dialogMain']`),
      document.createElement('div')
    ]

    const [title_div, x_button_div] = [main.children[0].firstElementChild, document.createElement('div')]

    x_button_div.innerHTML = '&#10005;'
    x_button_div.classList.add('x_button')
    x_button_div.addEventListener('click', () => { this.settings.autocloser ? (this.settings.fadeInTime ? this.fade(true) : this.show(true, true)) : this.show(true, false) })
    
    insideTxt_div.setAttribute('data-popup-holder', 'insideTxt')
    insideTxt_div.innerHTML = inside_txt
    main.appendChild(insideTxt_div)

    title ? (title_div.innerText = title, title_div.classList.add('styleTitle'), title_div.parentElement.classList.add('styleTitleHead')) : null
    title_div.style.fontSize = titleText_fontSize
    const title_height = title ? `padding-top: ${parseInt(window.document.defaultView.getComputedStyle(title_div).getPropertyValue('padding')) / 2}px` : ''

    x_button ? (title ? title_div.appendChild(x_button_div) : insideTxt_div.appendChild(x_button_div)) : null

    insideTxt_div.style.cssText = `padding-left: ${inside_txt_paddingLeft}; ${title_height}; font-size: ${inside_txt_fontSize};`

    return this
  }

  show(closeBox = false, time = true) { 
    const showThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']")]

    showThese.forEach((el) => {
      !closeBox ? (el.style.display = 'block', ( time ? setTimeout(() => { this.show(true) }, this.settings.hideAfter) : this.show(true, false) )) : el.remove()
    })
  }

  fade(closeBox = false) {
    const fadeThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']")]

    fadeThese.forEach((el) => {
      el.style.opacity = !closeBox ? 0 : 1;
      el.style.display = 'block'

      let timer = setInterval(() => {
        el.style.opacity < 0 || el.style.opacity > 1 && !closeBox ? (clearInterval(timer), (!closeBox ? setTimeout(() => { this.fade(true) }, this.settings.waitForFadeOut) : el.remove())) : timer;

        !closeBox ? el.style.opacity -= -(50 / this.settings.fadeInTime) : el.style.opacity -= (50 / this.settings.fadeOutTime)
      }, 50);
    })
  }
