import { module, test } from 'qunit';
import {
  Complex,
  sin,
  cos,
  csc,
  cot,
  exp,
  ln,
  mult,
  div,
  arg,
  pow,
  weierstraussP31,
  weierstraussP31Prime,
  riemannZeta
} from '../../../utils/complex-numbers';

module('Unit | Utility | complex-numbers');

function complexApproxEqual([a, b], [c, d], precision=2) {
  const fixed = [a, b, c, d].map(x => x.toFixed(precision));

  return fixed[0] === fixed[2] && fixed[1] === fixed[3];
}

test('mult', function(assert) {
  assert.deepEqual(mult(Complex(1, 2), Complex(3, 4)), Complex(-5, 10));
});

test('div', function(assert) {
  assert.ok(complexApproxEqual(div(Complex(3, 4), Complex(9, 2)), Complex(7 / 17, 6 / 17)));
});

test('exp', function(assert) {
  assert.ok(complexApproxEqual(exp(Complex(3, 4)), Complex(-13.1288, -15.2008)));
});

test('sin', function(assert) {
  assert.ok(complexApproxEqual(sin(Complex(1, 0)), Complex(0.841471, 0)));
  assert.ok(complexApproxEqual(sin(Complex(3, 4)), Complex(3.85374, -27.0168)));
});

test('cos', function(assert) {
  assert.ok(complexApproxEqual(cos(Complex(3, 4)), Complex(-27.0349, -3.85115)));
});

test('csc', function(assert) {
  assert.ok(complexApproxEqual(csc(Complex(2, 2)), Complex(0.244687, 0.107955)));
});

test('cot', function(assert) {
  assert.ok(complexApproxEqual(cot(Complex(2, 2)), Complex(-0.0270655, -0.975969)));
});

test('arg', function(assert) {
  assert.equal(arg(Complex(2, 3)).toFixed(3), (0.982794).toFixed(3));
});

test('ln', function(assert) {
  assert.ok(complexApproxEqual(ln(Complex(2, 3)), Complex(1.28247, 0.982794)));
});

test('pow', function(assert) {
  assert.ok(complexApproxEqual(pow(Complex(2,3), Complex(4,5)), Complex(-0.753046, -0.986429)));
});

test('weierstraussP31', function(assert) {
 assert.ok(complexApproxEqual(weierstraussP31(Complex(1, 1)), Complex(-0.12226, -0.2523)));
});

test('weierstraussP31Prime', function(assert) {
 assert.ok(complexApproxEqual(weierstraussP31Prime(Complex(1, 1)), Complex(0.44847502198125844, 0.8650268881957414)));
});

test('riemannZeta', function(assert) {
  const result = riemannZeta(Complex(2,3));
  const expected = Complex(0.798022, -0.113744);

  assert.ok(complexApproxEqual(result, expected));
});
