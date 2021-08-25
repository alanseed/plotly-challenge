// variables with data for the 5 subjects
var subjects = [];
var metas = [];
var numberSubjects = 5;
var selectedSubject = 0;

// read in the data and make the plots
d3.json("https://alanseed.github.io/plotly-challenge/samples.json").then(function (thisData) {
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

  // sort the subject data on OTU id so that we can get the colours properly 
  // turns out that this was not necessary, will remove if I have time 
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
      size: sample_values.map((p) => 5 + Math.log(p)*10),
      color:otu_ids
    },
    text: otu_labels,
  };
  var bData = [trace2];
  var bLayout = {
    title: "Bacteria Cultures Per Sample",
    yaxis: { title: "Number of samples" },
    xaxis: { title: "OTU ID" },
  };
  Plotly.newPlot("bubble", bData, bLayout);

  // make the gauge plot 
  var trace3 = [
  {
    domain:{x:[0,1], y:[0,1]}, 
    value:metas[option].wfreq, 
    title:{text:"Belly Button Washing Per Week"},
    type:"indicator",
    mode:"gauge+number",
    delta:{reference:5},
    gauge:{axis:{range:[null,9]}}
  }
];
var gLayout={width:600, height:400}; 
Plotly.newPlot("gauge", trace3, gLayout ); 
}