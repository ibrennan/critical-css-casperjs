// Script set up, helpers and libs
var fs = require('fs'),
	system = require('system'),	
	casper = require('casper').create({
		logLevel: "error"
	});

// Get the party started
var application = {

	global : {
		inputSource : "", // Defined by user prompt
		outputFile : "", // Defined by user prompt
		result : "", // Generated when page is processed
		browserSize : [] // Defined by user prompt
	},

	init : function(){
		var self = this;

		self.setGlobal();

	}, // init

	setGlobal : function(){
		var self = this;

		// Set the input URL
		system.stdout.writeLine("Which URL would you like to parse?");
		self.global.inputSource = system.stdin.readLine().replace("\n","");

		// Set the output file
		system.stdout.writeLine("Which file would you like to output the result to? (leave blank for critical-css.txt)");
		self.global.outputFile = system.stdin.readLine().replace("\n","");

		// If the output is blank, use the default one
		if(self.global.outputFile == ""){

			self.global.outputFile = "critical-css.txt";

		};

		// Set the browser dimensions
		system.stdout.writeLine("What size would you like the browser to be? (Expected input is widthxheight) (leave blank for 1024x768)");
		self.global.browserSize = system.stdin.readLine().replace("\n","");

		// If the output is blank, use the default one
		if(self.global.browserSize == ""){

			self.global.browserSize = "1024x768";

		};

		self.global.browserSize = self.global.browserSize.split("x");

		self.parseCSS();

	}, // setGlobal

	parseCSS : function(){

		casper.start();

		casper.then(function() {

			if(application.global.inputSource == ""){
				this.die("No URL defined, try again.", 1);
			};

			// Set the viewport
			casper.viewport(parseFloat(application.global.browserSize[0]), parseFloat(application.global.browserSize[1]));

			this.echo("Processing: " + application.global.inputSource, "INFO");
			this.echo("Rendering page at: " + application.global.browserSize[0] + " x " + application.global.browserSize[1], "INFO");

			this.thenOpen(application.global.inputSource, function(){

				application.global.result = this.evaluate(function(){
					
					var CSSCriticalPath = function(w, d, opts) {
						var opt = opts || {};
						var css = {};
						var pushCSS = function(r) {
							if(!!css[r.selectorText] === false) css[r.selectorText] = {};
							var styles = r.style.cssText.split(/;(?![A-Za-z0-9])/);
							for(var i = 0; i < styles.length; i++) {
								if(!!styles[i] === false) continue;
								// Note - altered ': ' to be ':' from the original source.
								// PhantomJS doesn't return the space after the ':'
								// Also altered the split to be only the first ':', as
								// things like 'background:url(http://' would split in
								// 3 parts. And aint nobody got time for that.
								var pair = styles[i].split(/:(.+)?/);

								// Have added this if statement in order for it to work
								// within CasperJS.
								// Not sure why, but sometimes pair[1] is undefined.
								if(typeof(pair[1]) != "undefined"){
									pair[0] = pair[0].trim();
									pair[1] = pair[1].trim();
									css[r.selectorText][pair[0]] = pair[1];
								}
							}
						};

						var parseTree = function() { 
							var height = w.innerHeight;
							var walker = d.createTreeWalker(d, NodeFilter.SHOW_ELEMENT, function(node) { return NodeFilter.FILTER_ACCEPT; }, true);

							while(walker.nextNode()) {
								var node = walker.currentNode;
								var rect = node.getBoundingClientRect();
								if(rect.top < height || opt.scanFullPage) {
									var rules = w.getMatchedCSSRules(node);
									if(!!rules) {
										for(var r = 0; r < rules.length; r++) {
											pushCSS(rules[r]); 
										}
									}
								} 
							}
						};

						this.generateCSS = function() {
							var finalCSS = "";
							for(var k in css) {
								finalCSS += k + " { ";
								for(var j in css[k]) {
									finalCSS += j + ": " + css[k][j] + "; ";
								}
								finalCSS += "}\n";
							}

							return finalCSS;
						};

						parseTree();
					};


					var cp = new CSSCriticalPath(window, document);
					var css = cp.generateCSS();

					return css;

				});

				this.echo("CSS complete, " + application.global.result.length + " characters long", "INFO");

			});

		});

		casper.then(function(){
	
			fs.write(application.global.outputFile, application.global.result, 'w');

			this.echo("Results file complete: " + application.global.outputFile, "INFO");

		});

		casper.on("page.error", function(msg, trace) {
			this.echo("Error:    " + msg, "ERROR");
			this.echo("file:     " + trace[0].file, "WARNING");
			this.echo("line:     " + trace[0].line, "WARNING");
			this.echo("function: " + trace[0]["function"], "WARNING");
		});

		casper.run();

	} // parseCSS

} // application

application.init();

/*
	Source: https://gist.github.com/PaulKinlan/6284142
*/
var criticalcss = function(){

};