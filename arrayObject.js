// app.js
let data = {
    real_name: 'Millie Bobby Brown',
    character_name: 'Eleven',
    series: 'Stranger Things',
    abc: 'abc Things'
  };
//   console.log(Object.keys(data).length)
//   Object.keys(data).forEach(item => {
//     console.log(item, item.value);
//   });

  for (const [key, value] of Object.entries(data)) {
    console.log(`${key}: ${value}`);
  }