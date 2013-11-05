define([
	'jquery',
	'jquery-ui',
	'jquery-migrate',
	'angular-ui-bootstrap3',
	'bootstrap/plugins/tabdrop',

	'./plugins/modernizr/modernizr.min',
	'./plugins/retina/retina',
	
	'css!bootstrap/theme',
	'css!../stylesheets/light-theme',
	'css!../stylesheets/theme-colors',
	'css!../stylesheets/breadcrumbs',
	'css!../stylesheets/plugins/tabdrop/tabdrop'
], function(jQuery) {
	jQuery(document).ready(function () {
		var body, click_event, content, nav/*, nav_toggler*/;
		//nav_toggler = jQuery("header .toggle-nav");
		nav = jQuery("#main-nav");
		content = jQuery("#content");
		body = jQuery("body");
		click_event = (jQuery.support.touch ? "tap" : "click");
		//jQuery("#main-nav .dropdown-collapse").on(click_event, function(e) {
		jQuery(document.body).on(click_event, '#main-nav .dropdown-collapse', function (e) {
			var link, list;
			e.preventDefault();
			link = jQuery(this);
			list = link.parent().find("> ul");
			if (list.is(":visible")) {
				if (!(body.hasClass("main-nav-closed") && link.parents("li").length === 1)) {
					link.removeClass("in");
					list.slideUp(300, function () {
						return jQuery(this).removeClass("in");
					});
				}
			} else {
				if (list.parents("ul.nav.nav-stacked").length === 1) {
					jQuery(document).trigger("nav-open");
				}
				link.addClass("in");
				list.slideDown(300, function () {
					return jQuery(this).addClass("in");
				});
			}
			return false;
		});
		if (jQuery.support.touch) {
			nav.on("swiperight", function (e) {
				return jQuery(document).trigger("nav-open");
			});
			nav.on("swipeleft", function (e) {
				return jQuery(document).trigger("nav-close");
			});
		}
		//nav_toggler.on(click_event, function() {
		jQuery(document).on(click_event, 'header .toggle-nav', function () {
			if (nav_open()) {
				jQuery(document).trigger("nav-close");
			} else {
				jQuery(document).trigger("nav-open");
			}
			return false;
		});
		jQuery(document).bind("nav-close", function (event, params) {
			var nav_open;
			body.removeClass("main-nav-opened").addClass("main-nav-closed");
			return nav_open = false;
		});
		return jQuery(document).bind("nav-open", function (event, params) {
			var nav_open;
			body.addClass("main-nav-opened").removeClass("main-nav-closed");
			return nav_open = true;
		});
	});

	this.nav_open = function () {
		return jQuery("body").hasClass("main-nav-opened") || jQuery("#main-nav").width() > 50;
	};

	this.setMaxLength = function (selector) {
		if (selector == null) {
			selector = jQuery(".char-max-length");
		}
		if (jQuery().maxlength) {
			return selector.maxlength();
		}
	};

	this.setCharCounter = function (selector) {
		if (selector == null) {
			selector = jQuery(".char-counter");
		}
		if (jQuery().charCount) {
			return selector.charCount({
				allowed: selector.data("char-allowed"),
				warning: selector.data("char-warning"),
				cssWarning: "text-warning",
				cssExceeded: "text-error"
			});
		}
	};

	this.setAutoSize = function (selector) {
		if (selector == null) {
			selector = jQuery(".autosize");
		}
		if (jQuery().autosize) {
			return selector.autosize();
		}
	};

	this.setTimeAgo = function (selector) {
		if (selector == null) {
			selector = jQuery(".timeago");
		}
		if (jQuery().timeago) {
			jQuery.timeago.settings.allowFuture = true;
			jQuery.timeago.settings.refreshMillis = 60000;
			selector.timeago();
			return selector.addClass("in");
		}
	};

	this.setScrollable = function (selector) {
		if (selector == null) {
			selector = jQuery(".scrollable");
		}
		if (jQuery().slimScroll) {
			return selector.each(function (i, elem) {
				return jQuery(elem).slimScroll({
					height: jQuery(elem).data("scrollable-height"),
					start: jQuery(elem).data("scrollable-start") || "top"
				});
			});
		}
	};

	this.setSortable = function (selector) {
		if (selector == null) {
			selector = null;
		}
		if (selector) {
			return selector.sortable({
				axis: selector.data("sortable-axis"),
				connectWith: selector.data("sortable-connect")
			});
		}
	};

	this.setSelect2 = function (selector) {
		if (selector == null) {
			selector = jQuery(".select2");
		}
		if (jQuery().select2) {
			return selector.each(function (i, elem) {
				return jQuery(elem).select2();
			});
		}
	};

	this.setDataTable = function (selector) {
		if (jQuery().dataTable) {
			return selector.each(function (i, elem) {
				var dt, sdom;
				if (jQuery(elem).data("pagination-top-bottom") === true) {
					sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'pf>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'p>>";
				} else if (jQuery(elem).data("pagination-top") === true) {
					sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'pf>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'>>";
				} else {
					sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'f>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'p>>";
				}
				dt = jQuery(elem).dataTable({
					sDom: sdom,
					sPaginationType: "bootstrap",
					"iDisplayLength": jQuery(elem).data("pagination-records") || 10,
					oLanguage: {
						sLengthMenu: "_MENU_ records per page"
					}
				});
				if (jQuery(elem).hasClass("data-table-column-filter")) {
					dt.columnFilter();
				}
				dt.closest('.dataTables_wrapper').find('div[idjQuery=_filter] input').css("width", "200px");
				return dt.closest('.dataTables_wrapper').find('input').addClass("form-control input-sm").attr('placeholder', 'Search');
			});
		}
	};

	this.setValidateForm = function (selector) {
		if (selector == null) {
			selector = jQuery(".validate-form");
		}
		if (jQuery().validate) {
			return selector.each(function (i, elem) {
				return jQuery(elem).validate({
					errorElement: "span",
					errorClass: "help-block has-error",
					errorPlacement: function (e, t) {
						return t.parents(".controls").first().append(e);
					},
					highlight: function (e) {
						return jQuery(e).closest('.form-group').removeClass("has-error has-success").addClass('has-error');
					},
					success: function (e) {
						return e.closest(".form-group").removeClass("has-error");
					}
				});
			});
		}
	};

	jQuery(document).ready(function () {
		var touch;
		setTimeAgo();
		setScrollable();
		setSortable(jQuery(".sortable"));
		setSelect2();
		setAutoSize();
		setCharCounter();
		setMaxLength();
		setValidateForm();
		jQuery(".box .box-remove").live("click", function (e) {
			jQuery(this).parents(".box").first().remove();
			e.preventDefault();
			return false;
		});
		jQuery(".box .box-collapse").live("click", function (e) {
			var box;
			box = jQuery(this).parents(".box").first();
			box.toggleClass("box-collapsed");
			e.preventDefault();
			return false;
		});
		if (jQuery().pwstrength) {
			jQuery('.pwstrength').pwstrength({
				showVerdicts: false
			});
		}
		jQuery(".check-all").live("click", function (e) {
			return jQuery(this).parents("table:eq(0)").find(".only-checkbox :checkbox").attr("checked", this.checked);
		});
		if (jQuery().tabdrop) {
			jQuery('.nav-responsive.nav-pills, .nav-responsive.nav-tabs').tabdrop();
		}
		setDataTable(jQuery(".data-table"));
		setDataTable(jQuery(".data-table-column-filter"));
		if (jQuery().wysihtml5) {
			jQuery('.wysihtml5').wysihtml5();
		}
		if (jQuery().nestable) {
			jQuery('.dd-nestable').nestable();
		}
		if (!jQuery("body").hasClass("fixed-header")) {
			if (jQuery().affix) {
				jQuery('#main-nav.main-nav-fixed').affix({
					offset: 40
				});
			}
		}
		touch = false;
		if (window.Modernizr) {
			touch = Modernizr.touch;
		}
		if (!touch) {
			jQuery("body").on("mouseenter", ".has-popover", function () {
				var el;
				el = jQuery(this);
				if (el.data("popover") === undefined) {
					el.popover({
						placement: el.data("placement") || "top",
						container: "body"
					});
				}
				return el.popover("show");
			});
			jQuery("body").on("mouseleave", ".has-popover", function () {
				return jQuery(this).popover("hide");
			});
		}
		touch = false;
		if (window.Modernizr) {
			touch = Modernizr.touch;
		}
		if (!touch) {
			jQuery("body").on("mouseenter", ".has-tooltip", function () {
				var el;
				el = jQuery(this);
				if (el.data("tooltip") === undefined) {
					el.tooltip({
						placement: el.data("placement") || "top",
						container: "body"
					});
				}
				return el.tooltip("show");
			});
			jQuery("body").on("mouseleave", ".has-tooltip", function () {
				return jQuery(this).tooltip("hide");
			});
		}
		if (window.Modernizr && Modernizr.svg === false) {
			jQuery("img[src*=\"svg\"]").attr("src", function () {
				return jQuery(this).attr("src").replace(".svg", ".png");
			});
		}
		if (jQuery().colorpicker) {
			jQuery(".colorpicker-hex").colorpicker({
				format: "hex"
			});
			jQuery(".colorpicker-rgb").colorpicker({
				format: "rgb"
			});
		}
		if (jQuery().datetimepicker) {
			jQuery(".datetimepicker").datetimepicker();
			jQuery(".datepicker").datetimepicker({
				pickTime: false
			});
			jQuery(".timepicker").datetimepicker({
				pickDate: false
			});
		}
		if (jQuery().bootstrapFileInput) {
			jQuery('input[type=file]').bootstrapFileInput();
		}
		if (window.Modernizr) {
			if (!Modernizr.input.placeholder) {
				jQuery("[placeholder]").focus(function () {
					var input;
					input = jQuery(this);
					if (input.val() === input.attr("placeholder")) {
						input.val("");
						return input.removeClass("placeholder");
					}
				}).blur(function () {
						var input;
						input = jQuery(this);
						if (input.val() === "" || input.val() === input.attr("placeholder")) {
							input.addClass("placeholder");
							return input.val(input.attr("placeholder"));
						}
					}).blur();
				return jQuery("[placeholder]").parents("form").submit(function () {
					return jQuery(this).find("[placeholder]").each(function () {
						var input;
						input = jQuery(this);
						if (input.val() === input.attr("placeholder")) {
							return input.val("");
						}
					});
				});
			}
		}
	});
});