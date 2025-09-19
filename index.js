const [, , action, ...numbers] = process.argv;
console.log("🚀 ~ params:", action, numbers);

function add(numbers) {
  return numbers.reduce((acc, val) => {
    return acc + parseInt(val);
  }, 0);
}

function divide(numbers) {
  if (parseInt(numbers[1]) !== 0) {
    return parseInt(numbers[0]) / parseInt(numbers[1]);
  }
  console.error("the second number can't be zero");
}


function sub(numbers) {
  return numbers.reduce((acc, val) => {
    return acc - parseInt(val);
  })
}


function multi(numbers) {
  return numbers.reduce((acc, val) => {
    return acc * parseInt(val);
  }, 1)
}

let result;
switch (action) {
  case "add":
    result = add(numbers);
    break;
  case "divide":
    result = divide(numbers);
    break;
  case "sub":
    result = sub(numbers);
    break;
  case "multi":
    result = multi(numbers)
    break;
  default:
    console.log("Unknown action.");
    break;
}

console.log("your result is: ", result);
