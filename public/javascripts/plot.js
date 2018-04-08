var x;
var y;
var valueline;
var xAxis;
var yAxis;
var svg;

function initGraph() {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);


    // Set the ranges

    // Define the axes
    xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    // Adds the svg canvas
    svg = d3.select("#plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}


// Parse the date / time
function parseDate(d) {
    return d3.time.format("%Y-%m-%d").parse(d);
}

function updateData(data) {

    // Get the data again


    data.forEach(function(d) {
        d.date = parseDate(d.date[0]);
    });
    console.log(data);

    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([d3.min(data, function(d) { return d.close; }), d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    svg = d3.select("#plot").transition();

    // Make the changes
    svg.select(".line")   // change the line
        .duration(750)
        .attr("d", valueline(data));
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);


}

