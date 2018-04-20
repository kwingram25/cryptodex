import { jsdom } from 'jsdom';
import hook from 'css-modules-require-hook';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import postCSSConfig from '../webpack/postcss.config';

Enzyme.configure({ adapter: new Adapter() });

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  prepend: postCSSConfig.plugins,
});
