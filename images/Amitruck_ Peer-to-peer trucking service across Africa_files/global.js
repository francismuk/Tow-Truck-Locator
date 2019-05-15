var $window = $(window);

$(function(){
	var mainNavWrap = $('.main-nav-wrap');

	// Activate swiper slider for how it works section
	if ($window.width() <= 768){
		var swiper = new Swiper('.swiper-container-steps', {
			slidesPerView: 1,
			spaceBetween: 30,
			speed: 1400,
			loop: true,
			autoplay: {
				delay: 4500,
			},
			pagination: {
				el: '.swiper-container-steps .swiper-pagination',
				clickable: true,
				renderBullet: function (index, className) {
					  return `<span class="${className}"><svg class="circ" width="30" height="30" class="circ">
					  <circle class="circ2" cx="16" cy="16" r="11" stroke="#a5a9ac" stroke-width="5" fill="none"/>
					  <circle class="circ1" cx="16" cy="16" r="11" stroke="#3b3e46" stroke-width="5" fill="none"/>
					  
					  </svg></span>`;
				}
			}
		});

		swiper.autoplay.stop();

		$window.on('scroll', function(){
			let wScroll = $(this).scrollTop();

			if(wScroll > $('.gallery-steps').offset().top - ($(window).height() / 1.1)){
				swiper.autoplay.start();
			}
		});
	}

	if (!iOS()){
		$window.on('resize',function(){
			if ($window.width() <= 920 && $window.width() >= 640){
				location.reload();
			}
		});
	}


	// Animate main nav on scroll
	$window.on('scroll', function(){
		if ($(window).scrollTop() > 80){
			mainNavWrap.addClass('top-position');
		} else {
			mainNavWrap.removeClass('top-position');
		}

		if ($(window).scrollTop() > 350){
			mainNavWrap.addClass('fixed-nav');
		} else {
			mainNavWrap.removeClass('fixed-nav');
		}

		fadeInOneAfterAnother('.gallery-steps .swiper-container-steps .swiper-slide');

		fadeInOneAfterAnother('.team-wrap .one-team-member');
	});

	// Adding active class to section link when on section
	$window.scroll(function() {
		var scrollDistance = $window.scrollTop() + ($window.width() <= 768 ? 30 : 100);

		// Assign active class to nav links while scolling
		$('.page-section').each(function(i) {
			if ($(this).position().top <= scrollDistance) {
				$('.main-nav-links li.active').removeClass('active');
				$('.main-nav-links li').eq(i).addClass('active');
			} else if($(this).position().top > scrollDistance){
				$('.main-nav-links li').eq(i).removeClass('active');
			}
		});
	}).scroll();

	// Mobile nav icon
	$('#nav-icon').click(function(){
		$(this).toggleClass('open');
		$('.main-nav-wrap .main-nav .main-nav-links').toggleClass('visible-nav');
		$('.fixed-nav').toggleClass('open');
		$('body').toggleClass('no-scroll');
	});

	// Mobile menu closes on click on the link
	if ($window.width() <= 920){
		$('.main-nav-links li a').on('click', function(){
			$('#nav-icon').removeClass('open');
			$('.main-nav-wrap .main-nav .main-nav-links').removeClass('visible-nav');
			$('.fixed-nav').removeClass('open');
			$('body').removeClass('no-scroll');
		});
	}

	// Smooth scroll on click
	$(document).on('click', 'a[href^="#"]', function(e) {
	    var id = $(this).attr('href');
	    var $id = $(id);

	    if ($id.length === 0) {
	        return;
	    }

	    // prevent standard hash navigation (avoid blinking in IE)
	    e.preventDefault();

	    var pos = $id.offset().top;

	    $('body, html').animate({scrollTop: pos}, 1000);
	});

	$window.on('scroll resize', fadeIn);
    $window.trigger('scroll');
	
});


function fadeIn(){
    var winHeight = $(window).height();
    var bodyScroll = $(document).scrollTop();
    var calcHeight = bodyScroll + winHeight -  ($window.width() <= 768 ? 0 : 150);

    $('.fadein-wrap').each(function(index, el) {
        if ( $(this).offset().top  < calcHeight ) {
            $(this).addClass('in-view');
        } else {
            $(this).removeClass('in-view');
        }
    });
}

function fadeInOneAfterAnother(selector){
	let wScroll = $(this).scrollTop();

	$(selector).each(function(i){
		if (wScroll > $(selector).eq(i).offset().top - ($(window).height() / 1.1)){
			setTimeout(function(){
				$(selector).eq(i).addClass('is-showing');
			}, 150 * (i + 1));
		}
	});
}

function iOS() {
	var iDevices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	];

	if (!!navigator.platform) {
		while (iDevices.length) {
			if (navigator.platform === iDevices.pop()){ return true; }
		}
	}

	return false;
}

function ajaxFormSubmit($form, callback_on_success) {
    if (typeof(FormData) === 'undefined') {
        return;
    }
    var $success_msg = $form.find('.msg.success_msg'),
        $error_msg = $form.find('.msg.error_msg'),
        $error_fields_in_form = $form.find('.error');
    $success_msg.html('');
    $error_msg.html('');
    $error_fields_in_form.removeClass('error');
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: new FormData($form[0]),
        dataType: 'json',
        success: function(result) {
            if (result.error !== undefined) {
                var error_msg;
                for (var field in result.error) {
                    var $field = $form.find('[name*=\\[' + field + '\\]]');
                    if ($field.length) {
                        $field.addClass('error');
                    }
                    if (result.error[field] && !error_msg) {
                        error_msg = result.error[field];
                    }
                }
                if (error_msg) {
                    $error_msg.html(error_msg);
                }
            } else if (result.success !== undefined) {
                $success_msg.html(result.success);
		$success_msg.css('display','block');
                if (callback_on_success !== undefined) {
                    callback_on_success.call(this, result);
                }
            }
        },
        error: ajaxError,
        cache: false,
        contentType: false,
        processData: false
    });
}

function ajaxError(jqXHR, exception) {
    alert('Something went wrong...');
}

$(document).on('submit', '.contact-form', function(event) {
	event.preventDefault();
	var $form = $(this);
	ajaxFormSubmit($form, function() {
		$form[0].reset();
	});
});



















