class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorTypes = {
      default: { file: 'normal.cur', css: 'auto' },
      pointer: { file: 'alt.cur', css: 'pointer' },
      text: { file: 'text.cur', css: 'text' },
      textInput: { file: 'working.ani', css: 'text' },
      busy: { file: 'busy.ani', css: 'wait' },
      move: { file: 'move.cur', css: 'move' },
      vertical: { file: 'vertical.cur', css: 'row-resize' }
    };
    this.init();
  }

  init() {
    if (!this.supportsCustomCursors()) return;
    
    this.createCursor();
    this.addEventListeners();
    document.body.classList.add('custom-cursors-active');
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
    this.setCursor('default');
  }

  addEventListeners() {
    document.addEventListener('mousemove', this.trackMouse.bind(this));
    document.addEventListener('mousedown', () => this.cursor.classList.add('click'));
    document.addEventListener('mouseup', () => this.cursor.classList.remove('click'));
    document.addEventListener('mouseout', () => this.setCursor('default'));
  }

  trackMouse(e) {
    this.cursor.style.left = `${e.clientX}px`;
    this.cursor.style.top = `${e.clientY}px`;
    this.detectCursorType(e);
  }

  detectCursorType(e) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target) return;

    if (target.closest('a, button, .interactive')) {
      this.setCursor('pointer');
    } 
    else if (target.closest('input, textarea, select')) {
      this.setCursor('textInput');
    }
    else if (target.closest('[contenteditable]')) {
      this.setCursor('text');
    }
    else if (target.closest('.busy-cursor, [aria-busy="true"]')) {
      this.setCursor('busy');
    }
    else if (target.closest('.draggable, [draggable="true"]')) {
      this.setCursor('move');
    }
    else if (target.closest('.resizable-vertical')) {
      this.setCursor('vertical');
    }
    else {
      this.setCursor('default');
    }
  }

  setCursor(type) {
    if (!this.cursorTypes[type] || this.currentType === type) return;
    this.currentType = type;
    
    // Preload image to verify it exists
    const img = new Image();
    img.src = `cursor/${this.cursorTypes[type].file}`;
    img.onload = () => {
      this.cursor.style.backgroundImage = `url('cursor/${this.cursorTypes[type].file}')`;
    };
    img.onerror = () => {
      console.warn(`Cursor not found: cursor/${this.cursorTypes[type].file}`);
      this.cursor.style.backgroundImage = '';
    };
  }

  supportsCustomCursors() {
    try {
      const test = new Image();
      test.src = 'cursor/normal.cur';
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new CustomCursor());