
// Test file 8 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load8_1 = lazy('module-8-1');

export async function use8_1() {
  const module = await load8_1();
  return module.default || module;
}

// With options
const loadWithOptions8_1 = lazy('module-8-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load8_2 = lazy('module-8-2');

export async function use8_2() {
  const module = await load8_2();
  return module.default || module;
}

// With options
const loadWithOptions8_2 = lazy('module-8-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load8_3 = lazy('module-8-3');

export async function use8_3() {
  const module = await load8_3();
  return module.default || module;
}

// With options
const loadWithOptions8_3 = lazy('module-8-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load8_4 = lazy('module-8-4');

export async function use8_4() {
  const module = await load8_4();
  return module.default || module;
}

// With options
const loadWithOptions8_4 = lazy('module-8-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load8_5 = lazy('module-8-5');

export async function use8_5() {
  const module = await load8_5();
  return module.default || module;
}

// With options
const loadWithOptions8_5 = lazy('module-8-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load8_1, loadWithOptions8_1, load8_2, loadWithOptions8_2, load8_3, loadWithOptions8_3, load8_4, loadWithOptions8_4, load8_5, loadWithOptions8_5 };
