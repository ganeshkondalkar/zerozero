module.exports = function(grunt){
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		BASE_FOLDER: "www",
		DIST_ENVIRONMENT: "build-2",

		BANNER_TEXT: 'Project: <%= pkg.name %>. Created by: <%= pkg.author %>. Version: <%= pkg.version %>.\n' + 
            'This project is valid for the duration: <%= pkg.projectDetails.startDate %> - <%= pkg.projectDetails.endDate %>.',

		clean: {
			dev: ["<%= BASE_FOLDER%>/js/*.js"],
			dist: ["<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>"]
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= BANNER_TEXT %> */\n',
				sourceMap: true,
				separator: ";"
			},
            devVendors: {
                src: ["<%= BASE_FOLDER %>/js/lib/jquery/*.js",
                "<%= BASE_FOLDER %>/js/lib/bootstrap/*.js",
                "<%= BASE_FOLDER %>/js/lib/owl-carousel/*.js"],
                dest: "<%= BASE_FOLDER %>/js/vendor.js"
            },
            devModules: {
                src: ["<%= BASE_FOLDER %>/js/modules/module.js"],
                dest: "<%= BASE_FOLDER %>/js/main.js"
            },
            productDetailsModules: {
                src: ["<%= BASE_FOLDER %>/js/modules/products-module.js"],
                dest: "<%= BASE_FOLDER %>/js/product-details.js"
            }
		},

		compass: {
            dev: {
                options: {
                    sassDir: '<%= BASE_FOLDER %>/sass',
                    cssDir: '<%= BASE_FOLDER %>/css',
                    outputStyle: 'expanded',
                    noLineComments: true
                }
            },
            dist: {
                options: {
                    sassDir: '<%= BASE_FOLDER %>/sass',
                    cssDir: '<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/css',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },

        htmlmin: {
        	dist: {
        		options: {
        			removeComments: true,
        			collapseWhitespace: true
        		},
        		files: {
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/index.html" : "<%= BASE_FOLDER%>/index.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/zespri.html" : "<%= BASE_FOLDER%>/zespri.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/scit.html" : "<%= BASE_FOLDER%>/scit.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/scatter.html" : "<%= BASE_FOLDER%>/scatter.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/bloomberg.html" : "<%= BASE_FOLDER%>/bloomberg.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/bq-prime.html" : "<%= BASE_FOLDER%>/bq-prime.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/healthassure.html" : "<%= BASE_FOLDER%>/healthassure.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/bq-blue.html" : "<%= BASE_FOLDER%>/bq-blue.html"
        		}
        	}
        },

        uglify: {
        	options:{
        		// banner: "/*! <%= BANNER_TEXT %> */",
        		compress: {
                    drop_console: true
                },
        		sourceMap: true,
                preserveComments: false
        	},
        	dist: {
        		files: {
                    "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/main.js" : [
        				"<%= BASE_FOLDER %>/js/main.js"
        			],
                    "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/product-details.js" : [
                        "<%= BASE_FOLDER %>/js/product-details.js"
                    ],
        			"<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/vendor.js" : [
        				"<%= BASE_FOLDER %>/js/vendor.js"
        			]
        		}
        	}
        },

        copy: {
            imagesNFonts: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "img/**",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "fonts/**",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "videos/**",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    }/*,
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "js/*.js",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    }*/
                ]
            }
        },
        
        watch: {
	        	options: {
                    debounceDelay: 500,
	        		livereload: true
	        	},
	        	html: {
                    // DO NOT watch files inside BUILD folder
	        		files: ['<%= BASE_FOLDER %>/**/*.html', '!<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT%>/*.html'],
                    tasks: ["htmlmin:dist"]
	        	},
	        	css: {
	        		files: ['<%= BASE_FOLDER %>/sass/**'],
	        		tasks: ["compass:dev"]
	        	},
                main: {
                    files: ['<%= BASE_FOLDER %>/js/modules/module.js'],
                    tasks: ["concat:devVendors", "concat:devModules"]
                },
                products: {
                    files: ['<%= BASE_FOLDER %>/js/modules/products-module.js'],
                    tasks: ["concat:productDetailsModules"]
                }
        },
        connect: {
        	dev: {
        		options: {
        			hostname: "localhost",
        			port: 1987,
        			base: "<%= BASE_FOLDER %>",
        			middleware: function(connect,options){
        				// console.log(options);
        				return [
        					require('connect-livereload')(),
        					connect.static(options.base[0], options),
        					connect.directory(options.base[0])
        				];
        			}
        		}
        	},
        	dist: {
        		options: {
        			hostname: "localhost",
        			port: 1986,
        			base: ["<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT%>", "<%= BASE_FOLDER %>/build/css", "<%= BASE_FOLDER %>/build/js"],
        			// directory: "<%= BASE_FOLDER %>/build",
        			middleware: function(connect,options){
        				// console.log(options);
        				return [
        					require('connect-livereload')(),
        					connect.static(options.base[0]),
        					connect.directory(options.base[0])
        				];
        			}
        		}
        	}
        },
        open: {
        	dev: { path: "http://localhost:1987/" },
        	dist: { path: "http://localhost:1986/" }
        }

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');

	// Generate DEVELOPMENT CONTENT
	grunt.registerTask("dev", "Run Build Process Tasks", function(){
		var tasks = [
			"clean:dev",
            "compass:dev",
            "concat",
			"open:dev",
            "connect:dev",
			"watch"
		];

		// always use force when watching
        // grunt.option('force', true);
        grunt.task.run(tasks);
	});

	// Generate PRODUCTION CONTENT
	grunt.registerTask("build", "Run Build Process Tasks", function(){
		var tasks = [
			"clean:dist",
            "htmlmin:dist",
            "compass:dist",
            "uglify:dist",
            "copy:imagesNFonts",
            "open:dist",
            "connect:dist",
			"watch"
		];

		// always use force when watching
        // grunt.option('force', true);
        grunt.task.run(tasks);
	});
};