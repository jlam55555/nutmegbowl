$(function() {

  // array of elements; prevent repetitive DOM requestsa
  var e = {
    document: $(document),
    window: $(window),
    body: $("body"),
    footer: $("footer"),
    header: $("header"),
    shoutButton: $(".shoutButton"),
    mainNav: $("#mainNav"),
    dropdown: $(".dropdown"),
    dropdownLinks: $(".dropdownLinks"),
    facebookShareButton: $("#facebookShareButton"),
    twitterShareButton: $("#twitterShareButton"),
    googlePlusShareButton: $("#googlePlusShareButton"),
    revealButton: $(".revealButton"),
    categoryListItem: $(".categoryListItem")
  };
  
  // accessory functions
  var getPxValue = function(input) {
    return parseInt(input.substring(0, input.length-2));
  };

  // reposition the footer
  var docWidth, docHeight;
  var reposition = function() {
    e.footer.css({ top: docHeight-e.footer.height()-getPxValue(e.footer.css("padding-top"))*2 }).removeClass("static");
  };
  e.window.resize(function() {
    var extraPadding = e.shoutButton.length > 0 ? 0 : 50;
    e.body.css({ paddingTop: e.header.height() + e.mainNav.height(), paddingBottom: extraPadding + e.footer.height() + 2*getPxValue(e.footer.css("padding-top")) });
    e.footer.remove();
    docWidth = e.document.width() > e.window.width() ? e.document.width() : e.window.width();
    docHeight = e.document.height() > e.window.height() ? e.document.height() : e.window.height();
    e.body.append(e.footer);
    if(e.document.height() > e.window.height()) {
      e.footer.addClass("static").css({ marginTop: extraPadding });
      e.body.addClass("noBottom");
    } else {
      reposition();
      e.body.removeClass("noBottom");
    }
  });
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
        var x = event.pageX, y = event.pageY-e.body.scrollTop(), minX = dropdown.position().left, minY = e.mainNav.position().top, maxX = minX + dropdown.width(), maxY = minY + e.mainNav.height() + dropdown.height();
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

  // resize the page
  e.window.resize();
  setTimeout(function() {
    // resize again once everything loads
    e.window.resize();
  }, 500); 

});
