import { Component, OnInit } from '@angular/core';
import { Nodes, Links } from '../../data/data';
import * as d3 from 'd3-selection';
import {
  forceLink,
  forceSimulation,
  forceManyBody,
  forceCenter
} from 'd3-force';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-force-directed-graph',
  templateUrl: './force-directed-graph.component.html',
  styleUrls: ['./force-directed-graph.component.css']
})
export class ForceDirectedGraphComponent implements OnInit {
  currentRate = 8;
  title = 'D3 Barchart with Angular 10';
  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  x: any;
  y: any;
  svg: any;
  simulation: any;
  nodeElements: any;
  textElements: any;
  linkElements: any;
  g: any;

  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
  }

  initSvg() {
    this.svg = d3.select('#forceDirectedGraph')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const linkForce = forceLink()
      .id(function (link) { return link.id })
      .strength(function (link) { return link.strength });
    this.simulation = forceSimulation()
      .force('link', linkForce)
      .force('charge', forceManyBody().strength(-20))
      .force('center', forceCenter(this.width / 2, this.height / 2));
    this.nodeElements = this.svg.append('g')
      .selectAll('circle')
      .data(Nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', this.getNodeColor);
    this.textElements = this.svg.append('g')
      .selectAll('text')
      .data(Nodes)
      .enter().append('text')
      .text(node => node.label)
      .attr('font-size', 15)
      .attr('color', 'white')
      .attr('dx', 15)
      .attr('dy', 4);
    this.linkElements = this.svg.append('g')
      .selectAll('line')
      .data(Links)
      .enter().append('line')
        .attr('stroke-width', 10)
          .attr('stroke', 'rgba(50, 50, 50, 0.2)');
    this.simulation.nodes(Nodes).on('tick', () => {
      this.nodeElements
        .attr('cx', node => node.x)
        .attr('cy', node => node.y);
      this.textElements
        .attr('x', node => node.x)
        .attr('y', node => node.y);
      this.linkElements
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) { return link.target.y });
    });
    this.simulation.force('link').links(Links);
  }

  getNodeColor(node) {
    return node.level === 1 ? 'red' : 'gray';
  }

}
