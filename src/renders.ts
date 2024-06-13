import { IRenderMime, RenderedText, renderText } from '@jupyterlab/rendermime';


const wrapWithIFrame = async (
  options: renderText.IRenderOptions,
) => {
  var iframe = document.createElement('iframe');
  (<any>iframe).sandbox="allow-scripts allow-modals";
  (<any>iframe).frameBorder = "0";
  // (<any>iframe).onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));';
  
  (<any>iframe).style="width:100%;border:none;overflow:hidden;";

  var srcdoc = `
<html>
<head>

</head>
<body>
  ` + options.source + "</body></html>"

  options.host.append(iframe);
  iframe.srcdoc = srcdoc;
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
      translator: this.translator,
    });
  }
}

export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [
    'text/html',
    'application/vnd.jupyter.stdout',
    'application/vnd.jupyter.stderr',
  ],
  createRenderer: (options) => new MyRenderedText(options),
};