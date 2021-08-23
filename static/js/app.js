// read in the data and make the plots
d3.json("../samples.json").then(function (thisData) {
  //console.log(JSON.stringify(thisData,null,2));  
  
  // get the list of names
  let names = thisData.names;
  let samples = thisData.samples; 
  let sum_values = [] ; 

  // loop over the samples and sum up all the counts 
  for ( let i = 0; i < samples.length; i++){
    let thisSum = 0 ;
    for ( let j = 0; j < samples[i].sample_values.length; j++){
      thisSum +=  samples[i].sample_values[j];
    }
    let thisTotal = {id:samples[i].id, sum_value:thisSum}; 
    sum_values.push(thisTotal); 
  }

  // sort them in descending order 
  sum_values.sort(function(a,b){return b.sum_value - a.sum_value});

  // make the drop down menu with the 10 largest number of samples 
  
  
});
