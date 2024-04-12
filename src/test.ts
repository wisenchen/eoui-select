/*
 * @Name: file content
 * @Copyright: 广州银云信息科技有限公司
 * @Author: 
 * @Date: 2022-02-22 18:22:18
 * @LastEditors: wisen
 * @LastEditTime: 2022-02-22 18:22:18
 */
/*
 * @Name: file content
 * @Copyright: 广州银云信息科技有限公司
 * @Author: 
 * @Date: 2022-02-22 18:14:28
 * @LastEditors: wisen
 * @LastEditTime: 2022-02-22 18:14:29
 */
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
