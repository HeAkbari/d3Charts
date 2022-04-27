
async function getWeather() {
    const dataset = await d3.json("./my_weather_data.json");
    console.log(dataset[0])
    const dateParser = d3.timeParse("%Y-%m-%d")
    const yAccessor = d => d.temperatureMax
    const xAccessor = d => dateParser(d.date)
    const bisectDate = d3.bisector((d) => dateParser(d.date)).left;
    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60,
        },
    };
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    defs = wrapper.append("defs");

    // clipPath = defs.append("defs").append("clipPath")
    //     .attr("id", "clip")
    //     .append("rect")
    //     .attr("width", dimensions.boundedWidth)
    //     .attr("height", dimensions.boundedHeight)
    //     .attr("x", dimensions.margin.left)
    //     .attr("y", dimensions.margin.top);
    var bounds = wrapper.append("g")
        .style("transform",
            `translate( ${dimensions.margin.left}px,
            ${dimensions.margin.top}px)`)
       // .attr("clip-path", "url(#clip)");

    const grad = defs
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%')
        .attr("gradientTransform", "rotate(-45)")

   var colors = [['rgb(70,130,180)', '1'], ['rgb(70,130,180)', '0.7'], ['rgb(70,130,180)', '0.4'], ['rgb(70,130,180)', '0']];

    grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function (d) { return d[0]; })
        .style('stop-opacity', function (d) { return d[1]; })
        .attr('offset', function (d, i) {
            return 100 * (i / (colors.length - 1)) + '%';
        })
    //#endregion

    var yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, dimensions.margin.top])

    const freezingTemperaturePlacement = yScale(32)


    var xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([10, dimensions.boundedWidth])
    x2 = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([10, dimensions.boundedWidth])

    var lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

    // define the area
    var area = d3.area()
        .x((d) => xScale(xAccessor(d)))
        .y0(dimensions.boundedHeight)
        .y1((d) => yScale(yAccessor(d)));

    var path = bounds.append("path")
        .datum(dataset)
        //  .transition()
        // .ease(d3.easeBounce)
        // .duration(1000)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#088dda")
        .attr("opacity", "0.4")
        .attr("stroke-width", '2px')

    bounds.append("path")
        .attr("class", "area")
        .attr("d", area(dataset))
        .attr("fill", "url(#grad")

    // Transition
    const totalLength = path.node().getTotalLength();
    console.log(totalLength)
    path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength);
    path
        .transition()
        // .ease(d3.easeBounceIn)
        .duration(5000)
        .attr("stroke-dashoffset", 0);

    var yAxis = bounds.append("g")
        .style("transform", `translateX(${dimensions.margin.right-5
            }px)`)
        .call(d3.axisLeft().scale(yScale))



    var gX = bounds.append("g")
        .attr("class", "axis axis--x")
        .style("transform", `translateY(${dimensions.boundedHeight
            }px)`);



    var xAxis = d3.axisBottom(xScale)
    gX.call(xAxis)

    const focuse = wrapper.append("g")
        .style("transform",
            `translate( ${dimensions.margin.left}px,
                ${dimensions.margin.top}px)`)
        .attr("width", dimensions.boundedWidth)
        .attr("height", dimensions.boundedHeight)


    focuse.append("circle")
        .attr("class", "circle")
        .attr("r", 8)
        .attr("stroke", "steelblue")
        .attr("fill", "none");
    focuse.append("line")
        .attr("id", "vertical-line")
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.7)
        .attr("stroke-dasharray", "3,3")
        .attr("y1", -dimensions.height + dimensions.margin.top)
        .attr("y2", dimensions.margin.bottom);

    focuse.append("circle")
        .attr("class", "circle")
        .attr("r", 4)
        //.attr("stroke", "steelblue")
        .attr("fill", "red");

    focuse.append("line")
        .attr("id", "horizontal-line")
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.7)
        .attr("stroke-dasharray", "3,3")
        .attr("x1", 0)
        .attr("x2", dimensions.width + dimensions.margin.left);

    const zoom = d3.zoom()
        .scaleExtent([1, 80])
        .translateExtent([[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]])
        .extent([[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]])
        .on("zoom", (event) => {
            console.log(event)
            var t = event.transform;
            xScale.domain(t.rescaleX(x2).domain());
            console.log(xScale.domain())
            xAxis = d3.axisBottom(xScale)
            console.log(bounds.select(".line"))
            bounds.select(".line").attr("d", lineGenerator);
            bounds.select(".axis--x").call(xAxis);
        });

    const rectGroup = wrapper.append("g")
        .style("transform",
            `translate( ${dimensions.margin.left}px,
            ${dimensions.margin.top}px)`
        );

    const rect = rectGroup.append("rect")
        // .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        // .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight)
        // - freezingTemperaturePlacement
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseout", () => { focuse.style("display", "none"); })
        .on("pointerup", () => { focuse.style("display", "none"); })
        .on("pointerdown", () => focuse.style("display", null))
        // .attr("opacity", "0")
        .on("pointermove", (e) => {
            let x0 = xScale.invert(d3.pointer(e)[0]);
            let i = bisectDate(dataset, x0, 1)

            d0 = dataset[i - 1],
                d1 = dataset[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focuse.selectAll("circle")
                .attr("transform",
                    "translate(" +
                    (xScale(dateParser(d.date))) + "," +
                    (yScale(d.temperatureMax)) + ")");
            focuse.select("#vertical-line")
                .attr("transform",
                    "translate(" + (xScale(dateParser(d.date))) + "," + dimensions.boundedHeight + ")");

            focuse.select("#horizontal-line")
                .attr("transform",
                    "translate(" + 0 + "," + (yScale(d.temperatureMax)) + ")");

        })
        .call(zoom);
}
getWeather();