(function($, window, undefined){

	var DOM = {
		$win: $(window),
		$body: $("body"),
		$pageWidgets: $("#page-widgets"),
		$ourWork: $("#our-work"),
		$ourWorkCurrVideo: null,
		$heroVideo: null,
		$socialWidget: $("#social-widgets"),
		$elemToWatch: null,
		$portfolio: $("#portfolio-box"),
		$menu: $("#dropdown-menu"),
		scrollTimeout: null,
		$scrollTopBtn: null,
		DeviceIs: "desktop",
		mobileSettings: {
			addClass: "mobile",
			removeClass: "desktop",
			startEvent: "initmobile",
			stopEvent: "initdesktop",
			DeviceIs: "mobile",
			callbacks: ["stopPortfolioAnim"]
		},
		desktopSettings: {
			addClass: "desktop",
			removeClass: "mobile",
			startEvent: "initdesktop",
			stopEvent: "initmobile",
			DeviceIs: "desktop",
			callbacks: []
		},
		$enquiryForm: $("#enquiryForm"),
		RegExpr: {
			name: new RegExp(/^[\w\s*]{3,25}$/),
			email: new RegExp(/^\S+@\S+\.\S+/),
			subject: new RegExp(/^[\w\s0-9_\.]{3,150}$/),
			message: new RegExp(/.+/)
		},
		templates: {
			"heroBanner": '<video id="hero-video" autoplay loop autobuffer muted playsinline width="100%" height="100%"><source src="videos/hero-video.mov" type="video/mp4" /><source src="videos/hero-video.webm" type="video/webm" /><source src="videos/hero-video.ogv" type="video/ogg" /><object type="application/x-shockwave-flash" data="videos/video-player.swf" width="100%" height="100%"><param name="movie" value="videos/video-player.swf" /><param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /><param name="flashVars" value="config={\'playlist\':[\'img%2Fhero-banner.jpg\',{\'url\':\'videos%2Fhero-video.mov\',\'autoPlay\':true}]}" /><img alt="Zero Zero Landing Video" src="img/hero-banner.jpg" width="100%" height="100%" title="No video playback capabilities." /></object></video>',
			"WorkingModel": '<video id="work-model-video" autoplay loop autobuffer muted playsinline width="100%" height="100%"><source src="videos/work-model-video.mov" type="video/mp4" /><source src="videos/work-model-video.webm" type="video/webm" /><source src="videos/work-model-video.ogv" type="video/ogg" /><object type="application/x-shockwave-flash" data="videos/video-player.swf" width="100%" height="100%"><param name="movie" value="videos/video-player.swf" /><param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /><param name="flashVars" value="config={\'playlist\':[\'img%2Fworking-model.jpg\',{\'url\':\'videos%2Fwork-model-video.mov\',\'autoPlay\':true}]}" /><img alt="Working Model Video" src="img/working-model.jpg" width="100%" height="100%" title="No video playback capabilities." /></object></video>',
			"HelpedBrands": '<video id="helped-brands-video" autoplay loop autobuffer muted playsinline width="100%" height="100%"><source src="videos/helped-brands-video.mov" type="video/mp4" /><source src="videos/helped-brands-video.webm" type="video/webm" /><source src="videos/helped-brands-video.ogv" type="video/ogg" /><object type="application/x-shockwave-flash" data="videos/video-player.swf" width="100%" height="100%"><param name="movie" value="videos/video-player.swf" /><param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /><param name="flashVars" value="config={\'playlist\':[\'img%2Fhelped-brands.jpg\',{\'url\':\'videos%2Fhelped-brands-video.mov\',\'autoPlay\':true}]}" /><img alt="Helped Brands Video" src="img/helped-brands.jpg" width="100%" height="100%" title="No video playback capabilities." /></object></video>'
		}
	};

	var SiteRenewal = {
		// April 19th is the date to renew.
		expiryDate: new Date(2024, 3, 19),
		isRenewalRequired: function() {
			if( SiteRenewal.expiryDate < new Date() ){
				return true;
			} else {
				return false;
			}
		}
	};

	var Site = {

		// Window Resize Event
		resizeHandler: function(event){
			if( DOM.resizeTimeout !== null ){
				// console.log("Resize Cleared!");
				clearTimeout(DOM.resizeTimeout);
			}

			DOM.resizeTimeout = setTimeout(function(){
				console.log("Resized!");
				Site.onWinResize();
			}, 300);
		},

		onWinResize: function(){
			DOM.winWidth = DOM.$win.outerWidth();

			var layout = (DOM.winWidth > 992) ? "desktopSettings" : "mobileSettings";

			Site.switchLayout(layout);
		},

		switchLayout: function(layout){
			var settings = DOM[layout];
			DOM.$body.removeClass(settings.removeClass).addClass(settings.addClass);

			DOM.$body.off(settings.startEvent).on(settings.startEvent, function(){
				console.log(settings.startEvent);

				DOM.$body.off(settings.stopEvent);
				DOM.DeviceIs = settings.DeviceIs;
				Site.customizeBehavior(settings.callbacks);
			});

			DOM.$body.trigger(settings.startEvent);
		},

		// handle customized callbacks for desktop/handheld devices
		customizeBehavior: function(callbacks){
			// execute all callbacks passed in "callbacks" array
			callbacks.forEach(function(callback, n, arr){
				Site[callback]();
			});
		},

		// SmoothScroll
		initSmoothScroll: function(event, isOurWorkVideo){
			event.preventDefault();
			// if event is passed artificially from ourWork on Video Click.
			var target = (isOurWorkVideo) ? $(event.currentTarget) : $(event.currentTarget).attr("href");
			var pos = $(target).offset().top;
			var targetPos = (isOurWorkVideo) ? pos - 50 : pos;
			
			$("html, body").animate({
				scrollTop: targetPos
			}, 1000);
		},

		// OnScroll Listener
		onScrollHandler: function(event){
			if( DOM.scrollTimeout !== null ){
				console.log("ScrollTimeout Cleared!");
				clearTimeout(DOM.scrollTimeout);
			}

			DOM.scrollTimeout = setTimeout(function(){
				Site.onScrollTopPos();
			}, 300);
		},

		onScrollTopPos: function(){
			// DOM.$elemToWatch = (DOM.DeviceIs === "mobile") ? DOM.$pageWidgets.find("#features-box") : DOM.$socialWidget.find("#twitter-widget-0");
			DOM.$elemToWatch = DOM.$pageWidgets.find("#why-box");

			// If window.scrollTop is greater than the Twitter widget's (offset + height + 50 - screenHeight) 
			var winScrollPos = DOM.$win.scrollTop(),
				elementPos = ((DOM.$elemToWatch.offset().top + DOM.$elemToWatch.height()) - DOM.$win.height());
			
			( winScrollPos > elementPos ) ? Site.toggleScrollTopBtn(1) : Site.toggleScrollTopBtn(0);
		},

		toggleScrollTopBtn: function(visibility){
			DOM.$scrollTopBtn = (DOM.$scrollTopBtn) ? DOM.$scrollTopBtn : DOM.$socialWidget.find("#scroll-top-btn");
			DOM.$scrollTopBtn.animate({
				opacity: visibility
			}, 300, function(){
				if(visibility) {
					DOM.$scrollTopBtn.css({display: "inline"});
					DOM.$scrollTopBtn.on("click", function(evt){
						evt.preventDefault();
						Site.initSmoothScroll(evt);
					});
					// Reset the height of the RightPanel Whnever "ScrollTopBtn" is visible.
					// Site.setRightPanelHeight();
				} else {
					DOM.$scrollTopBtn.css({display: "none"});
					DOM.$scrollTopBtn.off("click");
				}
			});

		},

		// Once the HeroVideo is playing, start loading rest of the video on page.
		HeroVideoListener: function(){
			DOM.$heroVideo = (DOM.$heroVideo)? DOM.$heroVideo : $("#hero-video");
			DOM.$heroVideo.on("canplaythrough", function(evt){
				Site.loadMoreVideos();
				// this event will keep firing on the first time video load or restart of the video.
				// hence need to stop listening on the listener once fired.
				$(this).off("canplaythrough");
			});
		},

		// load more videos
		loadMoreVideos: function(){
			Site.loadVideo(DOM.templates.WorkingModel, "#work-model");
			Site.loadVideo(DOM.templates.HelpedBrands, "#helped-brands");
		},

		// on load Video
		loadVideo: function(tmpl, wrapperElem){
			var $wrapper = $(wrapperElem);
			$wrapper.find(".video-box").html(tmpl);
			$wrapper.find("video").on("canplaythrough", function(evt){
				var $this = $(this);
				
				setTimeout(function(){
					$wrapper.find(".alternate").hide();
					$this.parents(".video-box").removeClass("inactive");
				}, 1);

				// this event will keep firing on the first time video load or restart of the video.
				// hence need to stop listening on the listener once fired.
				$(this).off("canplaythrough");
			});
		},

		// switchOff portfolio animations for mobile devices
		stopPortfolioAnim: function(){
			console.log("portfoio animations stopped!");
			DOM.$portfolio.off("mouseenter").off("mouseleave");
		},

		// portfolio animations
		initPortfolioAnim: function(){

			DOM.$portfolio.on("mouseenter", ".row", function(){
				var $this = $(this);
				$this.addClass("hover");
				var $bio = $this.find(".inner .bio");
				$bio.animate({
					"top": "100%",
					"opacity": 1
				}, {
					duration: 500,
					queue: false
				});
			}).on("mouseleave", ".row", function(){
				var $this = $(this);
				$this.removeClass("hover");
				var $bio = $this.find(".inner .bio");
				$bio.animate({
					"top": "-50%",
					"opacity": 0
				}, {
					duration: 300,
					queue: false
				});
			});
		},

		bindOurWorkVideoClick: function(){
			DOM.$ourWork.on("click", '.item-video', Site.onOurWorkVideoClick);
		},

		/*unbindOurWorkVideoClick: function(){
			DOM.$ourWork.off("click");
		},*/

		onOurWorkVideoClick: function(evt){
			if(DOM.$ourWorkCurrVideo){
				DOM.$ourWorkCurrVideo.find('.video-close').trigger("click", true);
			}
			var $this = $(this);
			DOM.$ourWorkCurrVideo = $this;
			var videoID = $this.data("video");
			var iframe = "<span class=\"iframe-wrap\"><iframe width=\"100%\" height=\"100%\" src=\"//www.youtube.com/embed/" + videoID + "?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe><span class=\"video-close\"></span></span>"

			$this.animate({
				"width": "100%",
				"height": "350px"
			}, 700, function(){
				$this.append(iframe);
				$this.find('.video-wrap').fadeOut(300);
				$this.off("click").on("click", '.video-close', Site.onOurWorkVideoCloseClick);
				// 2nd boolean param, to artificially trigger the event.
				Site.initSmoothScroll(evt, true);
			});
		},

		onOurWorkVideoCloseClick: function(evt, isTriggered){
			if(!isTriggered){
				evt.stopPropagation();
			}
			
			var $videoEl = $(this).parents(".item-video");
			// var $videoEl = DOM.$ourWorkCurrVideo;
			$videoEl.find('.video-wrap').show(300);
			$videoEl.find('.iframe-wrap').fadeOut(300).remove();
			$videoEl.attr("style", "");
			DOM.$ourWorkCurrVideo = null;
		},

		/*setRightPanelHeight: function(){
			// Social Widgets Height
			var h = (DOM.DeviceIs === "mobile") ? "auto" : DOM.$pageWidgets.outerHeight();
			DOM.$socialWidget.height( h );
		},*/

		validateInputField: function(inputElement, inputText, inputRegExp){
			// var $enquiryForm = $("#enquiryForm");

			if( inputText === "" || !inputRegExp.test(inputText) ){
				inputElement.next().show();
				DOM.$enquiryForm.addClass("invalid");
			} else {
				inputElement.next().hide();
				DOM.$enquiryForm.removeClass("invalid");
			}
		},

		initEquiryFormValidation: function(){

			$("#enquiryForm").on("blur", "input, textarea", function(e){

				var $elem = $(this),
					elemRegEx = DOM.RegExpr[$elem.attr("name")],
					elemVal = $elem.val();

				Site.validateInputField( $elem, elemVal, elemRegEx );

			});

			$(document).on("submit", "#enquiryForm", function(e){
				e.preventDefault();

				var $this = $(this),
					$nameInput = $this.find("#name"),
					$emailInput = $this.find("#email"),
					$subjectInput = $this.find("#subject"),
					$messageInput = $this.find("#message");

				Site.validateInputField( $nameInput, $nameInput.val(), DOM.RegExpr["name"] );
				Site.validateInputField( $emailInput, $emailInput.val(), DOM.RegExpr["email"] );
				Site.validateInputField( $subjectInput, $subjectInput.val(), DOM.RegExpr["subject"] );
				Site.validateInputField( $messageInput, $messageInput.val(), DOM.RegExpr["message"] );

				if( $this.hasClass("invalid") ){
					return;
				} else {
					var enquiryFormData = $this.serialize();
					console.log(enquiryFormData);

					$.post("js/send_mail.php", { data: enquiryFormData }, "text").done(function(response){
						alert(response);
						// Empty all the fields once form submitted to server successfully.
						$nameInput.val("");
						$emailInput.val("");
						$subjectInput.val("");
						$messageInput.val("");
					}).fail(function(response){
						alert(response);
					});

				}
			});
		},

		onShowWorkClick: function(evt){
			var page = $(evt.currentTarget).data('target-page');
			window.location.pathname = page + '.html'
		},

		initEventListener: function(){
			// trigger on doc.ready
			Site.resizeHandler();

			// redirects to zespri & bloomberg promo pages.
			DOM.$ourWork.on("click", '.show-work', Site.onShowWorkClick);

			DOM.$win.on("resize", Site.resizeHandler);

			Site.HeroVideoListener();

			// Site.initPortfolioAnim();

			DOM.$menu.on("click", "a", Site.initSmoothScroll);

			Site.initEquiryFormValidation();

			DOM.$win.on("load", function(evt){
				// To make sure on PageReload/Refresh ScrollTopBtn visibility handled.
				Site.onScrollTopPos();

				// On Scroll should work on twitter is ready.
				DOM.$win.on("scroll", Site.onScrollHandler);
			});

			Site.bindOurWorkVideoClick();
		},

		init: function(){
			Site.initEventListener();
		}
	};

	$(function(){

		if( SiteRenewal.isRenewalRequired() ){
			var warning = "<strong>Hosting renewal is required!</strong>\nPlease contact your host provider for re-activation!",
				warningHTML = "<div class=\"col-md-12\"><div class=\"alert alert-danger\" role=\"alert\">" + warning + "</div></div>";

			// DOM.$body.addClass("site-renewal").html(warningHTML);
			console.warn(warning);
			Site.init();
		} else {
			Site.init();
		}

	});

})(jQuery, window);