'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function BarChartD3(): React.ReactElement {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alphabet = [
      { letter: 'A', frequency: 0.08167 },
      { letter: 'B', frequency: 0.01492 },
      { letter: 'C', frequency: 0.02782 },
    ]

    const barHeight = 25
    const marginTop = 30
    const marginRight = 0
    const marginBottom = 10
    const marginLeft = 30
    const width = 928
    const height =
      Math.ceil((alphabet.length + 0.1) * barHeight) + marginTop + marginBottom

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(alphabet, (d) => d.frequency)!])
      .range([marginLeft, width - marginRight])

    const y = d3
      .scaleBand()
      .domain(d3.sort(alphabet, (d) => -d.frequency).map((d) => d.letter))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1)

    const format = x.tickFormat(20, '%')

    // clear dom with previous injected svgs
    d3.select(chartRef.current).select('svg').remove()

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;')

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(alphabet)
      .join('rect')
      .attr('x', x(0))
      .attr('y', (d) => y(d.letter)!)
      .attr('width', (d) => x(d.frequency) - x(0))
      .attr('height', y.bandwidth())

    svg
      .append('g')
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .selectAll('text')
      .data(alphabet)
      .join('text')
      .attr('x', (d) => x(d.frequency))
      .attr('y', (d) => y(d.letter)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('dx', -4)
      .text((d) => format(d.frequency))
      .call((text) =>
        text
          .filter((d) => x(d.frequency) - x(0) < 20)
          .attr('dx', 4)
          .attr('fill', 'black')
          .attr('text-anchor', 'start')
      )

    svg
      .append('g')
      .attr('transform', `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 80, '%'))
      .call((g) => g.select('.domain').remove())

    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
  }, [])

  return <div ref={chartRef}></div>
}
