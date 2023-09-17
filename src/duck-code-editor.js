import { LitElement, css, html } from "lit";
import Module from "../duck/build/src/duck.js";
import "./prism.js";
import "lit-code";

export class DuckCodeEditor extends LitElement {
  static get properties() {
    return {
      code: { type: String },
    };
  }

  constructor() {
    super();
    Module().then((m) => {
      this.duck = m;
      this.updateText(this.code);
    });
  }

  generate_interface(name) {
    const output = this.duck._malloc(65536);
    const isValid = this.duck.ccall(
      "parse_interface",
      "number",
      ["string", "number"],
      [name, output],
    );
    var outputString = this.duck.UTF8ToString(output);
    this.duck._free(output);
    return outputString;
  }

  updateText(code) {
    this.code = code;
    if (this.duck) {
      this.code = this.generate_interface(code);
    }
  }

  render() {
    return html`
      <div class="editor-grid">
        <lit-code
          class="left"
          linenumbers
          code="struct Drawable {
  void draw();
};"
          @update=${({ detail: code }) => this.updateText(code)}
          language="cpp"
        ></lit-code>
        <lit-code linenumbers code="${this.code}" language="cpp"></lit-code>
      </div>
    `;
  }

  static get styles() {
    return css`
      .editor-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
      }

      lit-code {
        min-width: 100%;
        width: 100%;
        height: 600px;
        box-sizing: border-box;
        border-radius: 2px;
        border: 2px solid #eee;
      }

      .left {
        height: 120px;
      }

      @media (min-width: 700px) {
        .editor-grid {
          grid-template-columns: 1fr 1fr;
        }

        .left {
          height: 600px;
        }
      }
    `;
  }
}

window.customElements.define("duck-code-editor", DuckCodeEditor);
