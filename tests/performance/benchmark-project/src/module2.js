
// Test file 2 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load2_1 = lazy('module-2-1');

export async function use2_1() {
  const module = await load2_1();
  return module.default || module;
}

// With options
const loadWithOptions2_1 = lazy('module-2-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load2_2 = lazy('module-2-2');

export async function use2_2() {
  const module = await load2_2();
  return module.default || module;
}

// With options
const loadWithOptions2_2 = lazy('module-2-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load2_3 = lazy('module-2-3');

export async function use2_3() {
  const module = await load2_3();
  return module.default || module;
}

// With options
const loadWithOptions2_3 = lazy('module-2-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load2_4 = lazy('module-2-4');

export async function use2_4() {
  const module = await load2_4();
  return module.default || module;
}

// With options
const loadWithOptions2_4 = lazy('module-2-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load2_5 = lazy('module-2-5');

export async function use2_5() {
  const module = await load2_5();
  return module.default || module;
}

// With options
const loadWithOptions2_5 = lazy('module-2-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load2_1, loadWithOptions2_1, load2_2, loadWithOptions2_2, load2_3, loadWithOptions2_3, load2_4, loadWithOptions2_4, load2_5, loadWithOptions2_5 };
