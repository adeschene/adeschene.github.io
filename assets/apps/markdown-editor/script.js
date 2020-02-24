const placeholder =
`# This is a Markdown Previewer

## It was made with React and Sass.
### The following examples show a bit of what can be done with markdown:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function example(foo, bar) {
  if (foo === bar) {
    return fboaor;
  }
}
\`\`\`

You can **bold** your text.
Or _emphasize_ it.
Or ~~de-emphasize~~ it.
Or ~~**_all three_**~~, just to be confusing.

You can place [links](https://adeschene.github.io) in your text,
> Or even put it in block quotes.

You can create nicely formatted tables:

Headers | Go | Up Here
------------ | ------------- | ------------- 
Table items | **go here** | _and here_
~~and~~ here... | \`aaand here\` | and, finally, [here](https://www.github.com/adeschene)

- And of course there are lists.
  - Some are bulleted.
    - With different indentation levels.
      - That look like this.


1. There are also numbered lists.
1. The first number sets the order. 
5. Any number after the first is ignored...
13. And the expected number is printed instead.
  1. Of course, these can also be nested.
  32. This can be done indefinitely.
     - We can even start a non-numbered list here.
1. And, finally, we can also embed images:

![Markdown Logo](https://fcc-web-images-bucket.s3-us-west-2.amazonaws.com/markdown-logo-wikimedia.png)
`;

// Get a reference to the marked Renderer
const renderer = new marked.Renderer();

// Make links open in new tabs
renderer.link = function (href, title, text) {
  return `<a href="${href}" title="Shameless self-promotion" target="_blank">${text}</a>`;
};

// Interpret carriage return in md as <br/>
marked.setOptions({
  breaks: true });


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: placeholder };

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      markdown: event.target.value });

  }
  render() {
    return (
      React.createElement("div", { id: "window-container" },
      React.createElement(Editor, {
        markdown: this.state.markdown,
        onChange: this.handleChange }),

      React.createElement(Preview, { markdown: this.state.markdown })));


  }}
;

const Editor = props => {
  return (
    React.createElement("div", { id: "editor-window" },
    React.createElement("div", { className: "title-bar" }, "Editor"),
    React.createElement("textarea", {
      id: "editor",
      type: "text",
      value: props.markdown,
      onChange: props.onChange })));



};

const Preview = props => {
  return (
    React.createElement("div", { id: "preview-window" },
    React.createElement("div", { className: "title-bar" }, "Preview"),
    React.createElement("div", {
      id: "preview",
      dangerouslySetInnerHTML: { __html: marked(props.markdown, { renderer: renderer }) } })));



};

ReactDOM.render(React.createElement(App, null), document.getElementById("app-surrogate"));