import { run } from './state';
import { setupInput } from './input';
import * as CONTENT from './content';

//dummyLoad();
//CONTENT.acquireJSON('car1phys.json');
CONTENT.acquireGLB('character.glb');
CONTENT.acquireGLB('roboChest.glb');
setupInput();
run();
