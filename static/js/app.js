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
  let idText = `ID: ${metas[option].id}`
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

}
