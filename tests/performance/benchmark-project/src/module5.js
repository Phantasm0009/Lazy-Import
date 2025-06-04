
// Test file 5 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load5_1 = lazy('module-5-1');

export async function use5_1() {
  const module = await load5_1();
  return module.default || module;
}

// With options
const loadWithOptions5_1 = lazy('module-5-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load5_2 = lazy('module-5-2');

export async function use5_2() {
  const module = await load5_2();
  return module.default || module;
}

// With options
const loadWithOptions5_2 = lazy('module-5-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load5_3 = lazy('module-5-3');

export async function use5_3() {
  const module = await load5_3();
  return module.default || module;
}

// With options
const loadWithOptions5_3 = lazy('module-5-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load5_4 = lazy('module-5-4');

export async function use5_4() {
  const module = await load5_4();
  return module.default || module;
}

// With options
const loadWithOptions5_4 = lazy('module-5-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load5_5 = lazy('module-5-5');

export async function use5_5() {
  const module = await load5_5();
  return module.default || module;
}

// With options
const loadWithOptions5_5 = lazy('module-5-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load5_1, loadWithOptions5_1, load5_2, loadWithOptions5_2, load5_3, loadWithOptions5_3, load5_4, loadWithOptions5_4, load5_5, loadWithOptions5_5 };
