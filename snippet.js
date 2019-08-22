/* 💁 using var at the top level instead of const to avoid conflicts when run in chrome console */
var GRANULARITY = 10;
var url =
  'https://smartasset.com/embed/fidelitycustomretirement?render=json&widget_id=q5xe3mjdknpaq9clkudtuzpwggjlc11q&widget=fidelitycustomretirement&scid=jEss9zQTeGkgHoYRviDqx33d';
var options = body => ({
  credentials: 'include',
  headers: {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9,fr;q=0.8,es;q=0.7,en-AU;q=0.6,ja;q=0.5',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    pragma: 'no-cache',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
  },
  referrer:
    'https://smartasset.com/embed/fidelitycustomretirement?&key=q5xe3mjdknpaq9clkudtuzpwggjlc11q&src=https%253A%252F%252Fwww.thestreet.com%252Flifestyle%252Flifestyle-habits-of-millionaires-that-everyone-should-adopt-14547729&ref=https%253A%252F%252Fwww.google.com%252F&ver=1.1&rnd=dvuikmiktzf',
  referrerPolicy: 'no-referrer-when-downgrade',
  body: body,
  method: 'POST',
  mode: 'cors',
});

var axes = {
  income: 'ud-fc-inc',
  savings: 'ud-fc-m-sav',
  age: 'ud-fc-rt-age',
  //     ud-fc-inc: 5,000,000
};

var numberWithCommas = num =>
  new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(num);

// this is a hack. Something is wrong with reducer returns
var globalObj = {};

// there is a better way to encode form data
var bodyFn = (axis1, value1, axis2, value2, axis3, value3) =>
  console.log({ axis1, axis2, value1, value2 }) ||
  [
    `${axes[axis1]}=${encodeURIComponent(numberWithCommas(value1))}`,
    `${axes[axis2]}=${encodeURIComponent(numberWithCommas(value2))}`,
    `${axes[axis3]}=${encodeURIComponent(numberWithCommas(value3))}`,
  ].join('&');

// NEED TO NEST THINGS FURTHER

async function umm(a, b, c) {
  console.log({ a, b, console });
  const [dimension1, domain1] = a;
  const [dimension2, domain2] = b;
  const [dimension3, domain3] = c;

  console.log('dimension1, domain1, dimension2, domain2, dimension3, domain3', {
    dimension1,
    domain1,
    dimension2,
    domain2,
    dimension3,
    domain3,
  });
  domain1.forEach(async x1 => {
    domain2.forEach(async x2 => {
      domain3.forEach(async x3 => {
        //                  const config = options(bodyFn(dimension1, domain1, dimension2, domain2, dimension3, domain3));
        const response = fetch(
          url,
          options(bodyFn(dimension1, x1, dimension2, x2, dimension3, x3)),
        );

        const result = await response.then(responseStream =>
          responseStream.json(),
        );

        //                   console.log('result', x1, x2, x3, result.page_data.retirementScore);
        globalObj[
          `${dimension1}-${x1},${dimension2}-${x2},${dimension3}-${x3}`
        ] = result.page_data.retirementScore;
        //                   console.log('gg', globalObj)
      });
    });
  });
}

async function main() {
  console.log('running...');

  const dimensions = [
    ['income', 5_000_000],
    ['savings', 100_000],
    ['age', 84],
  ].map(d => {
    let arr = [];
    for (let value = 0; value <= d[1]; value += d[1] / GRANULARITY) {
      arr.push(value);
    }
    return [d[0], arr];
  });

  umm(...dimensions);

  //     const obj = dimensions.reduce(async (acc, dim1) => {
  //            console.log(acc, dim1)
  //         const otherDimensions = dimensions.filter(d => dim1[0] !== d[0]);
  //         console.log('otherDimensions', otherDimensions)

  // try {
  //         return otherDimensions.reduce(async (acc2, dim2) => {

  //             const otherOtherDimensions = otherDimensions.filter(d => dim2[0] !== d[0]);

  //             return otherOtherDimensions.reduce(async (acc3, dim3) => {
  //                            console.log('...dim1, ...dim2, acc)', [...dim1, ...dim2, ...dim3])
  //               const y = await umm(...dim1, ...dim2, ...dim3)
  //               return y;
  //             }, acc)

  //         }, acc)

  // // umm(dimensions)
  // } catch (e) {
  //     console.error(e);
  // }

  //         }, {})
  //
}

var promise = main();

promise.then(() => {
  window.data = globalObj;

  console.log('global Obj', globalObj);
});

// var thisWorks = () => {
//     fetch("https://smartasset.com/embed/fidelitycustomretirement?render=json&widget_id=q5xe3mjdknpaq9clkudtuzpwggjlc11q&widget=fidelitycustomretirement&scid=jEss9zQTeGkgHoYRviDqx33d", {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8,es;q=0.7,en-AU;q=0.6,ja;q=0.5","cache-control":"no-cache","content-type":"application/x-www-form-urlencoded; charset=UTF-8","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},"referrer":"https://smartasset.com/embed/fidelitycustomretirement?&key=q5xe3mjdknpaq9clkudtuzpwggjlc11q&src=https%253A%252F%252Fwww.thestreet.com%252Flifestyle%252Flifestyle-habits-of-millionaires-that-everyone-should-adopt-14547729&ref=https%253A%252F%252Fwww.google.com%252F&ver=1.1&rnd=dvuikmiktzf","referrerPolicy":"no-referrer-when-downgrade","body":"ud-fc-m-sav=1%2C200","method":"POST","mode":"cors"}).then(a => a.json()).then(b => console.log('done', b));
// }
