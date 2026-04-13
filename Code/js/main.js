const API_URL = 'http://127.0.0.1:5000/api';

$(document).ready(function () {

  checkAuthStatus();

  var page = window.location.pathname.split('/').pop() || 'index.html';
  $('.eco-nav .nav-link').each(function () {
    if ($(this).attr('href') === page) $(this).css('color', '#2D6A4F');
  });

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) $('#scrollTop').fadeIn(200).css('display','flex');
    else $('#scrollTop').fadeOut(200);
  });
  $('#scrollTop').on('click', function () {
    $('html,body').animate({ scrollTop: 0 }, 500);
  });

  function reveal() {
    $('.reveal').each(function () {
      if ($(window).scrollTop() + $(window).height() > $(this).offset().top + 50) {
        $(this).addClass('visible');
      }
    });
  }
  $(window).on('scroll', reveal);
  reveal();

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

  $(document).on('click', '.btn-join-card', function (e) {
    e.preventDefault();
    toast('Initiative joined! Check your dashboard.');
  });

  $(document).on('click', '.btn-rsvp', function (e) {
    e.preventDefault();
    $(this).text('RSVP\'d').prop('disabled', true)
           .css({ background: '#40916c', cursor: 'default' });
    toast('RSVP confirmed! See you there.');
  });

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var formData = {
      name: $(this).find('input[placeholder*="name"]').val() || $(this).find('input[type="text"]').first().val(),
      email: $(this).find('input[type="email"]').val(),
      subject: $(this).find('input[placeholder*="Subject"]').val() || 'General Inquiry',
      message: $(this).find('textarea').val(),
      phone: $(this).find('input[placeholder*="phone"]').val() || ''
    };

    $.ajax({
      url: API_URL + '/contact',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        toast('Message sent! We will reply within 24 hours.');
        $('#contactForm')[0].reset();
      },
      error: function() {
        toast('Error sending message. Please try again.');
      }
    });
  });

  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    
    var formData = {
      name: $('#regName').val(),
      email: $('#regEmail').val(),
      password: $('#regPw').val(),
      phone: $('#regPhone').val() || ''
    };

    console.log('Attempting to register with:', formData);

    $.ajax({
      url: API_URL + '/auth/register',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        console.log('Register success:', response);
        toast('Account created! Redirecting to login...');
        setTimeout(function () { 
          window.location.href = 'login.html'; 
        }, 1500);
      },
      error: function(xhr) {
        console.log('Register error:', xhr);
        console.log('Status:', xhr.status);
        console.log('Response:', xhr.responseText);
        
        var errorMsg = 'Registration failed.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.status === 0) {
          errorMsg = 'Connection error. Make sure backend server is running on http://127.0.0.1:5500';
        } else if (xhr.status === 500) {
          errorMsg = 'Server error. Check database connection.';
        }
        toast(errorMsg);
      }
    });
  });

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    
    var formData = {
      email: $('#loginEmail').val(),
      password: $('#loginPw').val()
    };

    $.ajax({
      url: API_URL + '/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userEmail', response.user.email);
        toast('Welcome! Redirecting to dashboard...');
        setTimeout(function () { 
          window.location.href = 'dashboard.html'; 
        }, 1500);
      },
      error: function(xhr) {
        var errorMsg = 'Invalid email or password.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        toast(errorMsg);
      }
    });
  });

  $('#logoutBtn, #logoutDashBtn, #logoutNavBtn').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    toast('Logged out successfully.');
    setTimeout(function () { 
      window.location.href = 'login.html'; 
    }, 1200);
  });

  $(document).on('click', '.toggle-pw', function () {
    var $inp = $($(this).data('target'));
    $inp.attr('type', $inp.attr('type') === 'password' ? 'text' : 'password');
    $(this).find('i').toggleClass('fa-eye fa-eye-slash');
  });

  $(document).on('click', '.btn-newsletter', function () {
    toast('Subscribed! Thank you.');
  });

  if (page === 'dashboard.html') {
    loadDashboardData();
    loadUserEvents();
  }

  if (page === 'events.html') {
    loadPageEvents();
  }

  if (page === 'initiatives.html') {
    loadPageInitiatives();
  }

  if (page === 'index.html') {
    loadHomepageData();
  }

  $('#eventFormModal').on('submit', function (e) {
    e.preventDefault();
    
    var eventDate = new Date($('#eventDate').val()).toISOString().substring(0, 19).replace('T', ' ');
    
    var formData = {
      title: $('#eventTitle').val(),
      description: $('#eventDescr').val(),
      event_date: eventDate,
      location: $('#eventLoc').val(),
      image_url: $('#eventImg').val() || ''
    };

    var token = localStorage.getItem('authToken');

    $.ajax({
      url: API_URL + '/events',
      method: 'POST',
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
      success: function(response) {
        toast('Event created successfully!');
        $('#eventFormModal')[0].reset();
        var modalElement = document.getElementById('eventModal');
        var modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        loadUserEvents();
      },
      error: function(xhr) {
        var errorMsg = 'Error creating event.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        toast(errorMsg);
      }
    });
  });

  function toast(msg) {
    $('#ecoToast').find('.toast-msg').text(msg);
    $('#ecoToast').fadeIn(300).css('display', 'flex');
    setTimeout(function () { $('#ecoToast').fadeOut(400); }, 3500);
  }

  $('a[href^="#"]').on('click', function (e) {
    var t = $(this.hash);
    if (t.length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: t.offset().top - 75 }, 500);
    }
  });

});

function checkAuthStatus() {
  var token = localStorage.getItem('authToken');
  var userName = localStorage.getItem('userName');
  var page = window.location.pathname.split('/').pop() || 'index.html';

  if (token && userName) {
    // Show user info in navbar
    if ($('#userNameNav').length) {
      $('#userNameNav').text(userName).show();
      $('#dashboardLink').show();
      $('#logoutNavBtn').show();
      $('#loginLink').hide();
      $('#joinLink').hide();
    }
  } else {
    // Show login/join buttons
    if ($('#loginLink').length) {
      $('#loginLink').show();
      $('#joinLink').show();
      $('#userNameNav').hide();
      $('#dashboardLink').hide();
      $('#logoutNavBtn').hide();
    }
  }

  // Protect dashboard - redirect to login if not authenticated
  if (page === 'dashboard.html' && !token) {
    window.location.href = 'login.html';
    return;
  }

  // Protect create page - redirect to login if not authenticated
  if (page === 'create.html' && !token) {
    window.location.href = 'login.html';
    return;
  }

  // If logged in, redirect away from login/register pages
  if (token && (page === 'login.html' || page === 'register.html')) {
    window.location.href = 'dashboard.html';
    return;
  }
}

function loadDashboardData() {
  var userName = localStorage.getItem('userName');
  var userEmail = localStorage.getItem('userEmail');
  var userId = localStorage.getItem('userId');
  var token = localStorage.getItem('authToken');

  if (userName) {
    $('#welcomeMessage').text('Welcome, ' + userName + '!');
    $('#accountEmail').text(userEmail || userName);
  }

  var now = new Date();
  $('#memberSince').text(now.toLocaleString('en-US', { month: 'short', year: 'numeric' }));

  // Load dynamic dashboard stats from API
  if (userId && token) {
    $.ajax({
      url: API_URL + '/initiatives',
      method: 'GET',
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        var initiatives = response.data || [];
        var statsHtml = '<div class="col-6 col-md-3">' +
          '<div class="dash-stat" style="background:linear-gradient(135deg,#2D6A4F,#40916C);">' +
          '<h3>' + initiatives.length + '</h3><p>Initiatives Created</p>' +
          '</div>' +
          '</div>';
        $('#dashboardStatsContainer').append(statsHtml);
      }
    });

    $.ajax({
      url: API_URL + '/events',
      method: 'GET',
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        var events = response.data || [];
        var statsHtml = '<div class="col-6 col-md-3">' +
          '<div class="dash-stat" style="background:linear-gradient(135deg,#1a6b8a,#2196a8);">' +
          '<h3>' + events.length + '</h3><p>Events Created</p>' +
          '</div>' +
          '</div>';
        $('#dashboardStatsContainer').append(statsHtml);
      }
    });
  }
}

function loadUserEvents() {
  var token = localStorage.getItem('authToken');

  $.ajax({
    url: API_URL + '/events',
    method: 'GET',
    headers: {
      'authorization': token,
      'Content-Type': 'application/json'
    },
    success: function(response) {
      var events = response.data || [];
      var container = $('#myEventsContainer');
      container.empty();

      if (events.length === 0) {
        $('#noEventsMsg').show();
      } else {
        $('#noEventsMsg').hide();
        events.forEach(function(event) {
          var eventDate = new Date(event.event_date).toLocaleDateString();
          var eventHtml = '<div class="init-row">' +
            '<div>' +
            '<h6>' + event.title + '</h6>' +
            '<small><i class="fas fa-map-marker-alt me-1" style="color:var(--green-light);"></i>' + (event.location || 'TBD') + ' · ' + eventDate + '</small>' +
            '</div>' +
            '<div>' +
            '<button class="btn btn-sm btn-outline-danger me-1" onclick="deleteEvent(' + event.id + ')">Delete</button>' +
            '</div>' +
            '</div>';
          container.append(eventHtml);
        });
      }
    },
    error: function() {
      $('#noEventsMsg').show();
    }
  });
}

function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event?')) {
    return;
  }

  var token = localStorage.getItem('authToken');

  $.ajax({
    url: API_URL + '/events/' + eventId,
    method: 'DELETE',
    headers: {
      'authorization': token
    },
    success: function() {
      var msg = document.getElementById('ecoToast').querySelector('.toast-msg');
      msg.textContent = 'Event deleted successfully!';
      $('#ecoToast').fadeIn(300).css('display', 'flex');
      setTimeout(function () { $('#ecoToast').fadeOut(400); }, 3500);
      loadUserEvents();
    },
    error: function() {
      var msg = document.getElementById('ecoToast').querySelector('.toast-msg');
      msg.textContent = 'Error deleting event.';
      $('#ecoToast').fadeIn(300).css('display', 'flex');
      setTimeout(function () { $('#ecoToast').fadeOut(400); }, 3500);
    }
  });
}

function loadPageEvents() {
  var allEvents = [];

  $.ajax({
    url: API_URL + '/events',
    method: 'GET',
    success: function(response) {
      allEvents = response.data || [];
      displayEvents(allEvents);
    },
    error: function() {
      $('#noEventsMsg').show();
    }
  });

  // Search events
  $('#eventSearchInput').on('keyup', function() {
    var searchVal = $(this).val().toLowerCase();
    var filtered = allEvents.filter(function(event) {
      return event.title.toLowerCase().includes(searchVal) || 
             event.location.toLowerCase().includes(searchVal);
    });
    displayEvents(filtered);
  });
}

function displayEvents(events) {
  var container = $('#eventsContainer');
  container.empty();

  if (events.length === 0) {
    $('#noEventsMsg').show();
    return;
  } else {
    $('#noEventsMsg').hide();
  }

  events.forEach(function(event) {
    var eventDate = new Date(event.event_date).toLocaleDateString();
    var eventHtml = '<div class="event-detail-card reveal">' +
      '<span class="event-badge badge-workshop">' + (event.type || 'Event') + '</span>' +
      '<h5>' + event.title + '</h5>' +
      '<p>' + event.description + '</p>' +
      '<div class="event-meta-grid">' +
      '<div class="event-meta-item"><i class="fas fa-calendar"></i> ' + eventDate + '</div>' +
      '<div class="event-meta-item"><i class="fas fa-map-marker-alt"></i> ' + (event.location || 'TBD') + '</div>' +
      '</div>' +
      '<div class="event-card-footer">' +
      '<a href="#" class="btn-rsvp">Join Event</a>' +
      '</div>' +
      '</div>';
    container.append(eventHtml);
  });
}

function loadPageInitiatives() {
  var allInitiatives = [];

  $.ajax({
    url: API_URL + '/initiatives',
    method: 'GET',
    success: function(response) {
      allInitiatives = response.data || [];
      updateInitiativesDisplay(allInitiatives);
    },
    error: function() {
      console.log('Error loading initiatives');
    }
  });

  // Search initiatives
  $('#searchInput').on('keyup', function() {
    var searchVal = $(this).val().toLowerCase();
    var filtered = allInitiatives.filter(function(init) {
      return init.title.toLowerCase().includes(searchVal) || 
             init.location.toLowerCase().includes(searchVal);
    });
    updateInitiativesDisplay(filtered);
  });

  // Filter by category
  $(document).on('click', '.filter-pill', function () {
    var cat = $(this).data('cat');
    if (cat === 'all') {
      updateInitiativesDisplay(allInitiatives);
    } else {
      var filtered = allInitiatives.filter(function(init) {
        return init.category === cat;
      });
      updateInitiativesDisplay(filtered);
    }
  });
}

function updateInitiativesDisplay(initiatives) {
  var container = $('#grid');
  container.empty();

  if (initiatives.length === 0) {
    $('#showing-count').text('Showing 0 initiatives');
    container.append('<div style="text-align:center;color:var(--text-muted);padding:40px;grid-column:1/-1;">No initiatives found</div>');
    return;
  }

  $('#showing-count').text('Showing ' + initiatives.length + ' initiatives');

  initiatives.forEach(function(init) {
    var initHtml = '<div class="col-md-4 col-sm-6 init-col" data-cat="' + (init.category || 'soil') + '">' +
      '<div class="init-card">' +
      '<div class="init-card-img">' +
      '<img src="' + (init.image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&q=80') + '" alt="' + init.title + '" />' +
      '<span class="cat-badge">' + (init.category || 'Project') + '</span>' +
      '</div>' +
      '<div class="init-card-body">' +
      '<h5>' + init.title + '</h5>' +
      '<p>' + init.description + '</p>' +
      '<div class="d-flex justify-content-between align-items-center">' +
      '<span class="init-meta"><i class="fas fa-map-marker-alt"></i> ' + (init.location || 'TBD') + '</span>' +
      '<a href="initiative-detail.html" class="btn-join-card">Join</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
    container.append(initHtml);
  });
}

function loadHomepageData() {
  // Load featured initiatives (first 4)
  $.ajax({
    url: API_URL + '/initiatives',
    method: 'GET',
    success: function(response) {
      var initiatives = response.data || [];
      var featured = initiatives.slice(0, 4);
      
      var container = $('#featuredInitiatives');
      if (featured.length === 0) {
        container.html('<div style="text-align:center;color:var(--text-muted);padding:40px;grid-column:1/-1;">No initiatives yet. Be the first to create one!</div>');
      } else {
        featured.forEach(function(init) {
          var initHtml = '<div class="col-md-3 col-sm-6 reveal">' +
            '<div class="init-card">' +
            '<div class="init-card-img">' +
            '<img src="' + (init.image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80') + '" alt="' + init.title + '" />' +
            '<span class="cat-badge">' + (init.category || 'Project') + '</span>' +
            '</div>' +
            '<div class="init-card-body">' +
            '<h5>' + init.title + '</h5>' +
            '<p>' + init.description + '</p>' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<span class="init-meta"><i class="fas fa-map-marker-alt"></i> ' + (init.location || 'TBD') + '</span>' +
            '<a href="initiative-detail.html" class="btn-join-card">Join</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
          container.append(initHtml);
        });
      }
    }
  });

  // Load overall platform stats
  $.ajax({
    url: API_URL + '/initiatives',
    method: 'GET',
    success: function(response) {
      var totalInitiatives = (response.data || []).length;
      var statsHtml = '<div class="col-md-4 reveal">' +
        '<div class="stat-icon-circle"><i class="fas fa-seedling"></i></div>' +
        '<span class="stat-number">' + totalInitiatives + '</span>' +
        '<span class="stat-label">Initiatives</span>' +
        '</div>';
      $('#statsContainer').append(statsHtml);
      $('#statsSection').show();
    }
  });

  $.ajax({
    url: API_URL + '/events',
    method: 'GET',
    success: function(response) {
      var totalEvents = (response.data || []).length;
      var statsHtml = '<div class="col-md-4 reveal">' +
        '<div class="stat-icon-circle"><i class="fas fa-calendar"></i></div>' +
        '<span class="stat-number">' + totalEvents + '</span>' +
        '<span class="stat-label">Upcoming Events</span>' +
        '</div>';
      $('#statsContainer').append(statsHtml);
    }
  });
}
