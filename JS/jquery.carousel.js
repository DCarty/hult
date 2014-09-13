(function ($) {
    'use strict';
    $.fn.HultCarousel = function (columns, animation) {

        function repeat(str, num) {
            return new Array(num + 1).join(str);
        }

        return this.each(function () {
            var wrap = $('> div', this).css('overflow', 'hidden'),
                slider = wrap.find('> ul'),
                slides = slider.find('> li'),
                slide = slides.filter(':first'),
                slideWidth = slide.outerWidth(),
                animate = animation,
                cols = columns,
                currentPage = 1,
                page = 0;
            $('.mask').css('display', 'block');

            /* Recalc dimensions */

            function resizeRecalc() {

                // Reset carousel
                $('.empty', wrap).remove();
                $('.cloned', wrap).remove();
                var wrapWidth = wrap.width() / cols;
                slideWidth = wrapWidth;
                $('li').width(wrapWidth);

                slides = slider.find('> li');
                wrap.visible = Math.ceil(wrap.innerWidth() / slideWidth);
                wrap.pages = Math.ceil(slides.length / wrap.visible);

                if ((slides.length % wrap.visible) !== 0) {

                    slider.append(repeat('<li class="empty" />', wrap.visible - (slides.length % wrap.visible)));

                    slides = slider.find('> li');
                }

                slides.filter(':first').before(slides.slice(-wrap.visible).clone().addClass('cloned'));
                slides.filter(':last').after(slides.slice(0, wrap.visible).clone().addClass('cloned'));
                slides = slider.find('> li'); // reselect
                wrap.scrollLeft(slideWidth * wrap.visible);
                $(slider).css('width', (slides.length + 1) * slideWidth);
                page = 1;
            }

            /* Recalc on window resize event */

            $(window).resize(resizeRecalc);

            setTimeout(function () {
                resizeRecalc();

                $('.mask').hide();

                if (animate) {
                    setInterval(function () {
                        moveTo(currentPage + 1);

                    }, 5000);
                }
                resizeRecalc();
            }, 1000);

            /* Handle moving left/right */

            function moveTo(page) {
                var dir = page < currentPage ? -1 : 1,
                    n = Math.abs(currentPage - page),
                    left = slideWidth * dir * wrap.visible + 1 * n;

                wrap.filter(':not(:animated)').animate({
                    scrollLeft: '+=' + left
                }, 500, function () {
                    if (page === 0) {
                        wrap.scrollLeft(slideWidth * wrap.visible * wrap.pages);
                        page = wrap.pages;
                    } else if (page > wrap.pages) {
                        wrap.scrollLeft(slideWidth * wrap.visible);
                        // reset back to start position
                        page = 1;
                    }

                    currentPage = page;
                });

                return false;
            }

            wrap.after('<a class="arrow back">&lt;</a><a class="arrow forward">&gt;</a>');

            $('.arrow').css('top', (($(this).outerHeight() / 2) - $('.arrow').outerHeight() / 2) + 'px');

            $('a.back', this).click(function () {
                return moveTo(currentPage - 1);
            });

            $('a.forward', this).click(function () {
                return moveTo(currentPage + 1);
            });

            // Create a public interface to move to a specific page
            $(this).bind('goto', function (event, page) {
                moveTo(page);
            });
        });
    };
})(jQuery);