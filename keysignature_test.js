var clefs = [ 'treble', 'bass' ];

var major_keys = [ 'C',
                   'G',
                   'D',
                   'A',
                   'E',
                   'B',
                   'F#',
                   'F',
                   'Bb',
                   'Eb',
                   'Ab',
                   'Db',
                   'Gb' ];

var minor_keys = [ 'Am',
                   'Em',
                   'Bm',
                   'F#m',
                   'C#m',
                   'G#m',
                   'D#m',
                   'Dm',
                   'Gm',
                   'Cm',
                   'Fm',
                   'Bbm',
                   'Ebm' ];

var notes = [];

function reset()
{
  notes = [];

  var f = document.applyTemplate('keysignature_tmpl');
  var html = '<table>';

  var w = 4;
  var h = 3;

  var randomKeys = [];
  for (var i = 0; i < major_keys.length; ++i)
  {
    randomKeys[i] = i;
  }
  shuffleArray(randomKeys);

  for (var i = 0; i < h; ++i)
  {
    html += '<tr>';
    for (var j = 0; j < w; ++j)
    {
      var element = generateKeySignature(randomKeys[i * w + j]);
      html += '<td>' + f(element) + '</td>';
      notes.push(element);
    }
    html += '</tr>';
  }

  html += '</table>';

  var results = document.getElementById('results');
  results.innerHTML = html;

  notes.forEach(render);
}

var score = 0;

function check()
{
  score = 0;
  notes.forEach(checkNote);

  var results = document.getElementById('score');
  var scoreText = 'Score: ' + score + '/' + notes.length;
  results.innerText = scoreText;
  results.textContent = scoreText;
}

function checkNote(info)
{
  var major_note = document.forms[info.formname_id][info.major_note_id].value;
  var major_modifier = document.forms[info.formname_id][info.major_modifier_id].value;
  var minor_note = document.forms[info.formname_id][info.minor_note_id].value;
  var minor_modifier = document.forms[info.formname_id][info.minor_modifier_id].value;

  var major_key = major_note + major_modifier;
  var minor_key = minor_note + minor_modifier + 'm';

  if (info.major_key == major_key
     && info.minor_key == minor_key)
  {
    document.getElementById(info.answer_id).innerText = '\u2713';
    document.getElementById(info.answer_id).textContent = '\u2713';
    ++score;
  }
  else
  {
    document.getElementById(info.answer_id).innerText = '\u2717';
    document.getElementById(info.answer_id).textContent = '\u2717';
  }
}

function generateKeySignature(n)
{
  var info = {};
  info.id = 'keysig_' + n;
  info.canvas_id = 'canvas_' + n;
  info.formname_id = 'form_' + n;
  info.major_note_id = 'major_note_' + n;
  info.major_modifier_id = 'major_modifier_' + n;
  info.minor_note_id = 'minor_note_' + n;
  info.minor_modifier_id = 'minor_modifier_' + n;
  info.answer_id = 'answer_' + n;

  info.clef = randomFromArray(clefs);

  info.major_key = major_keys[n];
  info.minor_key = minor_keys[n];

  return info;
}

function render(info)
{
  var canvas = document.getElementById(info.canvas_id);
  if (!canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  // clear the canvas
  clearCanvas(canvas, ctx);

  // reset the forms to plain
  document.getElementById(info.answer_id).innerText = '';
  document.getElementById(info.answer_id).textContent = '';

  // make a new vexflow renderer
  var renderer = new Vex.Flow.Renderer(
    canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

  ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 110);

  // draw the clef
  stave.addClef(info.clef);
  stave.addKeySignature(info.major_key);
  stave.setContext(ctx).draw();
}
