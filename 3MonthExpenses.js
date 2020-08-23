async function init6() {

    const data = await d3.csv("https://raw.githubusercontent.com/venky2k11/bank_d3/master/data/bubblechart.csv", function (d) {
        return { CATEGORY: d.CATEGORY, CLUSTER: d.CLUSTER, KEY: d.KEY, VALUE: d.VALUE }
    });

    // DATE: d3.timeParse("%Y-%m-%d")(d.DATE), 
    function update(data) {

        // Color palette
        var color = d3.scaleOrdinal()
            .domain(["Loan Pay", "Utilities", "Grocery & supermarkets", "Education", "Cash Out", "Bottleshops", "Travel", "Subscription",
                "Retail Shopping", "Restaurants & dining", "Miscellaneous", "Insurance", "Gifts & donations", "Fees & charges",
                "Fast food restaurants", "Entertainment", "Chemists", "Auto & transport"])
            .range(d3.schemeSet1);

        // // A color scale
        // var color = d3.scaleOrdinal()
        //     .domain([1, 2, 3])
        //     .range(["#F8766D", "#00BA38", "#619CFF"])

        // Size scale for countries
        var size = d3.scaleLinear()
            .domain([0, 20000])
            .range([10, 200])  // circle will be between 7 and 55 px wide

        // set the dimensions and margins of the graph
        var width = 800
        var height = 600

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz6")
            .append("svg")
            .attr("width", width)
            .attr("height", height)


        // create a tooltip
        var Tooltip = d3.select("#my_dataviz6")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "10px")
            .style("padding", "5px")


        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            Tooltip
                .html('<u>' + d.CATEGORY + '</u>' + "<br>" + " $"+ d.VALUE )
                .style("left", (d3.mouse(this)[0] + 20) + "px")
                .style("top", (d3.mouse(this)[1] + 2000) + "px")
        }
        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
        }



        // Initialize the circle: all located at the center of the svg area
        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return size(d.VALUE) })
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function (d) { return color(d.CATEGORY) })
            // .style("fill", function(d){ return color(d.CLUSTER)})
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.VALUE) + 3) }).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            });

        // What happens when a circle is dragged?
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

    }


    update(data)

}