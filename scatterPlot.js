
async function drawScatter() {

    const dataset = await d3.json("./my_weather_data.json");

    const xAccessor = d => d.dewPoint;
    const yAccessor = d => d.humidity;
    const colorAccessor = d => d.cloudCover

    //create chart dimentions
    const width = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ]);
    const dimentions = {
        width: window.innerWidth * 0.9,
        height: width,
        margin: {
            top: 10,
            right: 10,
            bottom: 20,
            left: 30
        }
    }

    dimentions.boundedWidth = dimentions.width - dimentions.margin.left - dimentions.margin.right;
    dimentions.boundedHeight = dimentions.height - dimentions.margin.bottom - dimentions.margin.top;


    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimentions.width)
        .attr("height", dimentions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(
            ${dimentions.margin.left}px,
            ${dimentions.margin.top}px)`
        )

    const xScales = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimentions.boundedWidth])
        .nice()

    const yScales = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimentions.boundedHeight, 0])
        .nice()

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(dataset, colorAccessor))
        .range(["yellow", "green"])



    const dots = bounds.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScales(xAccessor(d)))
        .attr("cy", d => yScales(yAccessor(d)))
        .attr("r", d => xScales(xAccessor(d)) / 50)
        .attr("fill", (d) => colorScale(colorAccessor(d)))
        .on("mousemove",d=>{
            console.log(d,[d.path[0].__data__.dewPoint,d.path[0].__data__.humidity])
        })

    const xAxiseGenerator = d3.axisBottom()
        .scale(xScales)
    const yAxiseGenerator = d3.axisLeft()
    .ticks(4)
        .scale(yScales)

const xAxis=bounds.append("g")
.call(xAxiseGenerator)        
.style("transform",`translateY(${dimentions.boundedHeight}px)`)
    console.log(xScales.range())

    const yAxis=bounds.append("g")
    .call(yAxiseGenerator)
}

drawScatter();

