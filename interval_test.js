var clefs = [ 'treble', 'bass' ];

var majorKeys = [ 'C',
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

var clefNotes = { 'treble':
                  [ 'cn/4', 'c#/4',
                    'dn/4',
                    'eb/4', 'en/4',
                    'fn/4', 'f#/4',
                    'gn/4',
                    'ab/4', 'an/4',
                    'bb/4', 'bn/4',
                    'cn/5', 'c#/5',
                    'dn/5',
                    'eb/5', 'en/5',
                    'fn/5', 'f#/5',
                    'gn/5',
                    'ab/5', 'an/5',
                    'bb/5', 'bn/5',
                    'cn/6' ],
                  'bass':
                  [ 'cn/2', 'c#/2',
                    'dn/2',
                    'eb/2', 'en/2',
                    'fn/2', 'f#/2',
                    'gn/2',
                    'ab/2', 'an/2',
                    'bb/2', 'bn/2',
                    'cn/3', 'c#/3',
                    'dn/3',
                    'eb/3', 'en/3',
                    'fn/3', 'f#/3',
                    'gn/3',
                    'ab/3', 'an/3',
                    'bb/3', 'bn/3',
                    'cn/4' ],
                }

var intervals = [ 'U',
                  'm2', 'M2', 'm3', 'M3',
                  'P4', 'TT', 'P5', 'm6',
                  'M6', 'm7', 'M7', 'PO' ];

var notes = [];

function reset()
{
  notes = [];

  var f = document.applyTemplate('interval_tmpl');
  var html = '<table>';

  var w = 5;
  var h = 3;

  for (var i = 0; i < h; ++i)
  {
    html += '<tr>';
    for (var j = 0; j < w; ++j)
    {
      var element = generateInterval(i * w + j);
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
  notes.forEach(checkInterval);

  var results = document.getElementById('score');
  var scoreText = 'Score: ' + score + '/' + notes.length;
  results.innerText = scoreText;
  results.textContent = scoreText;
}

function checkInterval(info)
{
  var interval = document.forms[info.formname_id][info.interval_id].value;

  if (interval == intervals[info.interval])
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

function generateInterval(n)
{
  var info = {};
  info.id = 'int_' + n;
  info.canvas_id = 'canvas_' + n;
  info.formname_id = 'form_' + n;
  info.interval_id = 'interval_' + n;
  info.answer_id = 'answer_' + n;

  info.clef = randomFromArray(clefs);
  info.keysig = randomFromArray(majorKeys);

  info.interval = randomInt(1, 12);

  var highestBase = clefNotes[info.clef].length - 1 - info.interval;
  var baseIdx = randomInt(0, highestBase);
  info.note1 = clefNotes[info.clef][baseIdx];
  info.note2 = clefNotes[info.clef][baseIdx + info.interval];

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
  var stave = new Vex.Flow.Stave(10, 0, 160);

  // draw the clef
  stave.addClef(info.clef);
  stave.addKeySignature('C'); //info.keysig); // TODO: proper key signature considerations
  stave.setContext(ctx).draw();

  // make the note
  var staveNote1 = new Vex.Flow.StaveNote({ keys: [info.note1], duration: 'w', clef: info.clef });

  // add any accidentals for the first note
  if (info.note1[1] == '#' && info.note1[2] == '#')
  {
    staveNote1.addAccidental(0, new Vex.Flow.Accidental('##'));
  }
  else if (info.note1[1] == '#')
  {
    staveNote1.addAccidental(0, new Vex.Flow.Accidental('#'));
  }
  else if (info.note1[1] == 'b' && info.note1[2] == 'b')
  {
    staveNote1.addAccidental(0, new Vex.Flow.Accidental('bb'));
  }
  else if (info.note1[1] == 'b')
  {
    staveNote1.addAccidental(0, new Vex.Flow.Accidental('b'));
  }

  var staveNote2 = new Vex.Flow.StaveNote({ keys: [info.note2], duration: 'w', clef: info.clef });

  // add any accidentals for the second note
  if (info.note2[1] == '#' && info.note2[2] == '#')
  {
    staveNote2.addAccidental(0, new Vex.Flow.Accidental('##'));
  }
  else if (info.note2[1] == '#')
  {
    staveNote2.addAccidental(0, new Vex.Flow.Accidental('#'));
  }
  else if (info.note2[1] == 'b' && info.note2[2] == 'b')
  {
    staveNote2.addAccidental(0, new Vex.Flow.Accidental('bb'));
  }
  else if (info.note2[1] == 'b')
  {
    staveNote2.addAccidental(0, new Vex.Flow.Accidental('b'));
  }

  // Create the notes
  var renderNotes = [staveNote1, staveNote2];

  // Helper function to justify and draw a 4/4 voice
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, renderNotes);
}
