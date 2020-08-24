async function init8() {

    const data = await d3.csv("https://raw.githubusercontent.com/venky2k11/bank_d3/master/data/PopularExpenses5.csv", function (d) {
        return {
            DATE: d3.timeParse("%Y-%m-%d")(d.DATE),
            TRANSPORT: d.TRANSPORT,
            BOTTLESHOPS: d.BOTTLESHOPS,
            CASHOUT: d.CASHOUT,
            CHEMISTS: d.CHEMISTS,
            EDUCATION: d.EDUCATION,
            ENTERTAINMENT: d.ENTERTAINMENT,
            FASTFOOD: d.FASTFOOD,
            FEESNCHARGES: d.FEESNCHARGES,
            GIFTS: d.GIFTS,
            GROCERY: d.GROCERY,
            HOTELS: d.HOTELS,
            INSURANCE: d.INSURANCE,
            INVESTMENTS: d.INVESTMENTS,
            LOANPAY: d.LOANPAY,
            MISCELLANEOUS: d.MISCELLANEOUS,
            FINEDINNING: d.FINEDINNING,
            RETAILSHOPPING: d.RETAILSHOPPING,
            SUBSCRIPTION: d.SUBSCRIPTION,
            TRAVEL: d.TRAVEL,
            UTILITIES: d.UTILITIES
        }
    });

    function update(data) {

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 200, bottom: 30, left: 130 },
            width = 1700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz8")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var allGroup = ["DATE",
            "TRANSPORT",
            "BOTTLESHOPS",
            "CASHOUT",
            "CHEMISTS",
            "EDUCATION",
            "ENTERTAINMENT",
            "FASTFOOD",
            "FEESNCHARGES",
            "GIFTS",
            "GROCERY",
            "HOTELS",
            "INSURANCE",
            "INVESTMENTS",
            "LOANPAY",
            "MISCELLANEOUS",
            "FINEDINNING",
            "RETAILSHOPPING",
            "SUBSCRIPTION",
            "TRAVEL",
            "UTILITIES"
        ]

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.map(function (d) {
                    return { DATE: d.DATE, value: +d[grpName] };
                })
            };
        });


        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeCategory10);

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.DATE; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b-%y')));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // create a tooltip
        var Tooltip = d3.select("#my_dataviz8")
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
                .html("Frequency: " + (d.value).toFixed(2) + '<br>'+ (d.DATE))
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1] + 1550) + "px")
        }
        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
        }


        // Add the lines
        var line = d3.line()
            .x(function (d) { return x(+d.DATE) })
            .y(function (d) { return y(+d.value) })
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("d", function (d) { return line(d.values) })
            .attr("stroke", function (d) { return myColor(d.name) })
            .style("stroke-width", 4)
            .style("fill", "none")


        // Add the points
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", function (d) { return myColor(d.name) })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function (d) { return d.values })
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.DATE) })
            .attr("cy", function (d) { return y(d.value) })
            .attr("r", 5)
            .attr("stroke", "white")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        // Add a legend at the end of each line
        svg
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
            .attr("transform", function (d) { return "translate(" + x(d.value.DATE) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return myColor(d.name) })
            .style("font-size", 15)



    } //"end"


    update(data)

}