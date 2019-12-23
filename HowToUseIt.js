new Box('body', { electron: { include: 'header' } }).type('info', { actLikePopup: false }).text('a')
new Box('body', { electron: { include: 'header' } }).type('warning', { actLikePopup: false, moveFrom: 'top left' }).text('t')
new Box('body', { electron: { include: 'header' } }).type('error', { actLikePopup: false }).text('h')
