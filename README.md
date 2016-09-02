# Table of Contents
* [Problem Specification](#markdown-header-problem-specification)
	* [Input](#markdown-header-input)
	* [Output](#markdown-header-output)
* [Explanation & Method](#markdown-header-explanation-method)
* [Setup](#markdown-header-setup)
* [Directory](#markdown-header-directory)
* [Tooling & Framework](#markdown-header-tooling-framework)
* [Testing](#markdown-header-testing)

## Problem Specification
Convert a stats.json file outputted by webpack and visualize in a force directed diagram + detail/connections view

### Input:  
stats.json

### Output:  
Force Directed Graph View  
Detail & Connections View  

## Tasks

Add colors  
Detail View for selected node

## Setup

    npm install
    make dev
    
## Directory
	
	src
       ├── javascript
	dist - compiled ES5 javascript  
	test.  
	    └── fixture.js  
	.babelrc            - babel options  
	mocha.opts          - test framework options  
	wallaby.config.js   - continuous unit testing options  
	package.json        - vendor dependencies  
	node_modules        - vendor files  


## Tooling / Framework

Javascript ES6 with babel transpilation
Mocha
Wallaby
Chai (assertions - expect)

## Testing

	make test

### Production Build
	
	make build

## Inspiration / Credits
   
* Force-Directed Graph with Drag/Zoom/Pan/Center/Resize/Labels/Shapes/Filter/Highlight  
	* https://gist.github.com/eyaler/10586116  

* Stellar Webpack  
	* https://github.com/alexkuz/stellar-webpack/blob/master/src/WebpackGraph.js  
	* A lot of the scaffolding was inspired by this project.  
