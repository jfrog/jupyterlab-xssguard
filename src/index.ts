import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { rendererFactory } from './renders';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_output_iframe extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_output_iframe:plugin',
  description:
    'A JupyterLab extension to insert code block output into iframe.',
  autoStart: true,
  requires: [IRenderMimeRegistry],
  activate: (app: JupyterFrontEnd, rendermime: IRenderMimeRegistry) => {
    console.log('JupyterLab extension jupyterlab_output_iframe is activated!');
    rendermime.addFactory(rendererFactory);
  }
};

export default plugin;
