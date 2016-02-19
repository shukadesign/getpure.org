$(function() {
  'use strict';

  var w = $(window), $body = $('body'), $root = $('html');

  if( document.referrer.length && document.referrer.lastIndexOf('http://getpure.org') < 0 ) {
    if( !$('a.google-play-link').size() )
      return;

    var currentLink = $('a.google-play-link').attr('href');

    var appId;
    var params = currentLink.split('?')[1].split('&');

    for (var i=0; i<params.length; i++) {
      if (params[i].lastIndexOf("id=")>=0)
        appId = params[i];
    };

    var resultingLink = currentLink.split('?')[0] + "?" + appId + "&referrer=utm_source%3Dgetpure.org%26utm_medium%3D" + encodeURIComponent(encodeURIComponent(document.referrer));
    $('a.google-play-link').attr('href', resultingLink);
  };

  function _increase( i, ii ) {
    if ( i > ii )  return 1;
    else if ( i < ii ) return -1;
    else return 0;
  };

  // Animations for .downer && scroll to top
  var Downer = (function() {
    var $downer, $wrap, $section, pos = [], a = null, b = null, y;

    function _createPosArr() {
      var newpos = [];

      $section.each( function() {
        var it = $(this);

        newpos.push(it.offset().top);
        newpos.sort(_increase);
      });
      pos = newpos;
    };

    function _upper( ev ) {
      ev.preventDefault();
      var it = $(this);
      if( it.hasClass('is-up') ) {
        $wrap.velocity('scroll', {
          duration: 600,
          easing: 'ease-in-out'
        });
      } else {
        $('#here').velocity('scroll', {
          duration: 600,
          easing: 'ease-in-out'
        });
      };
    };

    function _update() {
      y = w.scrollTop();
      b = y + w.height();
      a = $wrap.outerHeight();

      // Change $downer direction
      if( y > pos[0] ) {
        $downer.addClass('is-up');
      } else {
        $downer.removeClass('is-up');
      };

      // Change color $downer
      if( y >= (pos[1] - w.innerHeight() + 63) && y <= (pos[2] - w.innerHeight() + 63) ) {
        $downer.addClass('is-light');
      } else if( y >= (pos[3] - w.innerHeight() + 63) && y <= (pos[4] - w.innerHeight() + 63) ) {
        $downer.addClass('is-light');
      } else {
        $downer.removeClass('is-light');
      };

      // Stoping $downer
      if( b > a ) {
        $downer.addClass('is-absolute');
      } else {
        $downer.removeClass('is-absolute');
      };
    };

    return {
      init: function() {
        $section = $('.js-section');
        $wrap = $('.wrap');
        $downer = $('.js-downer');

        $downer.on( 'click', _upper );

        w.on( 'load resize', function() {
          _createPosArr();
        }).on( 'scroll resize', function() {
          _update();
        });
      }
    };
  })();

  // Hide smart banner
  // var hideBanner = (function() {

  //   var $bannerLink;

  //   if( cookie.get('downloaded') ) {
  //     $body.addClass('old');
  //   };

  //   function _hide() {
  //     $body.addClass('is-sbanner-hide');
  //   };

  //   function _writeToStorage() {
  //     cookie.set({
  //      downloaded: true
  //     }, {
  //      expires: 80
  //     });
  //   };

  //   return {
  //     init: function() {
  //       $bannerLink = $('.js-sbanner-link');
  //       $bannerLink.on( 'tap', function() {
  //         _writeToStorage();
  //       });
  //     }
  //   }
  // })();

  var ShareRules = (function() {
    var dialogH = 500, dialogW = 768, dialogTop, dialogLeft, $link;

    dialogTop = (screen.height / 2) - (dialogH / 2);
    dialogLeft = (screen.width / 2) - (dialogW / 2);

    function _share() {
      event.preventDefault();
        window.open( $(this).attr( 'href' ), 'fb-share', 'top=' + dialogTop + ',left=' + dialogLeft + ',menubar=0,toolbar=0,status=0,location=0,width=' + dialogW + ',height=' + dialogH );
    };

    return {
      init: function() {
        $('.js-share-link').exists(function() {
          $link = $(this);
          $link.on( 'click', _share );
        });

      }
    }
  })();

  // Scroll to section
  var ScrollToSection = (function() {
    var linkHash;

    // @param {element} Document element to which scrolling
    // @private
    function _scrolling( section ) {
      event.preventDefault();
      section.velocity( 'scroll', {
        duration: 800,
        easing: [0.6, 0.2, 0.1, 1]
      });
    };

    return {
      init: function() {
        $('.js-nav-link').exists(function() {

          $(this).on( 'click', function() {
            linkHash = $(this).attr( 'href' ).substr(1);
            _scrolling( $( '#' + linkHash ) );
            window.location.hash = '#' + linkHash;
          });
        });
      }
    };
  })();

  // Toggle navbar
  var ToggleNavigation = (function() {
    var $nav, $trigger,  $touchTrigger, $touchBurger, $fixline, $touchFixline,Y = 0, newY, closed = true, touchClosed = true, anima = false;

    function toggle( _this ) {
      if ( closed ) {
        _this.addClass( 'is-open' );
        $fixline.addClass( 'is-open' );
        closed = false;
      } else {
        _this.removeClass( 'is-open' );
        $fixline.removeClass( 'is-open' );
        closed = true;
      };
    };

    function _toggleTouch( _this ) {
      if ( touchClosed ) {
        _this.addClass( 'is-open' );
        $touchBurger.addClass( 'is-show' ).addClass( 'is-open' );
        touchClosed = false;
      } else {
        _this.removeClass( 'is-open' );
        $touchBurger.removeClass( 'is-open' );
        setTimeout(function() {
          $touchBurger.removeClass( 'is-show' )
        }, 300);
        touchClosed = true;
      };
    };

    function _changeClass() {
      newY = w.scrollTop();

      if( newY <= 0 ) {
        $body.swipedown();
      };

      if ( newY < Y || newY <= 0 ) {
        $nav.removeClass('is-hide');
      } else {
        $nav.addClass('is-hide').removeClass( 'is-open' );
        $trigger.removeClass( 'is-open' );
        closed = touchClosed = true;
      };

      Y = newY;
      return Y;
    };

    return {
      init: function( elem ) {
        $( '.fixline' ).exists( function() {
          $nav = $(this),
          $trigger = $( '.js-burger-trigger' ),
          $touchTrigger = $( '.js-touch-burger-trigger' ),
          $touchBurger = $( '.touch-burger' )
          $fixline = $( '.fixline' ),
          $touchFixline = $( '.touch-fixline' );

          $body.on( 'swipeup', function() {
            $touchFixline.addClass( 'is-hide' );
            $touchTrigger.removeClass( 'is-open' );
            $touchBurger.removeClass( 'is-open' );
            setTimeout(function() {
              $touchBurger.removeClass( 'is-show' )
            }, 300);
          });

          w.on( 'scroll', _changeClass );

          $touchTrigger.on( 'tap', function() {
            _toggleTouch( $(this) );
          });

          $trigger.on( 'tap', function() {
            toggle( $(this) );
          });
        });
      }
    }
  })();

  // Flowtype
  var FlowingType = (function() {

    function _touch() {
      $root.flowtype({
        fontRatio: 20
      });
    };

    function _desktop() {
      $root.flowtype({
        fontRatio: 64,
        minFont: 15,
        maximum: 1480
      });
    };

    return {
      init: function() {
        w.on( 'load', function() {
          if( w.width() <= 767 && client.mobile ) {
            _touch();
          } else {
            _desktop();
          }
        });
      }
    }
  })();


  // Set section height
  var SetFullHeight = ( function() {
    var $section, windowH = w.innerHeight();

    function _setSectionHeight() {
      $section.each( function() {
        if( !client.vh ) {
          $section.height( windowH );
        }
      })
    };

    return {
      init: function() {
        $section = $('.js-fullscreen');
        w.on( 'load resize', _setSectionHeight );
      }
    }
  })();


  var Priyatnost = ( function() {
    var a, b;

    function _touchReveal( c ) {

      var touch = {
        scale: 1,
        viewFactor: 0.4,
        reset: true,
        viewOffset: { bottom : w.innerHeight()-100 },
        delay: 300
      };

      sr.reveal( c, touch );
    };

    function _desktopReveal( c ) {

      var desktop = {
        distance: '0.625rem',
        scale: 1,
        viewFactor: 0.4,
        reset: true,
        mobile: false
      };

      sr.reveal( c, desktop );
    };

    return {
      init: function() {
        $('.faq .article-unit').exists(function() {
          var $this = $(this);
          window.sr = ScrollReveal();

          if( w.width() <= 767 ) {
            a = $('<a href="#body" class="js-nav-link to-top"></a>');
            $this.prepend( a );
            _touchReveal( '.to-top' );
          } else {
            _desktopReveal( '.faq .article-unit' );
          }
        });
      }
    };

  })();

  var ChangeLink = (function() {
    function _change() {
      if( client.iOS ) {
        // Change download link for iOS
        // In banner
        $('.is-fluid').attr({
          'href': '//itunes.apple.com/ru/app/pure-anonimnye-blizkie-znakomstva/id690661663?mt=8',
          'id': 'apple-download-link-mobile-banner'
        });
        // In prefooter
        $('.download_link').attr({
          'href': '//itunes.apple.com/ru/app/pure-anonimnye-blizkie-znakomstva/id690661663?mt=8',
          'id': 'apple-download-link-mobile-prefooter'
        });
      };
    }

    return {
      init: _change
    }
  })();


  // Init
  window.onload = function() {
    setTimeout( function() {
      $body.addClass('load');
    }, 420);
  };

  $('.js-sbanner-close').on( 'tap swiperight', function() {
    $body.addClass( 'is-sbanner-hide' );
    setTimeout(function() {
      $(this).hide();
    }, 1500);
  });

  var Touchy = (function() {
    var $elem, modifer, active = false;

    function _addStyle() {
      if( !active ) {
        $(this).addClass( modifer );
        active = true;
      }
    };

    function _removeStyle() {
      if( active ) {
        $(this).removeClass( modifer );
        active = false;
      }
    };

    function _callback() {
      var $this = $(this);

      if( $this.attr( 'href' ) !== undefined ) {
        event.preventDefault();
        $this.removeClass( modifer );
        setTimeout(function() {
          window.location = $this.attr('href');
        }, 100);
      };

      return false;
    };

    return {
      init: function( elem, isclass ) {
        $elem = elem, modifer = isclass || 'is-touch';
        elem.on( 'tapstart',  _addStyle )
          .on( 'tapend', _removeStyle )
          .on( 'tap', _callback );
      }
    }
  })();

  $('[data-os="universal-big"]').on( 'swiperight', function( e, touch ) {
    $body.addClass( 'is-sbanner-hide' );
    setTimeout(function() {
      $(this).hide();
    }, 1500);
  });

  client.setClasses();
  ChangeLink.init();
  FlowingType.init();
  SetFullHeight.init();
  Downer.init();
  Priyatnost.init();
  ScrollToSection.init();
  ToggleNavigation.init();
  ShareRules.init();
  Touchy.init( $('[data-action="touch"]') );

});