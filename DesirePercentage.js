async function init4() {

    const data = await d3.csv("https://raw.githubusercontent.com/venky2k11/bank_d3/master/data/DesirePercentage.csv", function (d) {
        return { DATE: d3.timeParse("%Y-%m-%d")(d.DATE), CLUSTER: d.CLUSTER, VALUE: d.VALUE }
    });

    function update(data) {

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz4")
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
            })


        line.selectAll("circle")
            .data(function (d) {
                // console.log('Hello');
                return d.values
            })
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function (d) {
                // console.log(x(d.DATE));
                return x(d.DATE);
            })
            .attr("cy", function (d) {
                // console.log(y(d.VALUE));
                return (d.VALUE);
            })
            .style("fill", "#010f00");
    }

    // function update(data) {
    //     var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    //         width = 700 - margin.left - margin.right,
    //         height = 400 - margin.top - margin.bottom;

    //     // append the svg object to the body of the page
    //     var svg = d3.select("#my_dataviz3")
    //         .append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //         .append("g")
    //         .attr("transform",
    //             "translate(" + margin.left + "," + margin.top + ")");

    //     // Add X axis --> it is a date format
    //     var x = d3.scaleTime()
    //         .domain(d3.extent(data, function (d) { return d.DATE; }))
    //         .range([0, width]);
    //     xAxis = svg.append("g")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(d3.axisBottom(x));

    //     // Max value observed:
    //     const max = d3.max(data, function (d) { return +d.INCOME; })

    //     // Add Y axis
    //     var y = d3.scaleLinear()
    //         .domain([0, d3.max(data, function (d) { return +d.INCOME; })])
    //         .range([height, 0]);
    //     yAxis = svg.append("g")
    //         .call(d3.axisLeft(y));


    //     // Set the gradient
    //     svg.append("linearGradient")
    //         .attr("id", "line-gradient")
    //         .attr("gradientUnits", "userSpaceOnUse")
    //         .attr("x1", 0)
    //         .attr("y1", y(0))
    //         .attr("x2", 0)
    //         .attr("y2", y(max))
    //         .selectAll("stop")
    //         .data([
    //             { offset: "0%", color: "blue" },
    //             { offset: "100%", color: "red" }
    //         ])
    //         .enter().append("stop")
    //         .attr("offset", function (d) { return d.offset; })
    //         .attr("stop-color", function (d) { return d.color; });

    //     // Add a clipPath: everything out of this area won't be drawn.
    //     var clip = svg.append("defs").append("svg:clipPath")
    //         .attr("id", "clip")
    //         .append("svg:rect")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .attr("x", 0)
    //         .attr("y", 0);

    //     // Add brushing
    //     var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    //         .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //         .on("end", updateChart)

    //     var line = svg.append('g')
    //         .attr("clip-path", "url(#clip)")

    //     // Add the line
    //     var path = line.append("path")
    //         .datum(data)
    //         .attr("class", "line")
    //         .attr("fill", "none")
    //         .attr("stroke", "url(#line-gradient)")
    //         .attr("stroke-width", 2)
    //         .attr("d", d3.line()
    //             .x(function (d) { return x(d.DATE) })
    //             .y(function (d) { return y(d.INCOME) })
    //         )

    //     const pathLength = path.node().getTotalLength();
    //     const transitionPath = d3
    //         .transition(d3.easeSin)
    //         .duration(10000);


    //     path
    //         .attr("stroke-dashoffset", pathLength)
    //         .attr("stroke-dasharray", pathLength)
    //         .transition(transitionPath)
    //         .attr("stroke-dashoffset", 0);

    //     // Add the brushing
    //     line
    //         .append("g")
    //         .attr("class", "brush")
    //         .call(brush);

    //     // A function that set idleTimeOut to null
    //     var idleTimeout
    //     function idled() { idleTimeout = null; }


    //     // A function that update the chart for given boundaries
    //     function updateChart() {

    //         // What are the selected boundaries?
    //         extent = d3.event.selection

    //         // If no selection, back to initial coordinate. Otherwise, update X axis domain
    //         if (!extent) {
    //             if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    //             x.domain([4, 8])
    //         } else {
    //             x.domain([x.invert(extent[0]), x.invert(extent[1])])
    //             line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //         }

    //         // Update axis and line position
    //         xAxis.transition().duration(1000).call(d3.axisBottom(x))
    //         line
    //             .select('.line')
    //             .transition()
    //             .duration(1000)
    //             .attr("d", d3.line()
    //                 .x(function (d) { return x(d.DATE) })
    //                 .y(function (d) { return y(d.INCOME) })
    //             )
    //     }

    //     // If user double click, reinitialize the chart
    //     svg.on("dblclick", function () {
    //         x.domain(d3.extent(data, function (d) { return d.DATE; }))
    //         xAxis.transition().call(d3.axisBottom(x))
    //         line
    //             .select('.line')
    //             .transition()
    //             .attr("d", d3.line()
    //                 .x(function (d) { return x(d.DATE) })
    //                 .y(function (d) { return y(d.INCOME) })
    //             )
    //     });

    // }


    update(data)

}