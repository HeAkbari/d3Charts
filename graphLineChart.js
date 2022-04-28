
async function drawChart() {

    const timParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = (d) => timParser(d.date);

    const yAccessor = (d) => d.temperatureMax;

    const dataset = await d3.json('./my_weather_data.json');
    console.log(dataset[0])

    //#region create dimention
    let dimentions = {
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.9,
        margin: {
            left: 40,
            right: 20,
            top: 20,
            bottom: 40
        }
    };
    //#endregion

    //#region create bounded dimention
    dimentions.boundedWidth = dimentions.width -
        dimentions.margin.left -
        dimentions.margin.right;

    dimentions.boundedHeight = dimentions.height -
        dimentions.margin.top -
        dimentions.margin.bottom;
    //#endregion

    //#region create svg
    const svg = d3.select("#svgCantainer")
        .append("svg")
        .attr("width", dimentions.width)
        .attr("height", dimentions.height)
    //#endregion

    //#region create chart boundrary
    const bounds = svg.append("g")
        .style("transform", `translate(
    ${dimentions.margin.left}px,
    ${dimentions.margin.top}px)`)
    //#endregion

    xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimentions.boundedWidth])
        .nice()

    yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimentions.boundedHeight, 0])
        .nice()

    console.log(xScale(xAccessor(dataset[20])))
    let lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))
    let path = bounds.append("path")
        .datum(dataset)
        .attr("d", lineGenerator)
        .attr("class", "graph-axis")
         .attr("fill", "none")
         .attr("stroke", "skyblue")
         .attr("stroke-width", "1px")

    //#region create xAxis
    let gX = bounds.append("g")
        .attr("class", "graph-axis")
        .style("transform", `translateY(${dimentions.boundedHeight}px)`)
    let xAxis = d3.axisBottom(xScale)
        .ticks(5);
    gX.call(xAxis)
    //#endregion

    //#region create yAxis
    let gy = bounds.append("g")
        .attr("class", "graph-axis")

    let yAxis = d3.axisLeft(yScale)
        .ticks(5)
    gy.call(yAxis)
    //#region 


    let defs = svg.append("defs")
    const grad = defs
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%')
        .attr("gradientTransform", "rotate(-45)")

    const colors = [['rgb(90,130,180)', '1'], ['rgb(70,130,180)', '0.4'], ['rgb(70,130,180)', '0']]

    grad.selectAll("stop")
        .data(colors)
        .enter()
        .append("stop")
        .style("stop-color", d => d[0])
        .style("stop-opacity", d => d[1])
        .attr("offset", (d, i) => 100 * (i / (colors.length - 1)) + '%');

    var area = d3.area()
        .x((d) => xScale(xAccessor(d)))
        .y0(dimentions.boundedHeight)
        .y1((d) => yScale(yAccessor(d)));

    bounds.append("path")
        .attr("class", "area")
        .attr("d", area(dataset))
        .attr("fill", "url(#grad)")


}
drawChart();