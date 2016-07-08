$(function() {

  // array of elements; prevent repetitive DOM requestsa
  var e = {
    document: $(document),
    window: $(window),
    html: $("html"), body: $("body"),
    footer: $("footer"),
    header: $("header"),
    shoutButton: $(".shoutText > button"),
    shoutBox: $(".shoutBox"),
    mainNav: $("#mainNav"),
    dropdown: $(".dropdown"),
    dropdownLinks: $(".dropdownLinks"),
    facebookShareButton: $("#facebookShareButton"),
    twitterShareButton: $("#twitterShareButton"),
    googlePlusShareButton: $("#googlePlusShareButton"),
    revealButton: $(".revealButton"),
    categoryListItem: $(".categoryListItem"),
    titleImage: $(".titleImage"),
    sideNav: $("#sideNav"),
    sideNavSearch: $("#sideNavSearch"),
    searchButton: $(".searchButton"),
    menuButtons: $(".closeMenuButton, .openMenuButton"),
    searchTerm: $("#searchTerm"),
    searchResults: $("#searchResults"),
    searchSearch: $("#searchSearch"),
    searchIcon: $(".searchIcon"),
    mainSearchIcon: $(".mainSearchIcon"),
    mainSearch: $("#mainSearch"),
    upButton: $("#upButton"),
    downButton: $("#downButton")
  };
  
  // accessory functions
  var getPxValue = function(input) {
    return parseInt(input.substring(0, input.length-2));
  };
  var search = function(input) {
    if(input.trim() != "")
      window.location.href = "search/?" + encodeURIComponent(input);
  };

  // reposition the footer
  var docWidth, docHeight;
  var resizeFunction = function() {
    var extraPadding = e.shoutButton.length > 0 ? 0 : 50;
    e.body.css({ paddingTop: Math.floor(e.header.height() + e.mainNav.height()) });
    docWidth = e.document.width() > e.window.width() ? e.document.width() : e.window.width();
    docHeight = e.document.height() > e.window.height() ? e.document.height() : e.window.height();
    // resize triangular part if applicable
    if(e.titleImage.length == 1) {
      if(!e.titleImage.prev().is("h1:not(#title)")) {
        $("h1:not(#title)").first().after(e.titleImage); 
      }
      if(e.hasOwnProperty("triangle")) {
        e.triangle.css({ borderWidth: "1.6em " + (e.window.width()/2+2) + "px" });
      } else {
        e.titleImage.append($("<div class='triangle'></div><div class='triangle'></div>"));
        e.triangle = $(".triangle").css({ borderWidth: "1.6em " + (e.window.width()/2+2) + "px" });
      }
    }
    // resize size of #sideNav links for mobile
    e.sideNav.children().css({ height: Math.ceil(e.window.height()/8), lineHeight: Math.ceil(e.window.height()/8) + "px" });
    // make main search bar full width 
    e.mainSearch.innerWidth(e.window.width() - e.mainSearchIcon.innerWidth());
    // resize search icon
    e.mainSearchIcon.css({ height: e.dropdown.innerHeight() || e.mainSearch.innerHeight() });
  
    // get positions of shoutBox (for scrolling effects)
    if(e.shoutBox.length > 0) {
      topPositions = [];
      e.shoutBox.each(function() {
        topPositions.push($(this).position().top);
      });
    }

  };
  // dropdown code
  e.dropdown.each(function() {
    var thisElement = $(this), dropdown = $("#dropdown" + thisElement.data("dropdown"));
    thisElement.hover(function() {
      e.dropdown.removeClass("linger");
      e.dropdownLinks.addClass("hidden");
      thisElement.addClass("linger");
      dropdown.css({ top: e.mainNav.height(), left: thisElement.position().left }).removeClass("hidden");
    }, function() {
      e.document.mousemove(function(event) {
        var x = event.pageX, y = event.pageY-(e.mainNav.hasClass("fixed") ? e.body.scrollTop() : 0), minX = dropdown.position().left, minY = e.mainNav.position().top, maxX = minX + dropdown.width(), maxY = minY + e.mainNav.height() + dropdown.height();
        if(x < minX || x > maxX || y < minY || y > maxY) {
          dropdown.addClass("hidden");
          e.document.off("mousemove");
          thisElement.removeClass("linger");
        }
      });
    });
  });
  // popups to share
  e.body.on("click", ".shareButtonLink", function() {
    window.open($(this).attr("href"), "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=500");
    return false;
  });
  e.facebookShareButton.attr({ href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href) });
  e.twitterShareButton.attr({ href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Come visit at Nutmeg Bowl for the best bowling in Fairfield County! " + window.location.href) });
  e.googlePlusShareButton.attr({ href: "https://plus.google.com/share?url=" + encodeURIComponent(window.location.href) });
  // scrolling menu
  e.window.scroll(function() {
    if(e.body.scrollTop() > e.header.height())
      e.mainNav.addClass("fixed");
    else 
      e.mainNav.removeClass("fixed");
  });
  // clickable .shoutButton for the homepage
  e.shoutButton.click(function() {
    window.location.href = $(this).data("href");
  });
  // .reveal functionality
  e.revealButton.click(function() {
    $(this).parent().toggleClass("revealed");
    $(this).next().slideToggle();
  });
  // clickable links for .categoryListItem for listing pages
  e.categoryListItem.click(function() {
    window.location.href = $(this).data("href");
  });
  // set footer margin top (0 if homepage)
  if(e.shoutButton.length > 0)
    e.footer.css({ marginTop: 0 }); 
  // mobile menu open/close
  e.menuButtons.click(function() {
    e.sideNav.slideToggle();
  });
  // search capability
  e.sideNavSearch.keyup(function(event) {
    if(event.which == 13)
      e.searchButton.click();
  });
  e.searchButton.click(function() {
    search(e.sideNavSearch.val());
  });
  // search function
  if(e.searchTerm.length == 1) {
    var urlParameter = /\?(.+)$/.exec(window.location.href);
    if(urlParameter) {
      var query = decodeURIComponent(urlParameter[1]).toLowerCase() || false;
      var searchResultsString = "";
      $.getJSON("res/search.json", function(data) {
        for(page in data) {
          if(data[page].title.toLowerCase() == query)
            window.location.href = data[page].url;
          if(data[page].url.indexOf("index") > 0 || data[page].title == "Search")
            continue;
          var pageString = data[page].string;
          var stringAround = "";
          if(pageString.toLowerCase().indexOf(query) > 0) {
            var regex = new RegExp(query, "ig");
            var match;
            var length = query.length;
            while(match = regex.exec(pageString)) {
              var start = (match.index-25 < 0) ? 0 : match.index-25;
              var end = (match.index+length+25 > pageString.length) ? pageString.length : match.index+length+25;
              stringAround += "<div class='searchPageResult'>" + pageString.substring(start, match.index) + "<span class='searchMatch rounded'>" + match[0] + "</span>" + pageString.substring(match.index+length, end);
              stringAround += "</div>";
            }
            searchResultsString += "<div class='searchPageMatch animate rounded pointer' data-href='" + data[page].url + "'><h3 class='searchPageTitle'>" + data[page].title + "</h3>" + stringAround + "</div>";
          }
        }
        e.searchTerm.text(query);
        e.searchResults.html(searchResultsString || "<p>No matches found.</p>");
      });
    } else {
      e.searchTerm.text(" ");
      e.searchResults.html("<p>Please enter search terms to perform a search.</p>");
    }
    e.document.on("click", ".searchPageMatch", function() {
      window.location.href = $(this).data("href");
    });
    e.searchSearch.click(function() {
      $(this).parent().addClass("shadow");
    });
    e.searchSearch.blur(function() {
      $(this).parent().removeClass("shadow");
    });
    e.searchSearch.keyup(function(event) {
      if(event.which == 13)
        e.searchIcon.click();
    });
    e.searchIcon.click(function() {
      search(e.searchSearch.val());
    });
  }
  // desktop search tools
  e.mainSearchIcon.click(function() {
    search(e.mainSearch.val());
    if(e.mainSearch.hasClass("hidden")) {
      e.mainSearch.focus();
      e.mainSearch.removeClass("hidden");
    } else {
      e.mainSearch.blur();
      e.mainSearch.addClass("hidden");
    }
    e.mainSearchIcon.toggleClass("active");
    e.dropdown.toggleClass("hidden");
  });
  e.mainSearch.keyup(function(event) {
    if(event.which == 13 || $(this).val() == "")
      e.mainSearchIcon.click();
  });

  // homepage scrolling effects; only for desktop
  var topPositions = [], currentIndex = -1, lastScrollTop = e.body.scrollTop(), scrollOk = true;
  if(e.shoutBox.length > 0 && e.window.width() > 750) {
    var scrollToIndex = function() {
      if(currentIndex >= 0 && currentIndex < topPositions.length)
        e.body.animate({ scrollTop: (topPositions[currentIndex]+(1080-e.window.height())/2) + "px" }, 500);
      if(currentIndex < 1)
        e.upButton.fadeOut();
      else
        e.upButton.fadeIn();
      if(currentIndex >= topPositions.length-1)
        e.downButton.fadeOut();
      else
        e.downButton.fadeIn();
      scrollOk = false;
      setTimeout(function() {
        scrollOk = true;
      }, 550);
      lastScrollTop = e.body.scrollTop();
    };
    e.window.scroll(function() {
      if(!scrollOk) {
        lastScrollTop = e.body.scrollTop();
        return;
      }
      if(currentIndex >= 0 && currentIndex < topPositions.length) {
        if(e.body.scrollTop() < lastScrollTop)
          currentIndex--;
        else if(e.body.scrollTop() > lastScrollTop)
          currentIndex++;
        else
          return;
      } else {
        if(currentIndex == -1 && e.body.scrollTop()+e.window.height() > topPositions[0] && e.body.scrollTop() > lastScrollTop)
          currentIndex = 0;
        else if(currentIndex >= topPositions.length && e.body.scrollTop() < topPositions[topPositions.length-1] + 1080 && e.body.scrollTop() < lastScrollTop)
          currentIndex = topPositions.length-1;
      }
      scrollToIndex();
    });
    e.upButton.click(function() {
      if(!scrollOk)
        return;
      currentIndex--;
      scrollToIndex();
    });
    e.downButton.click(function() {
      if(!scrollOk)
        return;
      currentIndex++;
      scrollToIndex();
    });
    e.body.keydown(function(event) {
      if(event.which == 40 && e.downButton.css("display") == "block") {
        event.preventDefault();
        e.downButton.click();
      } else if(event.which == 38 && e.upButton.css("display") == "block") {
        event.preventDefault();
        e.upButton.click();
      }
    });
  }

  // resize the page
  e.window.resize(resizeFunction).resize();
  // resize a little later
  setTimeout(function() {
    e.window.resize().scroll();
    e.document.scrollTop(0);
  }, 200);
});
