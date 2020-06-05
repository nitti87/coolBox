class Box {
  constructor( onEl, setting = {} ) {
    this.onElement = onEl
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
      main_bgColor: styleAs.main_bgColor ? `background-color: ${styleAs.main_bgColor};` : '',
      main_boxShadow: styleAs.main_boxShadow ? `box-shadow: ${styleAs.main_boxShadow};` : '',
      container_bgColor: styleAs.container_bgColor || 'rgba(255, 255, 255, .6)',
      dialog_bgColor: typeof styleAs.dialog !== 'object' ? styleAs.dialog_bgColor || '#ffffff' : styleAs.dialog.backgroundColor || '#ffffff',
      title_bgColor: styleAs.title_bgColor || '#0000000d',
      dialog_boxShadow: typeof styleAs.dialog !== 'object' ? styleAs.dialog_boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)' : styleAs.dialog.boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)',
      startFrom: styleAs.startFrom || 'bottom left',
      only_this: styleAs.only_this || false
    }

    this.transfer = {
      typeAs: as_what.toLowerCase(),
      not_only_this: (document.querySelectorAll("[data-onlythis='true']").length == 0 && !styling.only_this) || document.querySelectorAll(`[data-popup-holder='${!styling.actLikePopup && as_what.toLowerCase() !== 'dialog' ? 'main' : 'container'}']`).length == 0,
      which_index: 0
    }

    const [containers, main] = [document.createElement('div'), document.createElement('div')]
    containers.setAttribute('data-popup-holder', 'container') 
    containers.style.backgroundColor = styling.container_bgColor

    const styleMain = this.transfer.typeAs !== 'dialog' ? 
    (styling.actLikePopup ? `top: ${this.settings.top}; left: ${this.settings.left}; transform: translate(-${this.settings.top}, -${this.settings.left}` : '') : 
    `background-color: ${styling.dialog_bgColor}; box-shadow: ${styling.dialog_boxShadow}`

    main.style.cssText = `height: ${this.settings.height}; width: ${this.settings.width}; ${styleMain}; ${styling.main_boxShadow} ${styling.main_bgColor} `
    main.setAttribute('data-popup-holder', this.transfer.typeAs !== 'dialog' ? 'main' : 'dialogMain')
    main.innerHTML = `<div data-popup-holder="titlebar" style="background-color: ${styling.title_bgColor}"> <div data-popup-holder="title"></div> </div>`

    if (!styling.actLikePopup && this.transfer.typeAs !== 'dialog') { 
      const mainLength = document.querySelectorAll("[data-popup-holder='main']").length

      main.classList.add(`popup_${this.transfer.typeAs}`)
      main.setAttribute('data-index', mainLength)
      styling.only_this ? main.setAttribute('data-onlythis', true) : undefined
      main.setAttribute('data-location', styling.startFrom)
      this.transfer.which_index = this.transfer.not_only_this ? mainLength : mainLength - 1

      const [winHeight, prev_el] = [ 
        window.innerHeight, 
        document.querySelector(`[data-index='${this.transfer.which_index - 1}']`),
      ]
      const new_position = (prev_el === null ? 0 : prev_el.clientHeight + 15)

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

     if(this.transfer.not_only_this) {
       !styling.actLikePopup && this.transfer.typeAs !== 'dialog' ? document.querySelector(this.onElement).appendChild(main) : (containers.appendChild(main), document.querySelector(this.onElement).appendChild(containers))
    }

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
    const [title, titleText_fontSize, titleText_color, x_button, inside_txt, inside_txt_fontSize, inside_text_color, text_yPos, inside_txt_paddingLeft, main, insideTxt_div, updateText] = [
      typeof txt === 'object' ? (typeof txt.title === 'object' ? txt.title.text : txt.titleText) || '' : '',
      typeof txt === 'object' && typeof txt.title === 'object' ? txt.title.fontSize || '12px' : '12px', 
      typeof txt === 'object' && typeof txt.title === 'object' ? `color: ${txt.title.color}` || '' : '', 
      this.settings.x_button,
      typeof txt === 'object' ? (typeof txt.inside === 'object' ? txt.inside.text : txt.inside_text) || '' : txt,
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.fontSize || '14px' : '14px', 
      typeof txt === 'object' && typeof txt.inside === 'object' ? `color: ${txt.inside.color}` || '' : '', 
      typeof txt === 'object' && typeof txt.text_yPos === 'string' ? ((/\b(center|top)\b/).test(txt.text_yPos.toLowerCase()) ? txt.text_yPos.toLowerCase() : false) : false,
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.paddingLeft || '10px' : '10px',
      this.transfer.typeAs !== 'dialog' ? document.querySelector(`[data-index='${this.transfer.which_index}']`) : document.querySelector(`[data-popup-holder='dialogMain']`),
      this.transfer.not_only_this ? document.createElement('div') : document.querySelector('[data-popup-holder="insideTxt"]'),
      typeof txt === 'object' && typeof txt.updateText === 'function' ? txt.updateText : undefined
    ]

    const [title_div, x_button_div, x_button_pos] = [main.children[0].firstElementChild, document.createElement('div'), document.createElement('div')]

    x_button_div.innerHTML = '&#10005;'
    x_button_div.classList.add('x_button')
    x_button_div.addEventListener('click', () => { this.settings.autocloser ? (this.settings.fadeInTime ? this.fade(true) : this.show(true, true)) : this.show(true, false) })
    
    insideTxt_div.setAttribute('data-popup-holder', 'insideTxt')
    main.appendChild(insideTxt_div)
    
    x_button_pos.classList.add('x_button_pos')
    main.appendChild(x_button_pos)

    !updateText ? insideTxt_div.innerText = inside_txt : updateText(insideTxt_div)

    title ? (title_div.innerText = title, title_div.classList.add('styleTitle'), title_div.style.cssText = titleText_color, title_div.parentElement.classList.add('styleTitleHead')) : null
    title_div.style.fontSize = titleText_fontSize

    const where_textYpos = text_yPos ? (text_yPos === 'center' ? 'top: 50%;' : 'top: 25%;') : ''
    const textPos = !title ? `margin-top: -${(parseInt(inside_txt_fontSize) / 2)}px; ${where_textYpos}` : ''

    if(main.querySelectorAll('.x_button').length == 0){
      x_button ? (title ? title_div.appendChild(x_button_div) : x_button_pos.appendChild(x_button_div)) : null
    }

    insideTxt_div.style.cssText = `padding-left: ${inside_txt_paddingLeft}; ${textPos}; font-size: ${inside_txt_fontSize}; ${inside_text_color}`

    return this
  }

  show(closeBox = false, timer = true) {
    const showThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.transfer.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']")]

    showThese.forEach((el) => {
      timer ? (!closeBox ? (el.style.display = 'block', setTimeout(() => { this.show(true, false) }, this.settings.hideAfter) ) : el.remove()) : (!closeBox ? el.style.display = 'block' : el.remove())
    })
  }

  fade(closeBox = false, fTime = 0) {
    const fadeThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.transfer.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']")]
    const fadeOutTime =  fTime !== 0 ? fTime : this.settings.fadeOutTime

    fadeThese.forEach((el) => {
      el.style.opacity = !closeBox ? 0 : 1;
      el.style.display = 'block'

      let timer = setInterval(() => {
        el.style.opacity < 0 || el.style.opacity > 1 && !closeBox ? (clearInterval(timer), (!closeBox ? setTimeout(() => { this.fade(true) }, this.settings.waitForFadeOut) : el.remove())) : timer;

        !closeBox ? el.style.opacity -= -(50 / this.settings.fadeInTime) : el.style.opacity -= (50 / fadeOutTime)
      }, 50);
    })
  }

  close(option = {}) {
    const fadeOutTime = typeof option === 'object' && option.fadeOutTime ? option.fadeOutTime : undefined

    fadeOutTime ? this.fade(true, fadeOutTime) : this.show(true, false)

    return this
  }
}

