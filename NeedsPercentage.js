async function init3() {

    const data = await d3.csv("https://raw.githubusercontent.com/venky2k11/bank_d3/master/data/NeedsPercentage.csv", function (d) {
        return { DATE: d3.timeParse("%Y-%m-%d")(d.DATE), CLUSTER: d.CLUSTER, VALUE: d.VALUE }
    });

    function update(data) {

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.CLUSTER; })
            .entries(data);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.DATE; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b-%y')));


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.VALUE; })])
            .range([height, 0]);
        yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // create a tooltip
        var Tooltip = d3.select("#my_dataviz3")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            Tooltip
                .html("Needs: " + d.VALUE + '%' + '<br>' + (d.DATE))
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1] + 900) + "px")
        }
        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
        }

        // color palette
        var res = sumstat.map(function (d) { return d.key }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        // Draw the line
        line = svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("stroke-width", 2)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.DATE); })
                    .y(function (d) { return y(+d.VALUE); })
                    (d.values)
            });

        svg
            .append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "myCircle")
            .attr("cx", function (d) { return x(d.DATE) })
            .attr("cy", function (d) { return y(+d.VALUE) })
            .attr("r", 6)
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("fill", "white")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        // Add one dot in the legend for each name.
        svg.selectAll("mydots")
            .data(res)
            .enter()
            .append("circle")
            .attr("cx", 500)
            .attr("cy", function (d, i) { return 300 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return color(d) })

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(res)
            .enter()
            .append("text")
            .attr("x", 510)
            .attr("y", function (d, i) { return 300 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    }
    update(data)

}