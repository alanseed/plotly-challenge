// variables with data for the 5 subjects
var subjects = [];
var metas = [];
var numberSubjects = 5;
var selectedSubject = 0;

// read in the data and make the plots
d3.json("../samples.json").then(function (thisData) {
  // console.log(JSON.stringify(thisData,null,2));

  // get the list of names
  var samples = thisData.samples;
  var sum_values = [];

  // loop over the subjects and sum up all the counts
  for (let i = 0; i < samples.length; i++) {
    let thisSum = 0;
    for (let j = 0; j < samples[i].sample_values.length; j++) {
      thisSum += samples[i].sample_values[j];
    }
    let thisTotal = { id: samples[i].id, sum_value: thisSum };
    sum_values.push(thisTotal);
  }

  // sort them in descending order
  sum_values.sort(function (a, b) {
    return b.sum_value - a.sum_value;
  });

  // load up the data for the top subjects
  for (let i = 0; i < numberSubjects; i++) {
    let id = sum_values[i].id;
    let subject = samples.find(function (rec, index) {
      if (rec.id == id) return true;
    });
    subjects.push(subject);
  }

  // load up the demographic data for the top subjects
  for (let i = 0; i < numberSubjects; i++) {
    let id = sum_values[i].id;
    let demo = thisData.metadata.find(function (rec, index) {
      if (rec.id == id) return true;
    });
    metas.push(demo);
  }

  // make the figures
  optionChanged(selectedSubject);
});

function optionChanged(option) {
  // write out the meta data for this subject
  d3.selectAll("p").remove();
  let idText = `ID: ${metas[option].id}`;
  d3.select("#sample-metadata").append("p").text(idText);
  let ethText = `ethnicity: ${metas[option].ethnicity}`;
  d3.select("#sample-metadata").append("p").text(ethText);
  let genText = `gender: ${metas[option].gender}`;
  d3.select("#sample-metadata").append("p").text(genText);
  let ageText = `age: ${metas[option].age}`;
  d3.select("#sample-metadata").append("p").text(ageText);
  let locText = `location: ${metas[option].location}`;
  d3.select("#sample-metadata").append("p").text(locText);
  let bbtText = `bbtype: ${metas[option].bbtype}`;
  d3.select("#sample-metadata").append("p").text(bbtText);
  let wfrText = `wfreq: ${metas[option].wfreq}`;
  d3.select("#sample-metadata").append("p").text(wfrText);

  // set up the top 10 samples for each id
  var data = [];
  for (let i = 0; i < 10; i++) {
    let record = {
      sample_values: subjects[option].sample_values[i],
      otu_ids: subjects[option].otu_ids[i],
      otu_labels: subjects[option].otu_labels[i],
    };
    data.push(record);
  }
  data.sort(function (a, b) {
    return b.sample_values - a.sample_values;
  });

  // make the varrays for the charts
  let sample_values = data.map((p) => p.sample_values);
  let otu_ids = data.map((p) => p.otu_ids);
  let otu_labels = data.map((p) => p.otu_labels);
  var layout = {
    title: {
      text: `Top 10 Bacteria Cultures found for ${metas[option].id}`,
    },
    yaxis: {
      tickmode: "array",
      tickvals: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      ticktext: otu_ids,
      title: "OTU ID",
    },
    xaxis: {
      title: "Sample count",
    },
  };
  // set up the bar graph
  var bar = [
    {
      type: "bar",
      x: sample_values,
      y: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      text: otu_labels,
      orientation: "h",
    },
  ];
  Plotly.newPlot("bar", bar, layout);

  // make the color array
  let numberIds = subjects[option].otu_ids.length;
  var colors = generateColor("#caf2f8", "#1b4f72", numberIds);

  // sort the subject data on OTU id so that we can get the colours properly 
  var subjectData = [];
  for (let i = 0; i < subjects[option].sample_values.length; i++) {
    let record = {
      sample_values: subjects[option].sample_values[i],
      otu_ids: subjects[option].otu_ids[i],
      otu_labels: subjects[option].otu_labels[i],
    };
    subjectData.push(record);
  }
  subjectData.sort(function (a, b) {
    return a.otu_ids - b.otu_ids;
  });

  // make the varrays for the charts
  sample_values = subjectData.map((p) => p.sample_values);
  otu_ids = subjectData.map((p) => p.otu_ids);
  otu_labels = subjectData.map((p) => p.otu_labels);

  // set up the bubble chart
  var trace2 = {
    mode: "markers",
    x: otu_ids,
    y: sample_values,
    marker: {
      size: sample_values.map((p) => p / 5),
      color: colors,
    },
    text: otu_labels,
  };
  var bData = [trace2];
  var bLayout = {
    title: "Number of samples per OTU",
    yaxis: { title: "Number of samples" },
    xaxis: { title: "OTU ID" },
  };
  Plotly.newPlot("bubble", bData, bLayout);
}



// found this code to make the colors for the bubble plot from 
// https://stackoverflow.com/questions/3080421/javascript-color-gradient

function hex(c) {
  var s = "0123456789abcdef";
  var i = parseInt(c);
  if (i == 0 || isNaN(c)) return "00";
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s) {
  return s.charAt(0) == "#" ? s.substring(1, 7) : s;
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hex) {
  var color = [];
  color[0] = parseInt(trim(hex).substring(0, 2), 16);
  color[1] = parseInt(trim(hex).substring(2, 4), 16);
  color[2] = parseInt(trim(hex).substring(4, 6), 16);
  return color;
}

function generateColor(colorStart, colorEnd, colorCount) {
  // The beginning of your gradient
  var start = convertToRGB(colorStart);

  // The end of your gradient
  var end = convertToRGB(colorEnd);

  // The number of colors to compute
  var len = colorCount;

  //Alpha blending amount
  var alpha = 0.0;

  var saida = [];

  for (i = 0; i < len; i++) {
    var c = [];
    alpha += 1.0 / len;

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.push(convertToHex(c));
  }

  return saida;
}

// Exemplo de como usar

//var tmp = generateColor("#000000", "#ff0ff0", 10);

// for (cor in tmp) {
//   $("#result_show").append(
//     "<div style='padding:8px;color:#FFF;background-color:#" +
//       tmp[cor] +
//       "'>COLOR " +
//       cor +
//       "° - #" +
//       tmp[cor] +
//       "</div>"
//   );
// }
