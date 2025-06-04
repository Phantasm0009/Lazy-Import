
// Test file 4 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load4_1 = lazy('module-4-1');

export async function use4_1() {
  const module = await load4_1();
  return module.default || module;
}

// With options
const loadWithOptions4_1 = lazy('module-4-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load4_2 = lazy('module-4-2');

export async function use4_2() {
  const module = await load4_2();
  return module.default || module;
}

// With options
const loadWithOptions4_2 = lazy('module-4-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load4_3 = lazy('module-4-3');

export async function use4_3() {
  const module = await load4_3();
  return module.default || module;
}

// With options
const loadWithOptions4_3 = lazy('module-4-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load4_4 = lazy('module-4-4');

export async function use4_4() {
  const module = await load4_4();
  return module.default || module;
}

// With options
const loadWithOptions4_4 = lazy('module-4-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load4_5 = lazy('module-4-5');

export async function use4_5() {
  const module = await load4_5();
  return module.default || module;
}

// With options
const loadWithOptions4_5 = lazy('module-4-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load4_1, loadWithOptions4_1, load4_2, loadWithOptions4_2, load4_3, loadWithOptions4_3, load4_4, loadWithOptions4_4, load4_5, loadWithOptions4_5 };
