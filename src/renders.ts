import { IRenderMime, RenderedText, renderText } from '@jupyterlab/rendermime';

let iframe_counter = 0;
const MAX_IFRAMES = 100000;

// Listen for messages from the iframes.
window.addEventListener(
  'message',
  e => {
    const id_to_find = e.data[0];
    const o = document.getElementById(id_to_find);
    if (o) {
      o.setAttribute('style', 'height: ' + e.data[1] + 'px; width: 100%;');
    }
  },
  false
);

const wrapWithIFrame = async (options: renderText.IRenderOptions) => {
  // Set a counter for unique iframe ids
  if (iframe_counter === MAX_IFRAMES) {
    console.log("Exceeded max iframes");
    return;
  }
  iframe_counter++;

  const doc_head = document.head;
  const doc_body = document.body;

  // Create our iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'xss_guard' + iframe_counter;
  (iframe as any).sandbox = 'allow-scripts allow-modals';
  (iframe as any).frameBorder = '0';

  const iframe_dom = document.implementation.createHTMLDocument();

  const iframeHead = iframe_dom.head;

  // Copy <style> tags from document head
  const styleElements = doc_head.querySelectorAll('style');
  styleElements.forEach(style => {
    const clonedStyle = style.cloneNode(true) as HTMLStyleElement;
    iframeHead.appendChild(clonedStyle);
  });

  // Copy link[rel="stylesheet"] from document body
  const linkElements = doc_body.querySelectorAll('link[rel="stylesheet"]');
  linkElements.forEach(link => {
    const clonedLink = link.cloneNode(true) as HTMLLinkElement;
    iframeHead.appendChild(clonedLink);
  });

  // Set transparent background
  const iframeBody = iframe_dom.body;
  iframeBody.setAttribute('style', 'background-color: transparent;');

  // Add script to post height to parent when loaded
  const scriptObj = document.createElement('script');
  scriptObj.type = 'text/javascript';
  scriptObj.innerHTML =
    `
function sendHeight()
{
  if(parent.postMessage && document.getElementById('contents_div').offsetHeight)
  {
    var height = document.getElementById('contents_div').offsetHeight;
    parent.postMessage(['` +
    iframe.id +
    `', height], '*');
  }
}

function loadIframe()
{
  sendHeight();
  setInterval('sendHeight()', 1000);
}
  `;
  iframeHead.appendChild(scriptObj);
  iframeBody.setAttribute('onload', 'loadIframe()');

  // Add a div with class renderedText
  const div_rendered_text = document.createElement('div');

  // We may possibly want more relevant styles here
  div_rendered_text.className =
    'jp-WindowedPanel lm-Widget jp-Notebook jp-mod-scrollPastEndlm-Widget lm-Panel jp-Cell-outputWrapper jp-RenderedHTMLCommon jp-RenderedHTML jp-mod-trusted jp-OutputArea-output';
  // Set the div's id for sending its height
  div_rendered_text.id = 'contents_div';

  iframe_dom.body.appendChild(div_rendered_text);
  div_rendered_text.innerHTML = options.source;

  const iframe_srcdoc = iframe_dom.documentElement.outerHTML;

  options.host.append(iframe);
  iframe.srcdoc = iframe_srcdoc;
};

export class MyRenderedText extends RenderedText {
  /**
   * Render a mime model.
   *
   * @param model - The mime model to render.
   *
   * @returns A promise which resolves when rendering is complete.
   */
  render(model: IRenderMime.IMimeModel): Promise<void> {
    return wrapWithIFrame({
      host: this.node,
      sanitizer: this.sanitizer,
      source: String(model.data[this.mimeType]),
      translator: this.translator
    });
  }
}

export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: ['text/html'],
  createRenderer: options => new MyRenderedText(options)
};
