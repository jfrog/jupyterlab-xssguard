import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_output_iframe extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_output_iframe:plugin',
  description: 'A JupyterLab extension to insert code block output inso iframe.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_output_iframe is activated!');
  }
};

export default plugin;
