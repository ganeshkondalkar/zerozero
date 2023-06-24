(function($, win, doc, undefined){
	$(function(){
		var $win = $(win),
			$doc = $(document),
			$mainContent = $('#main-content'),
			$sidebar = $('#sidebar'),
			$scrollTopBtn = $('#scroll-top-btn'),
			$elemToWatch = $("header"),
			scrollTimeout = null,
			$carouselWrapper = $("#carousel-wrapper"),
			$owlCarousel = null,
			resizeTimeout = null,
			layout = "desktop";

		var Site = {
			// Window Resize Event
			resizeHandler: function(event){
				if( resizeTimeout !== null ){
					// console.log("Resize Cleared!");
					clearTimeout(resizeTimeout);
				}

				resizeTimeout = setTimeout(function(){
					console.log("Resized!");
					Site.onWinResize();
				}, 300);
			},

			onWinResize: function(){
				var winWidth = $win.outerWidth();

				layout = (winWidth > 767) ? "desktop" : "mobile";

				Site.switchLayout(layout);

				(winWidth > 991) ? Site.adjustSidebarHeight("desktop") : Site.adjustSidebarHeight("mobile");

				// in case, if the carousel is open and then resize event happens
				// then we need to resize the carousel window too.
				Site.resizeCarousel();
			},

			switchLayout: function(){
				( layout === "mobile") ? Site.onMobileEvents() : Site.onDesktopEvents();
			},

			onMobileEvents: function(){
				Site.adjustSidebarHeight("mobile");
				Site.unBindCarouselEvent();
			},

			onDesktopEvents: function(){
				Site.adjustSidebarHeight("desktop");
				Site.bindCarouselEvent();
			},

			// OnScroll Listener
			onScrollHandler: function(event){
				if( scrollTimeout !== null ){
					console.log("ScrollTimeout Cleared!");
					clearTimeout(scrollTimeout);
				}

				scrollTimeout = setTimeout(function(){
					Site.onScrollTopPos();
				}, 300);
			},

			onScrollTopPos: function(){
				var winScrollPos = $win.scrollTop(),
					elementPos = $win.height();
				
				( winScrollPos > elementPos ) ? Site.toggleScrollTopBtn(1) : Site.toggleScrollTopBtn(0);
			},

			toggleScrollTopBtn: function(visibility){
				$scrollTopBtn.animate({
					opacity: visibility
				}, 300, function(){
					if(visibility) {
						$scrollTopBtn.css({display: "inline"});
						$scrollTopBtn.on("click", function(evt){
							evt.preventDefault();
							Site.initSmoothScroll(evt);
						});
					} else {
						$scrollTopBtn.css({display: "none"});
						$scrollTopBtn.off("click");
					}
				});
			},

			initSmoothScroll: function(event){
				event.preventDefault();

				var targetPos = 0;
				
				$("html, body").animate({
					scrollTop: targetPos
				}, 1000);
			},

			adjustSidebarHeight: function(size){
				// debugger;
				if(size !== "mobile"){
					var h = $mainContent.height();

					$sidebar.css({
						height: h + "px",
						position: "relative"
					});
				} else {
					$sidebar.css({
						height: "auto"
					});
				}
			},

			bindTeaserClick: function(){
				$("#product-teaser").off("click").on("click", ".img-responsive", function(evt){
					Site.showCarousel(evt);
				});
			},

			resizeCarousel: function(){
				var winHeight, innerCarouselHeight, $innerCarouselWrapper, paddingTop;

				if( $carouselWrapper.hasClass("active") ){
					winHeight = $win.height();
					$carouselWrapper.css({"height": winHeight});
					$innerCarouselWrapper = $carouselWrapper.find('.carousel-inner-wrapper');

					innerCarouselHeight = $innerCarouselWrapper.height();
					paddingTop = (winHeight - innerCarouselHeight) / 2;

					$innerCarouselWrapper.css({"margin-top": paddingTop});
				}
			},

			showCarousel: function(evt){
				debugger;
				var index = $(evt.currentTarget).data("index");
				var options = {
					items: 1,
					loop: true,
					nav: true
				};

				Site.initSmoothScroll({preventDefault: function(){}});

				$carouselWrapper.removeClass('hidden');

				if( !$carouselWrapper.hasClass("active") ){

					var winHeight = $win.height();
					$carouselWrapper.css({"height": winHeight});

					$owlCarousel = $carouselWrapper.find('.owl-carousel');
					$owlCarousel.owlCarousel(options);
					var innerCarouselHeight = $carouselWrapper.find('.carousel-inner-wrapper').height();
					var paddingTop = (winHeight - innerCarouselHeight) / 2;

					// if active don't re-initialize carousel.
					$carouselWrapper.addClass('active');
					
					$carouselWrapper.find('.carousel-inner-wrapper').css({"margin-top": paddingTop});

					Site.bindCarouselEvent();

				}

				Site.resizeCarousel();

				// move to a particular index, based on clicked event.
				$owlCarousel.trigger('to.owl.carousel', [index-1, 1200]);

			},

			hideCarousel: function(evt){
				$carouselWrapper.addClass('hidden');
			},

			bindCarouselEvent: function(){

				Site.bindTeaserClick();

				$("#close-carousel-btn").off("click").on("click", function(evt){
					Site.hideCarousel(evt);
				});

				$doc.off("keyup").on("keyup", Site.onEscapeClick);
			},

			unBindCarouselEvent: function(){
				debugger;
				$("#product-teaser").off("click");
				$("#close-carousel-btn").off("click");
				$doc.off("keyup");
			},

			onEscapeClick: function(evt){
				// onEscape
				if(evt.keyCode === 27){
					$carouselWrapper.addClass('hidden');
				}
				// on LeftArrow
				if(evt.keyCode === 37){
					$owlCarousel.trigger('prev.owl.carousel', [700]);
				}
				// on RightArrow
				if(evt.keyCode === 39){
					$owlCarousel.trigger('next.owl.carousel', [700]);
				}
			},

			adjustHeaderHeight: function(){
				var height = $mainContent.find('header').height();
				$sidebar.find('#product-article header').height( height );
			},

			initEventListener: function(){

				Site.resizeHandler();

				Site.adjustHeaderHeight();
				// adjust the sidebar on dom.ready and then bind this to win.load
				// Site.adjustSidebarHeight();

				Site.bindTeaserClick();

				$win.on('load', function(){
					Site.adjustSidebarHeight();
				});

				$win.on("resize", Site.resizeHandler);

				$scrollTopBtn.on("click", function(evt){
					evt.preventDefault();
					Site.initSmoothScroll(evt);
				});

				// On Scroll should work on twitter is ready.
				$win.on("scroll", Site.onScrollHandler);
			},

			init: function(){
				Site.initEventListener();
			}
		};

		$(function(){
			Site.init();
		});

	});
})(jQuery, window, document);