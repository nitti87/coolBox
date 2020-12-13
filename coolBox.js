class Box {
  constructor( onEl, setting = {} ) {
    this.onElement = onEl
    this.settings = {
      top: setting.top || '50%', left: setting.left || '50%',
      height: setting.height || undefined, 
      width: setting.width || undefined,
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
      actLikePopup: styleAs.actLikePopup,
      main_bgColor: styleAs.main_bgColor ? `background-color: ${styleAs.main_bgColor};` : '',
      main_boxShadow: styleAs.main_boxShadow ? `box-shadow: ${styleAs.main_boxShadow};` : '',
      container_bgColor: styleAs.container_bgColor || 'rgba(255, 255, 255, .6)',
      dialog_bgColor: typeof styleAs.dialog !== 'object' ? styleAs.dialog_bgColor || '#ffffff' : styleAs.dialog.backgroundColor || '#ffffff',
      title_bgColor: styleAs.title_bgColor || '#0000000d',
      dialog_boxShadow: typeof styleAs.dialog !== 'object' ? styleAs.dialog_boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)' : styleAs.dialog.boxShadow || '0 0 1px rgba(0, 0, 0, 0.774)',
      startFrom: styleAs.startFrom || 'bottom left',
      x_button_dialog: typeof styleAs.dialog === 'object' && as_what === 'dialog' ? styleAs.dialog.x_button_pos || 'in' : 'in', 
      x_button_top: typeof styleAs.dialog === 'object' && as_what === 'dialog' ? styleAs.dialog.x_button_top || '-32px' : '-32px', 
      x_button_right: typeof styleAs.dialog === 'object' && as_what === 'dialog' ? styleAs.dialog.x_button_right || '-35px' : '-35px', 
      custom_x_button_class:  typeof styleAs.dialog === 'object' && as_what === 'dialog' ? styleAs.dialog.custom_x_button_class || undefined : undefined,
      closeOnBackground: typeof styleAs.dialog === 'object' && as_what === 'dialog' ? styleAs.dialog.closeOnBackground || true : true, 
      only_this: styleAs.only_this || false
    }

    this.transfer = {
      typeAs: as_what.toLowerCase(),
      actLikePopup: styling.actLikePopup || false,
      not_only_this: (document.querySelectorAll("[data-onlythis='true']").length === 0 && !styling.only_this) || document.querySelectorAll(`[data-popup-holder='${!this.transfer.actLikePopup && as_what.toLowerCase() !== 'dialog' ? 'main' : 'container'}']`).length === 0,
      which_index: 0, 
      x_button_dialog_position: styling.x_button_dialog, 
      x_button_top_right: {
        top: styling.x_button_top, 
        right: styling.x_button_right
      }, 
      closeOnBg: styling.closeOnBackground,
      title_bgColor: styling.title_bgColor, 
      custom_x_button_class: styling.custom_x_button_class
    }

    const [containers, main] = [document.createElement('div'), document.createElement('div')]
    containers.setAttribute('data-popup-holder', 'container') 
    containers.style.backgroundColor = styling.container_bgColor

    const styleMain = this.transfer.typeAs !== 'dialog' ?
    (this.transfer.actLikePopup ? `top: ${this.settings.top}; left: ${this.settings.left}; transform: translate(-${this.settings.top}, -${this.settings.left}); `: '') :
    `background-color: ${styling.dialog_bgColor}; box-shadow: ${styling.dialog_boxShadow}`

    const [height, width] = [
      this.settings.height === undefined ? (this.transfer.typeAs !== 'dialog' ? '46px' : '259px') : this.settings.height,
      this.settings.width === undefined ? (this.transfer.typeAs !== 'dialog' ? '180px' : '359px') : this.settings.width
    ]

    main.style.cssText = `height: ${height}; width: ${width}; ${styleMain}; ${styling.main_boxShadow} ${styling.main_bgColor} `
    main.setAttribute('data-popup-holder', this.transfer.typeAs !== 'dialog' ? 'main' : 'dialogMain')
    this.transfer.typeAs !== 'dialog' ? main.classList.add(`popup_${this.transfer.typeAs}`) : undefined
    main.innerHTML = `<div data-popup-holder="titlebar" style="background-color: ${styling.title_bgColor}"> <div data-popup-holder="title"></div> </div>` 

    if (!this.transfer.actLikePopup && this.transfer.typeAs !== 'dialog') {
      const mainLength = document.querySelectorAll("[data-popup-holder='main']").length

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
          main.style.cssText += `top: ${winHeight - parseInt(height) - 25 - (document.querySelectorAll("[data-location='bottom left']").length * new_position)}px; left: 30px`
          break;
        case 'bottom right':
          main.style.cssText += `top: ${winHeight - parseInt(height) - 25 - (document.querySelectorAll("[data-location='bottom right']").length * new_position)}px; right: 30px`
          break;
        case 'top left':
          main.style.cssText += `top: ${40 + (document.querySelectorAll("[data-location='top left']").length * new_position)}px; left: 30px`
          break;
      }
    }

     if(this.transfer.not_only_this) {
       !this.transfer.actLikePopup && this.transfer.typeAs !== 'dialog' ? document.querySelector(this.onElement).appendChild(main) : (containers.appendChild(main), document.querySelector(this.onElement).appendChild(containers))
     }

    // Set the 'z-index' to a value that's greater than itself
    if (this.settings.if_electron) {
      const which_el = this.transfer.actLikePopup || this.transfer.typeAs === 'dialog' ? "[data-popup-holder='container']" : "[data-popup-holder='main']";
      const this_zIndex = window.document.defaultView.getComputedStyle(document.querySelector(which_el)).getPropertyValue('z-index');
      document.querySelectorAll(this.settings.if_electron).forEach((el) => { el.style.zIndex = eval(parseInt(this_zIndex) + 11) })
    }

    this.settings.autocloser ? (this.settings.fadeInTime ? this.fade() : this.show(false, true)) : this.show(false, false)

    return this
  }

  text(txt) {
    const [title, titleText_fontSize, titleText_color, x_button, inside_txt, inside_txt_fontSize, inside_text_color, text_yPos, inside_txt_paddingLeft, main, insideTxt_div, updateText, imageSrc, imageWidth, imageHeight, imageAlt] = [
      typeof txt === 'object' ? (typeof txt.title === 'object' ? txt.title.text : txt.titleText) || '' : '',
      typeof txt === 'object' && typeof txt.title === 'object' ? txt.title.fontSize || '12px' : '12px', 
      typeof txt === 'object' && typeof txt.title === 'object' ? `color: ${txt.title.color}` || '' : '', 
      this.settings.x_button,
      typeof txt === 'object' ? (typeof txt.inside === 'object' ? txt.inside.text : txt.inside_text) || '' : txt,
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.fontSize || '14px' : '14px', 
      typeof txt === 'object' && typeof txt.inside === 'object' ? `color: ${txt.inside.color}` || '' : '',
      typeof txt === 'object' && typeof txt.text_yPos === 'string' ? ((/\b(center|top)\b/).test(txt.text_yPos.toLowerCase()) ? txt.text_yPos.toLowerCase() : false) : false,
      typeof txt === 'object' && typeof txt.inside === 'object' ? txt.inside.paddingLeft || '10px' : '10px',
      this.transfer.typeAs !== 'dialog' ? document.querySelector(!this.transfer.actLikePopup ? `[data-index='${this.transfer.which_index}']` : `[data-popup-holder='main']` ) : document.querySelector(`[data-popup-holder='dialogMain']`),
      this.transfer.not_only_this ? document.createElement('div') : document.querySelector('[data-popup-holder="insideTxt"]'),
      typeof txt === 'object' && typeof txt.updateText === 'function' ? txt.updateText : undefined,
      typeof txt === 'object' && typeof txt.image === 'object' ? txt.image.src || undefined : undefined,
      typeof txt === 'object' && typeof txt.image === 'object' ? txt.image.width || undefined : undefined,
      typeof txt === 'object' && typeof txt.image === 'object' ? txt.image.height || undefined : undefined,
      typeof txt === 'object' && typeof txt.image === 'object' ? txt.image.alt || 'image' : undefined
    ]

    this.transfer['title'] = title

    const [title_div, x_button_div, x_button_pos] = [
      main.children[0].firstElementChild, 
      document.createElement('div'), 
      document.createElement('div')
    ]

    x_button_div.innerHTML = '&#10005;'
    x_button_div.classList.add('x_button')
    x_button_div.addEventListener('click', () => { this.settings.autocloser ? (this.settings.fadeInTime ? this.fade(true) : this.show(true, true)) : this.show(true, false) })
    
    insideTxt_div.setAttribute('data-popup-holder', 'insideTxt_div')

    const [image, insideTxt_text] = [document.createElement('img'), document.createElement('div')]
    image.setAttribute('data-popup-holder', 'insideTxt_image')
    image.setAttribute('src', imageSrc || '#')
    image.style.width = imageWidth || ''
    image.style.height = imageHeight || ''
    image.setAttribute('alt', imageAlt)
    imageSrc ? insideTxt_div.append(image) : undefined

    insideTxt_text.setAttribute('data-popup-holder', 'insideTxt_text')
    insideTxt_div.append(insideTxt_text)

    this.transfer.typeAs !== 'dialog' ? main.appendChild(insideTxt_div) : ''

    const insideTxt_div_fontSize = parseInt(window.getComputedStyle(insideTxt_div).getPropertyValue('font-size'))
    image.style.marginTop = `${eval(insideTxt_div_fontSize - (image.height / 2) - (insideTxt_div_fontSize / 2))}px`

    x_button_pos.classList.add('x_button_pos')
    !title ? main.appendChild(x_button_pos) : ''

    !updateText ? insideTxt_text.innerText = inside_txt : updateText(insideTxt_text)

    title ? (title_div.innerText = title, title_div.classList.add('styleTitle'), title_div.style.cssText = titleText_color, title_div.style.fontSize = titleText_fontSize, title_div.parentElement.classList.add('styleTitleHead')) : null

    const where_textYpos = text_yPos ? (text_yPos === 'center' ? 'top: 50%;' : 'top: 25%;') : 'top: 50%;'
    const textPos = !title ? `margin-top: -${(parseInt(inside_txt_fontSize) / 2)}px; ${where_textYpos}` : ''

    if(main.querySelectorAll('.x_button').length === 0) {
      x_button ? (title ? title_div.appendChild(x_button_div) : x_button_pos.appendChild(x_button_div)) : null
    }

    insideTxt_div.style.cssText = `padding-left: ${inside_txt_paddingLeft}; ${textPos}; font-size: ${inside_txt_fontSize}; ${inside_text_color}`

    return this
  }

  show(closeBox = false, timer = true) {
    const showThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.transfer.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']"), ...document.querySelectorAll("[data-popup-holder='main']")]

    showThese.forEach((el) => {
      timer ? (!closeBox ? (el.style.display = 'block', setTimeout(() => { this.show(true, false) }, this.settings.hideAfter) ) : el.remove()) : (!closeBox ? el.style.display = 'block' : el.remove())
    })
  }

  fade(closeBox = false, fTime = 0) {
    const fadeThese = [...document.querySelectorAll("[data-popup-holder='container']"), ...document.querySelectorAll(`[data-index='${this.transfer.which_index}']`), ...document.querySelectorAll("[data-popup-holder='dialogMain']"), ...document.querySelectorAll("[data-popup-holder='main']")]
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

  html(option) {
    if(this.transfer.typeAs !== 'dialog') {
      return console.error(`It's has to be a dialog, not ${this.transfer.typeAs}`)
    }

    const [dialogMain_inner, dialog_footer, dialog_main, x_button_pos, x_button_div, x_button, title] = [ 
      document.createElement('div'), document.createElement('div'), 
      document.querySelector("[data-popup-holder='dialogMain']"), 
      document.createElement('div'), document.createElement('div'), 
      this.settings.x_button, 
      this.transfer.title
    ]

    let [element, elementWidthInnerHtml] = ['', ['div', 'label', 'a', 'button']]

    x_button_div.innerHTML = '&#10005;'
    x_button_div.classList.add('x_button')
    x_button_div.addEventListener('click', () => { this.settings.autocloser ? (this.settings.fadeInTime ? this.fade(true) : this.show(true, true)) : this.show(true, false) })

    dialog_footer.setAttribute('data-popup-holder', 'dialog_footer')
    dialogMain_inner.setAttribute('data-popup-holder', 'dialogMain_inner')

    x_button_pos.classList.add('x_button_pos')
    !title ? dialogMain_inner.appendChild(x_button_pos) : null
    
    const title_div = dialog_main.children[0].firstElementChild
    title ? (title_div.style.width = '95%', title_div.parentElement.style.position = 'relative') : null

    dialog_main.appendChild(dialogMain_inner)
    dialog_main.appendChild(dialog_footer)

    this.transfer.closeOnBg ?
      document.querySelector("[data-popup-holder='container']").addEventListener('click', (e) => {
        e.target.getAttribute('data-popup-holder') === 'container' ?
        this.settings.autocloser ? (this.settings.fadeInTime ? this.fade(true) : this.show(true, true)) : this.show(true, false) : undefined
      }) : undefined

    if(x_button) {
      title === undefined ? x_button_pos.appendChild(x_button_div) : ''
      this.transfer.x_button_dialog_position !== 'in' && !title ? (x_button_pos.style.right = this.transfer.x_button_top_right.right, 
        x_button_pos.style.top = this.transfer.x_button_top_right.top) 
      : null      
      this.transfer.custom_x_button_class ? x_button_pos.classList.add(this.transfer.custom_x_button_class) : x_button_pos.style.fontSize = '18px'
    }
    
    option.map(objectInArray => {
      for (let options in objectInArray) {
        element = options !== 'main' && options !== 'footer' ? options : undefined

        let [style, className, id, HTML_or_value, type, imgSrc, labelFor, mainOrFooter, inMainOrFooter, createEl, keyup, keydown, click, placeHolder] = [
          objectInArray[options].style, 
          objectInArray[options].class, 
          objectInArray[options].id, 
          elementWidthInnerHtml.includes(element) ? objectInArray[options].html : objectInArray[options].value, 
          objectInArray[options].type, 
          element === 'img' ? objectInArray[options].src : undefined, 
          element === 'label' ? objectInArray[options].label : undefined, 
          !element && (options === 'main' || options === 'footer') ? (options === 'main' ? dialogMain_inner : dialog_footer) : undefined, 
          typeof objectInArray[options].inMain === 'boolean' ? objectInArray[options].inMain : (element !== 'button'),
          undefined, 
          objectInArray[options].keyup, 
          objectInArray[options].keydown, 
          objectInArray[options].click, 
          objectInArray[options].placeholder
        ]

        if (element) {
          createEl = document.createElement(element)
          style ? createEl.style.cssText = style : undefined
          className ? createEl.setAttribute('class', className) : undefined
          id ? createEl.setAttribute('id', id) : undefined
          type ? createEl.setAttribute('type', type) : (element === 'input' ? createEl.setAttribute('type', 'text') : undefined)
          HTML_or_value ? (elementWidthInnerHtml.includes(element) ? createEl.innerHTML = HTML_or_value : createEl.setAttribute('value', HTML_or_value)) : undefined
          imgSrc && element === 'img' ? createEl.setAttribute('src', imgSrc) : undefined 
          placeHolder && element === 'input' ? createEl.setAttribute('placeholder', placeHolder) : undefined
          labelFor && element === 'label' ? createEl.setAttribute('label', labelFor) : undefined

          inMainOrFooter ? dialogMain_inner.appendChild(createEl) : dialog_footer.appendChild(createEl)

          typeof keyup === 'function' ? createEl.addEventListener('keyup', (e) => { keyup(e) }) : undefined
          typeof keydown === 'function' ? createEl.addEventListener('keydown', (e) => { keydown(e) }) : undefined
          typeof click === 'function' ? createEl.addEventListener('click', (e) => { click(e) }) : undefined
        }

        mainOrFooter ? (style ? mainOrFooter.style.cssText = style : undefined) : undefined
        mainOrFooter ? (className ? mainOrFooter.setAttribute('class', className) : undefined) : undefined
      }
    }) 

    return this
  }
}
