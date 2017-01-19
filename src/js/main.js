$(document).ready(function() {

  var $hamburger = $('.hamburger'),
      $menu = $('.menu__nav'),
      $menuLinks = $('.menu__link--dropdown');

  /*---eventHandler for hamburger---*/
  $hamburger.on('click', function() {
    $menu.toggleClass('menu__nav--open');
    $(this).toggleClass('hamburger--open');
  });

  /*---eventHandler for menuLinks with dropdowns---*/
  $menuLinks.on('click', function(event) {
    event.preventDefault();
  });
});
