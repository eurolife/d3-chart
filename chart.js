import * as d3 from "d3";

async function drawLineChart() {
  // write your code here
  const data = await d3.json("./data/my_weather_data.json");
  // console.log(data);

  const yAccessor = (d) => d["temperatureMax"];
  // console.log(yAccessor(data[0]));
  const parseDate = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => parseDate(d["date"]);
  // console.log(xAccessor(data[0]));

  // keep accessor functions at the top

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    // margins to give space for the labels
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margins.left - dimensions.margins.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper.append("g").style(
    "transform",
    `translate(${dimensions.margins.left}px,
      ${dimensions.margins.top}px)`
  );
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor)) // min and max values
    .range([dimensions.boundedHeight, 0]); // from the top, least for larger values
  console.log(yScale(50));
  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3");
  // console.log(d3.extent(data, yAccessor))
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  // draw data
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));
  const line = bounds
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2);

  // draw peripherals
  const yAxisGenerator = d3.axisLeft().scale(yScale);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  console.log(yAxisGenerator);
}

drawLineChart();
