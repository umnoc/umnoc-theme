/**
 * Ensuring collapsible and accessible components on multiple
 * screen sizes for the responsive lms header.
 */

function createMobileMenu() {
    /**
     * Dynamically create a mobile menu from all specified mobile links
     * on the page.
     */
    'use strict';
    $('.mobile-nav-item').each(function() {
        var mobileNavItem = $(this).clone().addClass('mobile-nav-link');
        mobileNavItem.removeAttr('role');
        mobileNavItem.find('a').attr('role', 'menuitem');
        // xss-lint: disable=javascript-jquery-append
        $('.mobile-menu').append(mobileNavItem);
    });
}

$(document).ready(function() {
    'use strict';
    var $hamburgerMenu;
    var $mobileMenu;
    // Toggling visibility for the user dropdown
    $('.umnoc-global-header + .nav-links .toggle-user-dropdown, .umnoc-global-header + .nav-links .toggle-user-dropdown span').click(function(e) {
        var $dropdownMenu = $('.umnoc-global-header + .nav-links .nav-item .dropdown-user-menu');
        var $userDropdown = $('.umnoc-global-header + .nav-links .toggle-user-dropdown');
        if ($dropdownMenu.is(':visible')) {
            $dropdownMenu.addClass('hidden');
            $userDropdown.attr('aria-expanded', 'false');
        } else {
            $dropdownMenu.removeClass('hidden');
            $dropdownMenu.find('.dropdown-item')[0].focus();
            $userDropdown.attr('aria-expanded', 'true');
        }
        $('.umnoc-global-header + .nav-links .toggle-user-dropdown').toggleClass('open');
        e.stopPropagation();
    });

    // Hide user dropdown on click away
    if ($('.umnoc-global-header + .nav-links .nav-item .dropdown-user-menu').length) {
        $(window).click(function(e) {
            var $dropdownMenu = $('.umnoc-global-header + .nav-links .nav-item .dropdown-user-menu');
            var $userDropdown = $('.umnoc-global-header + .nav-links .toggle-user-dropdown');
            if ($userDropdown.is(':visible') && !$(e.target).is('.dropdown-item, .toggle-user-dropdown')) {
                $dropdownMenu.addClass('hidden');
                $userDropdown.attr('aria-expanded', 'false');
            }
        });
    }

    // Toggling menu visibility with the hamburger menu
    $('.umnoc-global-header .hamburger-menu').click(function() {
        $hamburgerMenu = $('.umnoc-global-header .hamburger-menu');
        $mobileMenu = $('.mobile-menu');
        if ($mobileMenu.is(':visible')) {
            $mobileMenu.addClass('hidden');
            $hamburgerMenu.attr('aria-expanded', 'false');
        } else {
            $mobileMenu.removeClass('hidden');
            $hamburgerMenu.attr('aria-expanded', 'true');
        }
        $hamburgerMenu.toggleClass('open');
    });

    // Hide hamburger menu if no nav items (sign in and register pages)
    if ($('.mobile-nav-item').size() === 0) {
        $('.umnoc-global-header .hamburger-menu').addClass('hidden');
    }

    createMobileMenu();
});


// Accessibility keyboard controls for user dropdown and mobile menu
$('.mobile-menu, .umnoc-global-header').on('keydown', function(e) {
    'use strict';
    var isNext,
        nextLink,
        loopFirst,
        loopLast,
        $curTarget = $(e.target),
        isLastItem = $curTarget.parent().is(':last-child'),
        isToggle = $curTarget.hasClass('toggle-user-dropdown'),
        isHamburgerMenu = $curTarget.hasClass('hamburger-menu'),
        isMobileOption = $curTarget.parent().hasClass('mobile-nav-link'),
        isDropdownOption = !isMobileOption && $curTarget.parent().hasClass('dropdown-item'),
        $userDropdown = $('.umnoc-global-header + .nav-links .user-dropdown'),
        $hamburgerMenu = $('.umnoc-global-header .hamburger-menu'),
        $toggleUserDropdown = $('.umnoc-global-header + .nav-links .toggle-user-dropdown');

    // Open or close relevant menu on enter or space click and focus on first element.
    if ((e.key === 'Enter' || e.key === 'Space') && (isToggle || isHamburgerMenu)) {
        e.preventDefault();
        e.stopPropagation();

        $curTarget.click();
        if (isHamburgerMenu) {
            if ($('.mobile-menu').is(':visible')) {
                $hamburgerMenu.attr('aria-expanded', true);
                $('.mobile-menu .mobile-nav-link a').first().focus();
            } else {
                $hamburgerMenu.attr('aria-expanded', false);
            }
        } else if (isToggle) {
            if ($('.umnoc-global-header + .nav-links .nav-item .dropdown-user-menu').is(':visible')) {
                $userDropdown.attr('aria-expanded', 'true');
                $('.umnoc-global-header + .nav-links .dropdown-item a:first').focus();
            } else {
                $userDropdown.attr('aria-expanded', false);
            }
        }
    }

    // Enable arrow functionality within the menu.
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (isDropdownOption || isMobileOption ||
        (isHamburgerMenu && $hamburgerMenu.hasClass('open')) || isToggle && $toggleUserDropdown.hasClass('open'))) {
        isNext = e.key === 'ArrowDown';
        if (isNext && !isHamburgerMenu && !isToggle && isLastItem) {
            // Loop to the start from the final element
            nextLink = isDropdownOption ? $toggleUserDropdown : $hamburgerMenu;
        } else if (!isNext && (isHamburgerMenu || isToggle)) {
            // Loop to the end when up arrow pressed from menu icon
            nextLink = isHamburgerMenu ? $('.mobile-menu .mobile-nav-link a').last()
                : $('.umnoc-global-header + .nav-links .dropdown-user-menu .dropdown-nav-item').last().find('a');
        } else if (isNext && (isHamburgerMenu || isToggle)) {
            // Loop to the first element from the menu icon
            nextLink = isHamburgerMenu ? $('.mobile-menu .mobile-nav-link a').first()
                : $('.umnoc-global-header + .nav-links .dropdown-user-menu .dropdown-nav-item').first().find('a');
        } else {
            // Loop up to the menu icon if first element in menu
            if (!isNext && $curTarget.parent().is(':first-child') && !isHamburgerMenu && !isToggle) {
                nextLink = isDropdownOption ? $toggleUserDropdown : $hamburgerMenu;
            } else {
                nextLink = isNext ?
                    $curTarget.parent().next().find('a') : // eslint-disable-line newline-per-chained-call
                    $curTarget.parent().prev().find('a'); // eslint-disable-line newline-per-chained-call
            }
        }
        nextLink.focus();

        // Don't let the screen scroll on navigation
        e.preventDefault();
        e.stopPropagation();
    }

    // Escape clears out of the menu
    if (e.key === 'Escape' && (isDropdownOption || isHamburgerMenu || isMobileOption || isToggle)) {
        if (isDropdownOption || isToggle) {
            $('.umnoc-global-header + .nav-links .nav-item .dropdown-user-menu').addClass('hidden');
            $toggleUserDropdown.focus()
                .attr('aria-expanded', 'false');
            $('.umnoc-global-header + .nav-links .toggle-user-dropdown').removeClass('open');
        } else {
            $('.mobile-menu').addClass('hidden');
            $hamburgerMenu.focus()
                .attr('aria-expanded', 'false')
                .removeClass('open');
        }
    }

    // Loop when tabbing and using arrows
    if ((e.key === 'Tab') && ((isDropdownOption && isLastItem) || (isMobileOption && isLastItem) || (isHamburgerMenu
        && $hamburgerMenu.hasClass('open')) || (isToggle && $toggleUserDropdown.hasClass('open')))) {
        nextLink = null;
        loopFirst = isLastItem && !e.shiftKey && !isHamburgerMenu && !isToggle;
        loopLast = (isHamburgerMenu || isToggle) && e.shiftKey;
        if (!(loopFirst || loopLast)) {
            return;
        }
        e.preventDefault();
        if (isDropdownOption || isToggle) {
            nextLink = loopFirst ? $toggleUserDropdown :
                $('.umnoc-global-header + .nav-links .dropdown-user-menu .dropdown-nav-item a').last();
        } else {
            nextLink = loopFirst ? $hamburgerMenu : $('.mobile-menu .mobile-nav-link a').last();
        }
        nextLink.focus();
    }
});

