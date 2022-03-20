export default class Editor {
  constructor(root) {
    this.root = root;
    this.init();
  }

  init() {
    this.currentLine = 0;
    this.totalLines = 0;

    this.main = document.createElement("div");

    this.main.classList.add("editor__main");

    this.gutter = document.createElement("div");
    this.code = document.createElement("div");

    this.gutter.classList.add("editor__main__gutter");
    this.code.classList.add("editor__main__code");

    this.main.appendChild(this.gutter);
    this.main.appendChild(this.code);

    this.root.appendChild(this.main);

    this.importCss();
    this.appendLine();
  }

  importCss() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "editor/editor.css";
    document.head.appendChild(link);
  }

  appendLine() {
    this.insertLine(this.totalLines);
  }

  insertLine(idx) {
    const gutterSpan = document.createElement("span");
    gutterSpan.classList.add("editor__main__gutter__span");
    gutterSpan.textContent = ++this.totalLines;
    this.gutter.appendChild(gutterSpan);

    const codeLine = document.createElement("div");
    codeLine.classList.add("editor__main__code__line");
    codeLine.contentEditable = true;
    codeLine.spellcheck = false;

    codeLine.addEventListener("click", () => {
      this.currentLine =
        Array.prototype.indexOf.call(this.code.children, codeLine) + 1;
    });

    codeLine.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.insertLine(this.currentLine);
      } else if (e.key === "Backspace") {
        if (codeLine.textContent === "" && this.totalLines !== 1) {
          e.preventDefault();
          this.deleteLine();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.currentLine === 1) return;
        this.code.children[--this.currentLine - 1].focus();
        this.setCaretPos(
          this.code.children[this.currentLine - 2].innerText.length
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.currentLine === this.totalLines) return;
        this.code.children[++this.currentLine - 1].focus();
      }
    });

    this.currentLine++;

    this.code.insertBefore(codeLine, this.code.children[idx]);

    codeLine.focus();
  }

  deleteLine() {
    this.code.removeChild(this.code.children[--this.currentLine]);
    this.gutter.removeChild(this.gutter.lastChild);
    this.code.children[this.currentLine - 1].focus();
    this.setCaretToEnd();
    this.totalLines--;
  }

  setCaretPos(idx) {
    let range = document.createRange();
    let sel = window.getSelection();
    let node = this.code.children[this.currentLine - 1].childNodes[0];

    if (node.length === 0) return;

    range.setStart(node, idx);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  setCaretToEnd() {
    this.setCaretPos(this.code.children[this.currentLine - 1].innerText.length);
  }
}
