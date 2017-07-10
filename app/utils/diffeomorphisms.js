export function dot([a0, a1], [b0, b1]) {
  return (a0 * b0) + (a1 * b1);
}

export function mult([a, b], s) {
  return [s * a, s * b];
}

export function div([a, b], s) {
  return [a / s, b / s];
}

export function proj(v, u) {
  return mult(u, (dot(v, u) / dot(u, u)));
}

export function normalize(v) {
  return div(v, Math.sqrt(dot(v, v)));
}

export function add(v, ...vs) {
  return vs.reduce((a, u) => [a[0] + u[0], a[1] + u[1]], v);
}

export function subtract(v, ...vs) {
  return vs.reduce((a, u) => [a[0] - u[0], a[1] - u[1]], v);
}

export function gramSchmidt(vs) {
  const us = [];

  for (let k = 0; k < vs.length; k++) {
    if (k === 0) {
      us.push(vs[k]);
    } else {
      us.push(subtract(vs[k], ...us.slice(0, k).map(u => proj(vs[k], u))));
    }
  }

  return us.map(u => normalize(u));
}

export function matrixToDiffeoHomotopy(f, t, fPrimeNull) {
  if (t === 0) {
    return fPrimeNull;
  }

  return x => div(subtract(f(mult(x, t), f([0, 0]), mult(f([0, 0]), 0 - t))), t);
}
