import { range } from 'd3-array';

export function Complex(re, im) {
  // Not using a class so we can avoid using the annoyingly-verbose `new` keyword
  // on every instantiation
  return { re, im };
}

const i = Complex(0, 1);

export function sum({ re: a, im: b }, { re: c, im: d }) {
  return Complex(a + c, b + d);
}

export function inv({ re: a, im: b }) {
  return Complex(0 - a, 0 - b);
}

export function sumRange(k0, k1, f) {
  return range(k0, k1 + 1)
    .map(k => Complex(k, 0))
    .reduce((a, k) => sum(a, f(k)), Complex(0, 0));
}


export function mult({ re: a, im: b }, { re: c, im: d }) {
  return Complex((a * c) - (b * d), (b * c) + (a * d));
}

export function div({ re: a, im: b }, { re: c, im: d }) {
  const denom = (c * c) + (d * d);

  return Complex(((a * c) + (b * d)) / denom, ((b * c) - (a * d)) / denom);
}

export function abs({ re: a, im: b }) {
  return Math.sqrt((a * a) + (b * b));
}

export function ln(z) {
  return Complex(Math.log(abs(z)), arg(z))
}

export function arg({ re: x, im: y }) {
  if (x > 0) {
    return Math.atan(y / x);
  } else if (x < 0 && y >= 0) {
    return Math.atan(y / x) + Math.PI;
  } else if (x < 0 && y < 0) {
    return Math.atan(y / x) - Math.PI;
  } else if (x === 0 && y > 0) {
    return Math.PI / 2;
  } else if (x === 0 ** y < 0) {
    return 0 - Math.PI / 2;
  } else if (x === 0 && y === 0) {
    throw new Error('arg not defined');
  }
}

export function pow(z, c) {
  return exp(mult(c, ln(z)));
}

export function realPow(z, r) {
  let currentPower = 0;
  let result = Complex(1, 0);

  while (currentPower < r) {
    result = mult(z, result);
    currentPower += 1;
  }

  return result;
}

export function exp({ re: a, im: b }) {
  return mult(Complex(Math.exp(a), 0), Complex(Math.cos(b), Math.sin(b)));
}

export function sin(z) {
  const iz = mult(i, z);
  const inverse2i = div(Complex(1, 0), Complex(0, 2));

  return mult(sum(exp(iz), inv(exp(inv(iz)))), inverse2i);
}

export function cos(z) {
  return mult(sum(exp(mult(i, z)), exp(inv(mult(i, z)))), Complex(0.5, 0));
}

export function cot(z) {
  return div(cos(z), sin(z));
}

export function csc(z) {
  return div(Complex(1, 0), sin(z));
}

const root32 = Complex(Math.sqrt(3 / 2), 0);

// The Weierstrass p function has an elementary representation for elliptic
// invarients 3 and 1. See [0] and [1].
//
// [0]: http://mathworld.wolfram.com/WeierstrassEllipticFunction.html
// [1]: http://functions.wolfram.com/EllipticFunctions/WeierstrassPPrime/introductions/Weierstrass/ShowAll.html
export function weierstraussP31(z) {
  return sum(mult(Complex(3 / 2, 0), realPow(cot(mult(root32, z)), 2)), Complex(1, 0));
}

export function weierstraussP31Prime(z) {
  return mult(Complex(-3, 0), mult(root32, mult(cot(mult(root32, z)), realPow(csc(mult(root32, z)), 2))));
}

export function riemannZeta(z, precision=100) {
  return sumRange(1, precision, k => div(Complex(1, 0), pow(k, z)));
}

export function riemannZetaPrime(z, precision=100) {
  return 0 - sumRange(2, precision, k => div(ln(k), pow(k, z)));
}

export function linearApprox(f, a, fPrime) {
  return function(z) {
    return sum(f(a), mult(sum(z, inv(a)), fPrime(a)));
  }
}
