
// Test file 3 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load3_1 = lazy('module-3-1');

export async function use3_1() {
  const module = await load3_1();
  return module.default || module;
}

// With options
const loadWithOptions3_1 = lazy('module-3-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load3_2 = lazy('module-3-2');

export async function use3_2() {
  const module = await load3_2();
  return module.default || module;
}

// With options
const loadWithOptions3_2 = lazy('module-3-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load3_3 = lazy('module-3-3');

export async function use3_3() {
  const module = await load3_3();
  return module.default || module;
}

// With options
const loadWithOptions3_3 = lazy('module-3-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load3_4 = lazy('module-3-4');

export async function use3_4() {
  const module = await load3_4();
  return module.default || module;
}

// With options
const loadWithOptions3_4 = lazy('module-3-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load3_5 = lazy('module-3-5');

export async function use3_5() {
  const module = await load3_5();
  return module.default || module;
}

// With options
const loadWithOptions3_5 = lazy('module-3-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load3_1, loadWithOptions3_1, load3_2, loadWithOptions3_2, load3_3, loadWithOptions3_3, load3_4, loadWithOptions3_4, load3_5, loadWithOptions3_5 };
