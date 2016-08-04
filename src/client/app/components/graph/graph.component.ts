import { Component,
         Inject,
         ElementRef,
         Input,
         OnChanges,
         ViewEncapsulation } from '@angular/core';
import * as d3               from 'd3';

@Component({
  selector: 'graph',
  templateUrl: 'app/components/graph/graph.html',
  styleUrls: ['app/components/graph/graph.css'],
  providers: [],
  encapsulation: ViewEncapsulation.None
})


export class GraphComponent implements OnChanges {
  @Input() data: any[];
  @Input() config: any;
  svg: any; margin: any; graph: any; changes: any; tooltip: any;

  constructor( @Inject(ElementRef) elementRef: ElementRef) {
    this.graph = d3.select(elementRef.nativeElement);
  }

  // need to wait for changes for data and config values from parent component
  ngOnChanges(changes: any) {
    d3.select('svg').remove();
    this.config = changes.config.currentValue;
    this.data = changes.data.currentValue;
    this.margin = this.config.margin || { top: 10, right: 10, bottom: 10, left: 10 };
    this.config.width = (this.config.width || 960) - this.margin.left - this.margin.right;
    this.config.height = (this.config.height || 500) - this.margin.top - this.margin.bottom;
    this.svg = this.graph
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', this.config.width + this.margin.left + this.margin.right)
      .attr('height', this.config.height + this.margin.top + this.margin.bottom)
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .style('padding-left', '75px');
    if (this.config.type === 'bar') {
      this.renderBarGraph(this.data, this.config, this.svg);
    }
    if (this.config.type === 'line') {
      this.renderLineGraph(this.data, this.config, this.svg);
    }
  }


  renderLineGraph(data: any[], config: any, svg: any) {
    if (!data || !data.length || !config || !svg) return;
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'dtooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
    let height = config.height;
    let width = config.width;

    let parseDate = d3.time.format('%Y-%m-%d').parse;
    let x = d3.time.scale().range([0, width])
      .domain(d3.extent(data, (d: any) => { return d3.time.day(new Date(d[config.key])); }));
    let y = d3.scale.linear().range([height, 0])
      .domain([0, 1.25 * d3.max(data, (d: any) => { return d[config.value]; })]);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(5)
      .tickFormat(d3.time.format('%m/%d/%y'));

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5)
      .tickSize(5);

    let line = d3.svg.line()
      .x((d: any) => { return x(parseDate(d[config.key])); })
      .y((d: any) => { return y(d[config.value]); })
      .interpolate('linear');

    svg.append('svg:g')
      .attr('class', 'x axis line-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('svg:g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append('svg:path')
      .attr('class', 'line')
      .attr('d', line(data))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    let xAxisText = 'Weeks Starting With';

    svg.append('text')
      .attr('x', 0)
      .attr('y', 320)
      .text(xAxisText);

    svg.append('text')
      .attr('x', 0)
      .attr('y', -50)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'end')
      .text(config.yAxisText);

    svg.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', (d: any, i: number) => { return x(parseDate(d[config.key])); })
      .attr('cy', (d: any) => { return y(d[config.value]); })
      .on('mouseover', (d: any, i: number) => {
        let items = document.getElementsByClassName('dot');
        let position = items[i].getBoundingClientRect();
        let html = `${config.tooltipText}: ${d[config.value]}`;

        this.tooltip.html(html);
        this.tooltip.transition().duration(200).style('opacity', .9);
        this.tooltip.style('left', position.left + 'px');
        this.tooltip.style('top', position.top - 50 + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0);
      });
  }

  renderBarGraph(data: any[], config: any, svg: any) {
    if (!data || !data.length || !config || !svg) return;
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'dtooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
    let height = config.height;
    let width = config.width;
    let x = d3.scale.ordinal()
      .domain(data.map((d: any) => { return d[config.key]; }))
      .rangeRoundBands([0, width], .1);

    let y = d3.scale.linear()
      .domain([0, 1.25 * d3.max(data, (d: any) => { return d[config.value]; })])
      .range([height, 0]);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5, 'Page Views')
      .tickSize(5);

    svg.append('svg:g')
      .attr('class', 'x axis bar-axis')
      .attr('transform', `translate(${(x.rangeBand() / 2) + 3}, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('x', (d: any, i: number) => {
        return -20;
      })
      .attr('y', (d: any, i: number) => {
        return x.rangeBand() / 2;
      });

    svg.append('svg:g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append('text')
      .attr('x', 0)
      .attr('y', -50)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'end')
      .text(config.yAxisText);

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => { return x(d[config.key]); })
      .attr('width', (d: any) => { return x.rangeBand(); })
      .attr('y', (d: any) => { return y(d[config.value]); })
      .attr('height', (d: any) => { return height - y(d[config.value]); })
      .on('mouseover', (d: any, i: number) => {
        let items = document.getElementsByClassName('bar');
        let position = items[i].getBoundingClientRect();
        let html = `${config.tooltipText}: ${d[config.value]}`;
        this.tooltip.html(html);
        this.tooltip.transition().duration(200).style('opacity', .9);
        this.tooltip.style('left', position.left + 'px');
        this.tooltip.style('top', position.top - 50 + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0);
      });
  }

}

