import {setAutoFreeze} from 'immer';

import App from './App';

setAutoFreeze(false);

window.App = App;
