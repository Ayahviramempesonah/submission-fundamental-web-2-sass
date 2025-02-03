class MyFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.shadowRoot.innerHTML = `
    <style>
    footer{
    background-color:#333;
    color:#fff;
    padding:1rem;
    text-align:center;
    margin:0;
    }
    </style>

    <hr/>
    <footer>
    <p>&copy; CopyRight ${new Date().getFullYear()} coderTamvan</p>
    </footer>
    `;
  }
}

customElements.define('my-footer', MyFooter);
