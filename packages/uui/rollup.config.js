import { UUIProdConfig } from '../rollup-package.config';

export default UUIProdConfig({
  entryPoints: ['index'],
  bundle: 'index',
  namespace: 'uui',
});
