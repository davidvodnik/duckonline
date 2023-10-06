import { LitElement, css, html } from 'lit'
import Module from '../duck/build/src/duck.js'
import './prism.js'
import 'lit-code'

export class DuckCodeEditor extends LitElement {
  static get properties() {
    return {
      code: { type: String },
    }
  }

  constructor() {
    super()
    Module().then((m) => {
      this.duck = m
      this.updateText(this.shadowRoot.querySelector('.left').getCode())
    })
  }

  updateText(code) {
    if (this.duck) {
      this.code = this.duck.generate_interface(code)
    }
  }

  render() {
    return html`
      <div class="editor-grid">
        <div class="editor-container">
          <lit-code
            class="left"
            linenumbers
            code="struct Drawable {
  void draw();
};"
            language="cpp"
            @update=${({ detail: code }) => this.updateText(code)}
          ></lit-code>
        </div>
        <div class="editor-container">
          <lit-code
            code=${this.code}
            linenumbers
            class="right"
            language="cpp"
          ></lit-code>
        </div>
      </div>
    `
  }

  static get styles() {
    return css`
      .editor-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
      }

      .editor-container {
        min-width: 100%;
        width: 100%;
        border-radius: 8px;
        border: 2px solid #eee;
      }

      lit-code {
        height: 600px;
        box-sizing: border-box;
        border-radius: 6px;
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
    `
  }
}

window.customElements.define('duck-code-editor', DuckCodeEditor)
