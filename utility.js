function clearCanvas(canvas, context)
{
  context.clearRect(0, 0, canvas.width, canvas.height);
  var w = canvas.width;
  canvas.width = 1;
  canvas.width = w;
}

function randomFromArray(a)
{
  return a[randomInt(0, a.length - 1)];
}

function randomInt(low, high)
{
  return low + Math.floor(Math.random() * (high - low + 1));
}

function shuffleArray(a)
{
  var l = a.length;
  for (var i = 0; i < l; ++i)
  {
    var r = randomInt(i, l - 1);
    var tmp = a[i];
    a[i] = a[r];
    a[r] = tmp;
  }
}
