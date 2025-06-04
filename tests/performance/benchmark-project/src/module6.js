
// Test file 6 - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';


// Lazy import 1
const load6_1 = lazy('module-6-1');

export async function use6_1() {
  const module = await load6_1();
  return module.default || module;
}

// With options
const loadWithOptions6_1 = lazy('module-6-1-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 2
const load6_2 = lazy('module-6-2');

export async function use6_2() {
  const module = await load6_2();
  return module.default || module;
}

// With options
const loadWithOptions6_2 = lazy('module-6-2-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 3
const load6_3 = lazy('module-6-3');

export async function use6_3() {
  const module = await load6_3();
  return module.default || module;
}

// With options
const loadWithOptions6_3 = lazy('module-6-3-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 4
const load6_4 = lazy('module-6-4');

export async function use6_4() {
  const module = await load6_4();
  return module.default || module;
}

// With options
const loadWithOptions6_4 = lazy('module-6-4-opts', {
  retries: 3,
  timeout: 5000
});


// Lazy import 5
const load6_5 = lazy('module-6-5');

export async function use6_5() {
  const module = await load6_5();
  return module.default || module;
}

// With options
const loadWithOptions6_5 = lazy('module-6-5-opts', {
  retries: 3,
  timeout: 5000
});


export { load6_1, loadWithOptions6_1, load6_2, loadWithOptions6_2, load6_3, loadWithOptions6_3, load6_4, loadWithOptions6_4, load6_5, loadWithOptions6_5 };
