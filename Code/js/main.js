$(document).ready(function () {

  /* ---- Active nav link ---- */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  $('.eco-nav .nav-link').each(function () {
    if ($(this).attr('href') === page) $(this).css('color', '#2D6A4F');
  });

  /* ---- Scroll-to-top ---- */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) $('#scrollTop').fadeIn(200).css('display','flex');
    else $('#scrollTop').fadeOut(200);
  });
  $('#scrollTop').on('click', function () {
    $('html,body').animate({ scrollTop: 0 }, 500);
  });

  /* ---- Reveal on scroll ---- */
  function reveal() {
    $('.reveal').each(function () {
      if ($(window).scrollTop() + $(window).height() > $(this).offset().top + 50) {
        $(this).addClass('visible');
      }
    });
  }
  $(window).on('scroll', reveal);
  reveal();

  /* ---- Counter animation ---- */
  var counted = false;
  $(window).on('scroll', function () {
    if (counted) return;
    var $stats = $('.stats-section');
    if (!$stats.length) return;
    if ($(window).scrollTop() + $(window).height() > $stats.offset().top + 80) {
      counted = true;
      $('[data-count]').each(function () {
        var $el = $(this), target = parseInt($el.data('count'));
        $({ n: 0 }).animate({ n: target }, {
          duration: 1600,
          step: function () { $el.text(Math.floor(this.n).toLocaleString()); },
          complete: function () { $el.text(target.toLocaleString()); }
        });
      });
    }
  });

  /* ---- Initiative filter ---- */
  $(document).on('click', '.filter-pill', function () {
    $('.filter-pill').removeClass('active');
    $(this).addClass('active');
    var cat = $(this).data('cat');
    if (cat === 'all') {
      $('.init-col').show();
    } else {
      $('.init-col').hide();
      $('.init-col[data-cat="' + cat + '"]').show();
    }
    var shown = $('.init-col:visible').length;
    $('#showing-count').text('Showing ' + shown + ' initiatives');
  });

  /* ---- Search ---- */
  $('#searchInput').on('keyup', function () {
    var val = $(this).val().toLowerCase();
    var shown = 0;
    $('.init-col').each(function () {
      var match = $(this).text().toLowerCase().includes(val);
      $(this).toggle(match);
      if (match) shown++;
    });
    $('#showing-count').text('Showing ' + shown + ' initiatives');
  });

  /* ---- Join button ---- */
  $(document).on('click', '.btn-join-card', function (e) {
    e.preventDefault();
    toast('🌿 You joined this initiative! Check your dashboard.');
  });

  /* ---- RSVP ---- */
  $(document).on('click', '.btn-rsvp', function (e) {
    e.preventDefault();
    $(this).text('✔ RSVP\'d').prop('disabled', true)
           .css({ background: '#40916c', cursor: 'default' });
    toast('🎉 RSVP confirmed! See you there.');
  });

  /* ---- Contact form ---- */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    toast('✅ Message sent! We\'ll reply within 24 hours.');
    this.reset();
  });

  /* ---- Login form ---- */
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    toast('👋 Welcome back! Redirecting...');
    setTimeout(function () { window.location.href = 'dashboard.html'; }, 1600);
  });

  /* ---- Register form ---- */
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    toast('🌱 Account created! Redirecting to login...');
    setTimeout(function () { window.location.href = 'login.html'; }, 1600);
  });

  /* ---- Password toggle ---- */
  $(document).on('click', '.toggle-pw', function () {
    var $inp = $($(this).data('target'));
    $inp.attr('type', $inp.attr('type') === 'password' ? 'text' : 'password');
    $(this).find('i').toggleClass('fa-eye fa-eye-slash');
  });

  /* ---- Newsletter ---- */
  $(document).on('click', '.btn-newsletter', function () {
    toast('📧 Subscribed! Thank you.');
  });

  /* ---- Toast helper ---- */
  function toast(msg) {
    $('#ecoToast').find('.toast-msg').text(msg);
    $('#ecoToast').fadeIn(300).css('display', 'flex');
    setTimeout(function () { $('#ecoToast').fadeOut(400); }, 3500);
  }

  /* ---- Smooth anchor ---- */
  $('a[href^="#"]').on('click', function (e) {
    var t = $(this.hash);
    if (t.length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: t.offset().top - 75 }, 500);
    }
  });

});
