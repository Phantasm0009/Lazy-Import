
// Test file 1 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load1_1 = lazy('module-1-1');

export async function use1_1() {
  const module = await load1_1();
  return module.default || module;
}

// With options
const loadWithOptions1_1 = lazy('module-1-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load1_2 = lazy('module-1-2');

export async function use1_2() {
  const module = await load1_2();
  return module.default || module;
}

// With options
const loadWithOptions1_2 = lazy('module-1-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load1_3 = lazy('module-1-3');

export async function use1_3() {
  const module = await load1_3();
  return module.default || module;
}

// With options
const loadWithOptions1_3 = lazy('module-1-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load1_4 = lazy('module-1-4');

export async function use1_4() {
  const module = await load1_4();
  return module.default || module;
}

// With options
const loadWithOptions1_4 = lazy('module-1-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load1_5 = lazy('module-1-5');

export async function use1_5() {
  const module = await load1_5();
  return module.default || module;
}

// With options
const loadWithOptions1_5 = lazy('module-1-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load1_1, loadWithOptions1_1, load1_2, loadWithOptions1_2, load1_3, loadWithOptions1_3, load1_4, loadWithOptions1_4, load1_5, loadWithOptions1_5 };
