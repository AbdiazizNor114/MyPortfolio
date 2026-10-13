import test from 'node:test';
import assert from 'node:assert/strict';
import {getProjectMedia,isVideoMedia} from '../shared/projectMedia.js';
test('keeps existing covers compatible while supporting ordered galleries',()=>{
  assert.deepEqual(getProjectMedia('https://example.com/cover.png'),['https://example.com/cover.png']);
  assert.deepEqual(getProjectMedia(' cover.png\r\nphone.png\n\ncover.png '),['cover.png','phone.png']);
  assert.deepEqual(getProjectMedia(''),[]);
  assert.equal(isVideoMedia('https://example.com/demo.mov?token=x'),true);
  assert.equal(isVideoMedia('https://example.com/phone.png'),false);
});
